// Vercel serverless function.
// Calls Cloudflare Workers AI (reliable free tier, no billing account needed).
// Set these in Vercel Project Settings > Environment Variables:
//   CF_ACCOUNT_ID  — your Cloudflare account ID
//   CF_API_TOKEN   — a Cloudflare API token with "Workers AI" read/write access

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const accountId = process.env.CF_ACCOUNT_ID
  const apiToken = process.env.CF_API_TOKEN
  if (!accountId || !apiToken) {
    res.status(500).json({ error: 'CF_ACCOUNT_ID / CF_API_TOKEN not configured on the server.' })
    return
  }

  const { systemPrompt, contents, jsonMode } = req.body || {}

  if (!systemPrompt || !Array.isArray(contents)) {
    res.status(400).json({ error: 'systemPrompt and contents are required.' })
    return
  }

  // Convert the Gemini-style {role, parts:[{text}]} history into plain chat messages.
  const messages = [
    { role: 'system', content: systemPrompt },
    ...contents.map((c) => ({
      role: c.role === 'model' ? 'assistant' : 'user',
      content: (c.parts || []).map((p) => p.text).join('\n')
    }))
  ]

  if (jsonMode) {
    messages[0].content += '\n\nRespond with ONLY valid JSON. No markdown fences, no commentary.'
  }

  const model = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`

  try {
    const cfRes = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages, temperature: 0.6, max_tokens: 4000 })
    })

    const data = await cfRes.json()

    if (!cfRes.ok || data.success === false) {
      const message = data?.errors?.[0]?.message || 'Cloudflare Workers AI error'
      res.status(cfRes.status || 500).json({ error: message })
      return
    }

    let text = data?.result?.response || ''

    // Some models wrap JSON answers in markdown fences even when asked not to — strip them.
    if (jsonMode) {
      text = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')
    }

    res.status(200).json({ text })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unknown server error' })
  }
}