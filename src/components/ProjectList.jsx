export default function ProjectList({ projects, onOpen, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="w-full sm:w-96 h-full bg-blueprint-900 border-l border-blueprint-700 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <p className="label-tag">Saved Blueprints</p>
          <button onClick={onClose} className="text-blueprint-line/60 hover:text-redline text-lg leading-none">
            ×
          </button>
        </div>

        {projects.length === 0 && (
          <p className="text-blueprint-line/50 text-sm">Nothing saved yet. Generate a blueprint and hit "Save project".</p>
        )}

        <div className="space-y-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpen(p)}
              className="w-full text-left blueprint-panel px-4 py-3 hover:border-redline/60 transition-colors"
            >
              <p className="font-display text-sm text-blueprint-paper">{p.appName}</p>
              <p className="text-xs text-blueprint-line/50 mt-1 line-clamp-2">{p.idea}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
