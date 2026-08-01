import { useState } from 'react'

const EXAMPLES = [
  'A hospital app for booking appointments and viewing prescriptions',
  'A food delivery app connecting customers, restaurants and riders',
  'A jewelry try-on app where customers preview pieces before buying',
  'A school management system for attendance, fees and results'
]

export default function IdeaInput({ onSubmit, loading }) {
  const [idea, setIdea] = useState('')

  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="label-tag mb-3">Sheet 01 — Idea Intake</p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-blueprint-paper mb-3">
        What are you building?
      </h1>
      <p className="text-blueprint-line/70 mb-8">
        Describe your app idea in a sentence. The architect will ask only what it
        actually needs to know before drafting the full blueprint.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (idea.trim()) onSubmit(idea.trim())
        }}
        className="blueprint-panel p-4 sm:p-5 text-left"
      >
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. I want to build a hospital app…"
          rows={3}
          className="w-full bg-transparent resize-none outline-none text-blueprint-paper placeholder:text-blueprint-line/40 font-body text-base"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!idea.trim() || loading}
            className="px-5 py-2 bg-redline hover:bg-redline-dark disabled:opacity-40 disabled:cursor-not-allowed text-blueprint-950 font-display font-semibold text-sm rounded-sm transition-colors"
          >
            {loading ? 'Starting…' : 'Start designing →'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-left">
        <p className="label-tag mb-2">Or try an example</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setIdea(ex)}
              className="text-xs font-mono px-3 py-1.5 border border-blueprint-700 rounded-sm text-blueprint-line/70 hover:border-redline hover:text-redline transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
