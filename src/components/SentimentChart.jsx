
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { supabase } from '../supabaseClient'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export default function SentimentChart({ refreshTrigger }) {
    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        fetchData()
    }, [refreshTrigger])

    const fetchData = async () => {
        try {
            // Fetch all votes
            // Note: In a real production app with millions of rows, you'd want to use a database function or materialized view for aggregation.
            const { data, error } = await supabase
                .from('votes')
                .select('vote_type, created_at')
                .order('created_at', { ascending: true })

            if (error) throw error

            processData(data)
        } catch (err) {
            console.error('Error fetching chart data:', err)
        }
    }

    const processData = (data) => {
        const votesByDate = {}

        data.forEach(vote => {
            const date = new Date(vote.created_at).toLocaleDateString()
            if (!votesByDate[date]) {
                votesByDate[date] = { bullish: 0, bearish: 0 }
            }
            votesByDate[date][vote.vote_type]++
        })

        const labels = Object.keys(votesByDate)
        const bullishData = labels.map(date => votesByDate[date].bullish)
        const bearishData = labels.map(date => votesByDate[date].bearish)

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Bullish',
                    data: bullishData,
                    borderColor: '#4ade80',
                    backgroundColor: 'rgba(74, 222, 128, 0.5)',
                    tension: 0.4,
                },
                {
                    label: 'Bearish',
                    data: bearishData,
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.5)',
                    tension: 0.4,
                },
            ],
        })
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e2e8f0'
                }
            },
            title: {
                display: true,
                text: 'Market Sentiment Over Time',
                color: '#e2e8f0'
            },
        },
        scales: {
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
            },
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
            }
        }
    }

    if (!chartData) return <div className="loading-chart">Loading Chart...</div>

    return (
        <div className="chart-container">
            <Line options={options} data={chartData} />
        </div>
    )
}
