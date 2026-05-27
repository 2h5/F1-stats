import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './LapTimeChart.css'

const FASTEST_LAP_COLOUR = '#a855f7'

const formatLapTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = (seconds % 60).toFixed(3).padStart(6, '0')
  return `${minutes}:${remainingSeconds}`
}

const getRoundedLapTimeDomain = ([dataMin, dataMax]) => {
  const padding = 2
  const step = 5
  return [
    Math.max(0, Math.floor((dataMin - padding) / step) * step),
    Math.ceil((dataMax + padding) / step) * step,
  ]
}

function LapTimeChart({ laps, selectedDriver, teamColour }) {
  const validLaps = laps.filter(lap => lap.lap_duration)
  const fastestLap = validLaps.reduce((fastest, lap) => {
    if (!fastest || lap.lap_duration < fastest.lap_duration) {
      return lap
    }

    return fastest
  }, null)

  const renderLapDot = (props) => {
    const { cx, cy, payload, stroke } = props
    const isFastest = payload.lap_number === fastestLap?.lap_number

    return (
      <circle
        cx={cx}
        cy={cy}
        r={isFastest ? 6 : 3}
        fill={isFastest ? FASTEST_LAP_COLOUR : '#ffffff'}
        stroke={isFastest ? '#ffffff' : stroke}
        strokeWidth={isFastest ? 2 : 1}
      />
    )
  }

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null
    }

    const lap = payload[0].payload
    const isFastest = lap.lap_number === fastestLap?.lap_number

    return (
      <div className="lap-tooltip">
        <div className="lap-tooltip-lap">Lap: {label}</div>
        {isFastest && (
          <div className="lap-tooltip-fastest">Fastest Lap</div>
        )}
        <div>
          <span className="lap-tooltip-label">Lap Time</span>
          {`: ${formatLapTime(lap.lap_duration)}`}
        </div>
      </div>
    )
  }

  return (
    <div className="chart-section">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart key={selectedDriver} data={laps} margin={{ top: 10, right: 24, bottom: 16, left: 24 }}>
          <XAxis dataKey="lap_number" interval={2} />
          <YAxis
            tickFormatter={formatLapTime}
            width={80}
            domain={getRoundedLapTimeDomain}
          />
          <Tooltip content={renderTooltip} />
          <Line
            type="monotone"
            dataKey="lap_duration"
            stroke={`#${teamColour || '7300ff'}`}
            dot={renderLapDot}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LapTimeChart
