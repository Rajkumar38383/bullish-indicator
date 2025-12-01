
import { useEffect, useState, useRef } from 'react'
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
    Filler,
} from 'chart.js'
import { supabase } from '../supabaseClient'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

export default function SentimentChart({ refreshTrigger }) {
    const [chartData, setChartData] = useState(null)
    const chartRef = useRef(null)

    useEffect(() => {
        fetchData()
    }, [refreshTrigger])

    const fetchData = async () => {
        try {
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
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300)
                        gradient.addColorStop(0, 'rgba(74, 222, 128, 0.4)')
                        gradient.addColorStop(1, 'rgba(74, 222, 128, 0.0)')
                        return gradient
                    },
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#4ade80',
                    pointBorderColor: '#0f172a',
                    pointBorderWidth: 2,
                },
                {
                    label: 'Bearish',
                    data: bearishData,
                    borderColor: '#f87171',
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300)
                        gradient.addColorStop(0, 'rgba(248, 113, 113, 0.4)')
                        gradient.addColorStop(1, 'rgba(248, 113, 113, 0.0)')
                        return gradient
                    },
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#f87171',
                    pointBorderColor: '#0f172a',
                    pointBorderWidth: 2,
                },
            ],
        })
    }

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e2e8f0',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                }
            },
            title: {
                display: true,
                text: 'Market Sentiment Trends',
                color: '#f8fafc',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                padding: {
                    top: 10,
                    bottom: 20,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                borderColor: '#38bdf8',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || ''
                        if (label) {
                            label += ': '
                        }
                        label += context.parsed.y + ' votes'
                        return label
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 12,
                    },
                    stepSize: 1,
                },
                grid: {
                    color: '#334155',
                    drawBorder: false,
                }
            },
            x: {
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 12,
                    },
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: {
                    color: '#334155',
                    drawBorder: false,
                }
            }
        }
    }

    if (!chartData) return (
        <div className="loading-chart">
            <div className="loading-spinner"></div>
            <p>Loading Chart...</p>
        </div>
    )

    return (
        <div className="chart-container">
            <Line ref={chartRef} options={options} data={chartData} />
        </div>
    )
}
