
import { useState } from 'react'
import VoteSection from './components/VoteSection'
import SentimentChart from './components/SentimentChart'
import StatsDisplay from './components/StatsDisplay'
import SentimentGauge from './components/SentimentGauge'

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

        <StatsDisplay refreshTrigger={refreshTrigger} />

        <div className="visualization-grid">
          <SentimentGauge refreshTrigger={refreshTrigger} />
          <SentimentChart refreshTrigger={refreshTrigger} />
        </div>
      </main>

      <footer>
        <p>Built with ❤️ for the crypto community</p>
      </footer>
    </div>
  )
}

export default App
