import { useEffect, useState } from 'react'
import QuestionCard from './QuestionCard.jsx'
import { getNextQuestion } from '../services/aiService.js'

export default function ConversationFlow({ idea, onReady, onError }) {
  const [history, setHistory] = useState([{ role: 'idea', text: idea }])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answeredCount, setAnsweredCount] = useState(0)

  useEffect(() => {
    fetchNext([{ role: 'idea', text: idea }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchNext(nextHistory) {
    setLoading(true)
    try {
      const result = await getNextQuestion(nextHistory)
      if (result.status === 'ready') {
        onReady(nextHistory, result.summary)
        return
      }
      setCurrentQuestion(result)
      setHistory([...nextHistory, { role: 'question', text: result.question }])
    } catch (err) {
      onError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleAnswer(answer) {
    const nextHistory = [...history, { role: 'answer', text: answer }]
    setAnsweredCount((c) => c + 1)
    fetchNext(nextHistory)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="label-tag text-center mb-4">
        {answeredCount === 0 ? 'Reading your idea…' : `Question ${answeredCount + 1}`}
      </p>

      {loading && !currentQuestion && (
        <div className="text-center text-blueprint-line/60 font-mono text-sm animate-pulse">
          Drafting next question…
        </div>
      )}

      {currentQuestion && (
        <QuestionCard question={currentQuestion} onAnswer={handleAnswer} loading={loading} />
      )}

      {loading && currentQuestion && (
        <p className="text-center text-blueprint-line/40 font-mono text-xs mt-3 animate-pulse">
          thinking…
        </p>
      )}
    </div>
  )
}
