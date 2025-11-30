
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function VoteSection({ onVote }) {
    const [hasVoted, setHasVoted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const lastVoteDate = localStorage.getItem('lastVoteDate')
        const today = new Date().toISOString().split('T')[0]
        if (lastVoteDate === today) {
            setHasVoted(true)
        }
    }, [])

    const handleVote = async (type) => {
        if (hasVoted) return

        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('votes')
                .insert([{ vote_type: type }])

            if (error) throw error

            localStorage.setItem('lastVoteDate', new Date().toISOString().split('T')[0])
            setHasVoted(true)
            if (onVote) onVote()
        } catch (err) {
            console.error('Error voting:', err)
            setError('Failed to cast vote. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (hasVoted) {
        return (
            <div className="vote-container voted">
                <h2>Thanks for voting today!</h2>
                <p>Come back tomorrow to share your sentiment.</p>
            </div>
        )
    }

    return (
        <div className="vote-container">
            <h2>How are you feeling about the market?</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="vote-buttons">
                <button
                    className="vote-btn bullish"
                    onClick={() => handleVote('bullish')}
                    disabled={loading}
                >
                    🚀 Bullish
                </button>
                <button
                    className="vote-btn bearish"
                    onClick={() => handleVote('bearish')}
                    disabled={loading}
                >
                    🐻 Bearish
                </button>
            </div>
        </div>
    )
}
