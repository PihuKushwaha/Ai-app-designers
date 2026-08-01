import { useState } from 'react'

export default function QuestionCard({ question, onAnswer, loading }) {
  const [freeText, setFreeText] = useState('')

  return (
    <div className="blueprint-panel p-5 sm:p-6 max-w-xl mx-auto">
      <p className="label-tag mb-2">Architect asks</p>
      <h2 className="font-display text-xl text-blueprint-paper mb-5">{question.question}</h2>

      {question.options?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {question.options.map((opt) => (
            <button
              key={opt}
              disabled={loading}
              onClick={() => onAnswer(opt)}
              className="px-4 py-2 border border-blueprint-500/50 rounded-sm text-sm text-blueprint-paper hover:border-redline hover:bg-redline/10 hover:text-redline transition-colors disabled:opacity-40"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {question.allowFreeText !== false && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (freeText.trim()) {
              onAnswer(freeText.trim())
              setFreeText('')
            }
          }}
          className="flex gap-2 mt-2"
        >
          <input
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Or type your own answer…"
            disabled={loading}
            className="flex-1 bg-blueprint-950/60 border border-blueprint-700 rounded-sm px-3 py-2 text-sm outline-none focus:border-redline text-blueprint-paper placeholder:text-blueprint-line/40"
          />
          <button
            type="submit"
            disabled={loading || !freeText.trim()}
            className="px-4 py-2 border border-blueprint-500/50 rounded-sm text-sm text-blueprint-line/80 hover:border-redline hover:text-redline transition-colors disabled:opacity-30"
          >
            Send
          </button>
        </form>
      )}
    </div>
  )
}
