import ReactMarkdown from 'react-markdown'
import ExportBar from './ExportBar.jsx'

export default function BlueprintViewer({ appName, idea, history, markdown, onSave, onRestart }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <p className="label-tag mb-1">Final Blueprint</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-blueprint-paper">{appName}</h1>
          <p className="text-blueprint-line/60 text-sm mt-1 max-w-lg">{idea}</p>
        </div>
        <ExportBar appName={appName} idea={idea} history={history} markdown={markdown} onSave={onSave} />
      </div>

      <div className="blueprint-panel scan-line p-5 sm:p-8">
        <div className="flex items-center justify-between border-b border-blueprint-500/30 pb-3 mb-5">
          <span className="label-tag">Doc-Set / Rev A</span>
          <span className="label-tag">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="markdown-body">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={onRestart}
          className="text-sm font-mono text-blueprint-line/50 hover:text-redline transition-colors"
        >
          ← Design another app
        </button>
      </div>
    </div>
  )
}
