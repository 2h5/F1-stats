import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import './TyreStrategyChart.css'

const COMPOUND_COLOURS = {
  SOFT: '#ff3333',
  MEDIUM: '#ffd700',
  HARD: '#ffffff',
  INTERMEDIATE: '#39b54a',
  WET: '#00a2ff',
}

const renderTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null
  }

  const { lap, compound } = payload[0].payload

  return (
    <div className="tyre-tooltip">
      <div>Lap: {lap}</div>
      <div>Compound: {compound}</div>
    </div>
  )
}

function TyreStrategyChart({ stints }) {
  const data = stints
    .slice()
    .sort((a, b) => a.lap_start - b.lap_start)
    .flatMap(stint => {
      const laps = []
      for (let lap = stint.lap_start; lap <= stint.lap_end; lap++) {
        laps.push({ lap, compound: stint.compound })
      }
      return laps
    })

  return (
    <div className="chart-section">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={0} margin={{ top: 10, right: 24, bottom: 16, left: 24 }}>
          <XAxis
            dataKey="lap"
            ticks={data.filter(entry => entry.lap % 5 === 0).map(entry => entry.lap)}
            interval={0}
            label={{ value: 'Lap Number', position: 'insideBottom', offset: -10 }}
          />
          <YAxis hide />
          <Tooltip content={renderTooltip} />
          <Bar dataKey={() => 1}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COMPOUND_COLOURS[entry.compound] || '#7300ff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TyreStrategyChart
