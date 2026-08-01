import { useState } from 'react'
import { exportMarkdown, exportJson } from '../services/exportService.js'

export default function ExportBar({ appName, idea, history, markdown, onSave }) {
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    await onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-wrap gap-2 shrink-0">
      <button
        onClick={() => exportMarkdown(appName, markdown)}
        className="px-3 py-1.5 border border-blueprint-500/50 rounded-sm text-xs font-mono text-blueprint-line/80 hover:border-redline hover:text-redline transition-colors"
      >
        Export .md
      </button>
      <button
        onClick={() => exportJson(appName, { idea, history, markdown })}
        className="px-3 py-1.5 border border-blueprint-500/50 rounded-sm text-xs font-mono text-blueprint-line/80 hover:border-redline hover:text-redline transition-colors"
      >
        Export .json
      </button>
      <button
        onClick={handleSave}
        className="px-3 py-1.5 bg-redline hover:bg-redline-dark rounded-sm text-xs font-mono font-semibold text-blueprint-950 transition-colors"
      >
        {saved ? 'Saved ✓' : 'Save project'}
      </button>
    </div>
  )
}
