import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function StatsDisplay({ refreshTrigger }) {
    const [stats, setStats] = useState({ bullish: 0, bearish: 0, total: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [refreshTrigger])

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .from('votes')
                .select('vote_type')

            if (error) throw error

            const bullish = data.filter(v => v.vote_type === 'bullish').length
            const bearish = data.filter(v => v.vote_type === 'bearish').length
            const total = data.length

            setStats({ bullish, bearish, total })
            setLoading(false)
        } catch (err) {
            console.error('Error fetching stats:', err)
            setLoading(false)
        }
    }

    const bullishPercent = stats.total > 0 ? Math.round((stats.bullish / stats.total) * 100) : 0
    const bearishPercent = stats.total > 0 ? Math.round((stats.bearish / stats.total) * 100) : 0

    if (loading) {
        return <div className="stats-loading">Loading stats...</div>
    }

    return (
        <div className="stats-display">
            <div className="stat-card bullish-card">
                <div className="stat-icon">🚀</div>
                <div className="stat-content">
                    <div className="stat-label">Bullish</div>
                    <div className="stat-value">{stats.bullish}</div>
                    <div className="stat-percent">{bullishPercent}%</div>
                </div>
                <div className="stat-bar">
                    <div
                        className="stat-bar-fill bullish-fill"
                        style={{ width: `${bullishPercent}%` }}
                    ></div>
                </div>
            </div>

            <div className="stat-card bearish-card">
                <div className="stat-icon">🐻</div>
                <div className="stat-content">
                    <div className="stat-label">Bearish</div>
                    <div className="stat-value">{stats.bearish}</div>
                    <div className="stat-percent">{bearishPercent}%</div>
                </div>
                <div className="stat-bar">
                    <div
                        className="stat-bar-fill bearish-fill"
                        style={{ width: `${bearishPercent}%` }}
                    ></div>
                </div>
            </div>

            <div className="stat-card total-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                    <div className="stat-label">Total Votes</div>
                    <div className="stat-value">{stats.total}</div>
                </div>
            </div>
        </div>
    )
}
