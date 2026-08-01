// Vercel serverless function.
// Keeps the Gemini API key server-side. Deploy on Vercel and set
// GEMINI_API_KEY as an environment variable in the project settings.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' })
    return
  }

  const { systemPrompt, contents, jsonMode } = req.body || {}

  if (!systemPrompt || !Array.isArray(contents)) {
    res.status(400).json({ error: 'systemPrompt and contents are required.' })
    return
  }

  const model = 'gemini-2.0-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: jsonMode
      ? { responseMimeType: 'application/json', temperature: 0.6 }
      : { temperature: 0.6 }
  }

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await geminiRes.json()

    if (!geminiRes.ok) {
      res.status(geminiRes.status).json({ error: data?.error?.message || 'Gemini API error' })
      return
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
    res.status(200).json({ text })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unknown server error' })
  }
}
