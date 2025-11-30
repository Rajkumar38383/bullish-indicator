
import { useState } from 'react'
import VoteSection from './components/VoteSection'
import SentimentChart from './components/SentimentChart'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleVote = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="app-container">
      <header>
        <h1>Crypto Sentiment Tracker</h1>
        <p>What's the market vibe today?</p>
      </header>

      <main>
        <VoteSection onVote={handleVote} />
        <SentimentChart refreshTrigger={refreshTrigger} />
      </main>

      <footer>
        <p>Built with ❤️ for the community</p>
      </footer>
    </div>
  )
}

export default App
