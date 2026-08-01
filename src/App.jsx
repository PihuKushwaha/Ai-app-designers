import { useEffect, useState } from 'react'
import IdeaInput from './components/IdeaInput.jsx'
import ConversationFlow from './components/ConversationFlow.jsx'
import BlueprintViewer from './components/BlueprintViewer.jsx'
import ProgressStepper from './components/ProgressStepper.jsx'
import ProjectList from './components/ProjectList.jsx'
import { generateBlueprint } from './services/aiService.js'
import { ensureSignedIn, saveBlueprint, subscribeToBlueprints } from './firebase.js'

function deriveAppName(idea) {
  const cleaned = idea
    .replace(/^i want to (build|make|create)\s*(a|an)?\s*/i, '')
    .replace(/^(a|an)\s+/i, '')
    .trim()
  const words = cleaned.split(/\s+/).slice(0, 5)
  return words.map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ')
}

export default function App() {
  const [stage, setStage] = useState('idea') // idea | conversation | generating | blueprint
  const [idea, setIdea] = useState('')
  const [history, setHistory] = useState([])
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState('')
  const [uid, setUid] = useState(null)
  const [projects, setProjects] = useState([])
  const [showProjects, setShowProjects] = useState(false)

  useEffect(() => {
    ensureSignedIn((user) => setUid(user.uid))
  }, [])

  useEffect(() => {
    if (!uid) return
    const unsub = subscribeToBlueprints(uid, setProjects)
    return () => unsub()
  }, [uid])

  function handleIdeaSubmit(text) {
    setIdea(text)
    setError('')
    setStage('conversation')
  }

  async function handleReady(fullHistory) {
    setHistory(fullHistory)
    setStage('generating')
    try {
      const result = await generateBlueprint(fullHistory)
      setMarkdown(result)
      setStage('blueprint')
    } catch (err) {
      setError(err.message)
      setStage('idea')
    }
  }

  function handleRestart() {
    setStage('idea')
    setIdea('')
    setHistory([])
    setMarkdown('')
    setError('')
  }

  async function handleSave() {
    if (!uid) return
    await saveBlueprint(uid, { appName: deriveAppName(idea), idea, history, markdown })
  }

  function handleOpenProject(p) {
    setIdea(p.idea)
    setHistory(p.history || [])
    setMarkdown(p.markdown)
    setStage('blueprint')
    setShowProjects(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-blueprint-700/60 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-redline rounded-sm rotate-45" />
          <span className="font-display font-semibold tracking-tight text-blueprint-paper">AI App Designer</span>
        </div>
        <button
          onClick={() => setShowProjects(true)}
          className="text-xs font-mono text-blueprint-line/60 hover:text-redline transition-colors"
        >
          My Blueprints ({projects.length})
        </button>
      </header>

      <main className="flex-1 px-5 py-10 sm:py-14">
        <div className="mb-10">
          <ProgressStepper
            stage={
              stage === 'idea' ? 0 : stage === 'conversation' ? 2 : stage === 'generating' ? 4 : 5
            }
          />
        </div>

        {error && (
          <p className="text-center text-redline font-mono text-sm mb-6">{error}</p>
        )}

        {stage === 'idea' && <IdeaInput onSubmit={handleIdeaSubmit} loading={false} />}

        {stage === 'conversation' && (
          <ConversationFlow idea={idea} onReady={handleReady} onError={(e) => { setError(e); setStage('idea') }} />
        )}

        {stage === 'generating' && (
          <div className="text-center">
            <p className="label-tag mb-2">Sheet 06 — Drafting</p>
            <p className="font-display text-xl text-blueprint-paper animate-pulse">
              Drafting the full blueprint…
            </p>
            <p className="text-blueprint-line/50 text-sm mt-2">
              Requirements, screens, database, API, security, testing — assembling now.
            </p>
          </div>
        )}

        {stage === 'blueprint' && (
          <BlueprintViewer
            appName={deriveAppName(idea)}
            idea={idea}
            history={history}
            markdown={markdown}
            onSave={handleSave}
            onRestart={handleRestart}
          />
        )}
      </main>

      <footer className="px-5 py-4 text-center text-blueprint-line/30 text-xs font-mono">
        AI App Designer — idea to blueprint, before a single line of code
      </footer>

      {showProjects && (
        <ProjectList projects={projects} onOpen={handleOpenProject} onClose={() => setShowProjects(false)} />
      )}
    </div>
  )
}
