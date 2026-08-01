const STAGES = ['Idea', 'Requirements', 'Roles', 'Flow', 'Screens', 'Blueprint']

export default function ProgressStepper({ stage }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1">
      {STAGES.map((s, i) => {
        const active = i === stage
        const done = i < stage
        return (
          <div key={s} className="flex items-center gap-1 shrink-0">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm font-mono text-[11px] uppercase tracking-wide transition-colors ${
                active
                  ? 'border-redline text-redline bg-redline/10'
                  : done
                  ? 'border-blueprint-500/50 text-blueprint-line/70'
                  : 'border-blueprint-700 text-blueprint-line/30'
              }`}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{s}</span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`w-4 h-px ${done ? 'bg-blueprint-500/50' : 'bg-blueprint-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
