import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function SentimentGauge({ refreshTrigger }) {
    const [sentiment, setSentiment] = useState(50) // 0 = extreme bearish, 50 = neutral, 100 = extreme bullish
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSentiment()
    }, [refreshTrigger])

    const fetchSentiment = async () => {
        try {
            const { data, error } = await supabase
                .from('votes')
                .select('vote_type')

            if (error) throw error

            if (data.length === 0) {
                setSentiment(50)
                setLoading(false)
                return
            }

            const bullish = data.filter(v => v.vote_type === 'bullish').length
            const total = data.length
            const sentimentValue = (bullish / total) * 100

            setSentiment(sentimentValue)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching sentiment:', err)
            setLoading(false)
        }
    }

    const getSentimentLabel = () => {
        if (sentiment >= 80) return 'Extremely Bullish'
        if (sentiment >= 60) return 'Bullish'
        if (sentiment >= 40) return 'Neutral'
        if (sentiment >= 20) return 'Bearish'
        return 'Extremely Bearish'
    }

    const getSentimentColor = () => {
        if (sentiment >= 60) return '#4ade80'
        if (sentiment >= 40) return '#fbbf24'
        return '#f87171'
    }

    const rotation = (sentiment / 100) * 180 - 90 // -90 to 90 degrees

    if (loading) {
        return <div className="gauge-loading">Loading sentiment...</div>
    }

    return (
        <div className="sentiment-gauge">
            <h3>Market Sentiment</h3>
            <div className="gauge-container">
                <svg viewBox="0 0 200 120" className="gauge-svg">
                    {/* Background arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />
                    {/* Colored segments */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 68 36"
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="20"
                        strokeLinecap="round"
                        opacity="0.3"
                    />
                    <path
                        d="M 68 36 A 80 80 0 0 1 132 36"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="20"
                        strokeLinecap="round"
                        opacity="0.3"
                    />
                    <path
                        d="M 132 36 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="20"
                        strokeLinecap="round"
                        opacity="0.3"
                    />
                    {/* Needle */}
                    <g transform={`rotate(${rotation} 100 100)`}>
                        <line
                            x1="100"
                            y1="100"
                            x2="100"
                            y2="30"
                            stroke={getSentimentColor()}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <circle cx="100" cy="100" r="8" fill={getSentimentColor()} />
                    </g>
                </svg>
                <div className="gauge-labels">
                    <span className="gauge-label-left">Bearish</span>
                    <span className="gauge-label-right">Bullish</span>
                </div>
            </div>
            <div className="sentiment-info">
                <div className="sentiment-label" style={{ color: getSentimentColor() }}>
                    {getSentimentLabel()}
                </div>
                <div className="sentiment-value">{Math.round(sentiment)}% Bullish</div>
            </div>
        </div>
    )
}
