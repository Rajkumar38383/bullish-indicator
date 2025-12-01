
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function VoteSection({ onVote }) {
    const [hasVoted, setHasVoted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [votedType, setVotedType] = useState(null)

    useEffect(() => {
        const lastVoteDate = localStorage.getItem('lastVoteDate')
        const lastVoteType = localStorage.getItem('lastVoteType')
        const today = new Date().toISOString().split('T')[0]
        if (lastVoteDate === today) {
            setHasVoted(true)
            setVotedType(lastVoteType)
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
            localStorage.setItem('lastVoteType', type)
            setHasVoted(true)
            setVotedType(type)
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
            <div className={`vote-container voted ${votedType}-voted`}>
                <div className="voted-icon">
                    {votedType === 'bullish' ? '🎉' : '✅'}
                </div>
                <h2>Vote Recorded!</h2>
                <p className="voted-message">
                    You voted <strong>{votedType === 'bullish' ? 'Bullish 🚀' : 'Bearish 🐻'}</strong>
                </p>
                <p className="comeback-message">Come back tomorrow to share your sentiment again.</p>
            </div>
        )
    }

    return (
        <div className="vote-container">
            <h2 className="vote-title">How are you feeling about the market?</h2>
            <p className="vote-subtitle">Cast your vote and see what the community thinks</p>
            {error && <p className="error-message">{error}</p>}
            <div className="vote-buttons">
                <button
                    className="vote-btn bullish"
                    onClick={() => handleVote('bullish')}
                    disabled={loading}
                >
                    <span className="vote-icon">🚀</span>
                    <span className="vote-text">Bullish</span>
                    <span className="vote-description">To the moon!</span>
                </button>
                <button
                    className="vote-btn bearish"
                    onClick={() => handleVote('bearish')}
                    disabled={loading}
                >
                    <span className="vote-icon">🐻</span>
                    <span className="vote-text">Bearish</span>
                    <span className="vote-description">Time to hibernate</span>
                </button>
            </div>
            {loading && <p className="loading-message">Submitting your vote...</p>}
        </div>
    )
}
