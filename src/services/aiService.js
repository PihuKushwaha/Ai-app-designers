import {
  ARCHITECT_PERSONA,
  QUESTION_MODE_INSTRUCTIONS,
  BLUEPRINT_MODE_INSTRUCTIONS
} from '../data/systemPrompt.js'

async function callApi({ systemPrompt, contents, jsonMode }) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, contents, jsonMode })
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Request failed')
  }
  return data.text
}

// history: array of { role: 'idea' | 'question' | 'answer', text: string }
export async function getNextQuestion(history) {
  const contents = history.map((h) => ({
    role: h.role === 'question' ? 'model' : 'user',
    parts: [{ text: h.text }]
  }))

  const raw = await callApi({
    systemPrompt: `${ARCHITECT_PERSONA}\n\n${QUESTION_MODE_INSTRUCTIONS}`,
    contents,
    jsonMode: true
  })

  try {
    return JSON.parse(raw)
  } catch {
    // Fall back to treating the whole reply as a freeform question if the
    // model didn't return clean JSON.
    return { status: 'question', question: raw, options: [], allowFreeText: true }
  }
}

export async function generateBlueprint(history) {
  const transcript = history
    .map((h) => {
      if (h.role === 'idea') return `App idea: ${h.text}`
      if (h.role === 'question') return `Q: ${h.text}`
      return `A: ${h.text}`
    })
    .join('\n')

  const contents = [
    {
      role: 'user',
      parts: [{ text: `Full conversation so far:\n\n${transcript}\n\nGenerate the complete blueprint now.` }]
    }
  ]

  return callApi({
    systemPrompt: `${ARCHITECT_PERSONA}\n\n${BLUEPRINT_MODE_INSTRUCTIONS}`,
    contents,
    jsonMode: false
  })
}
