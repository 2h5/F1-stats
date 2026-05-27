import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [selectedYear, setSelectedYear] = useState('')
  
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState('')
 
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState('')
  
  const [laps, setLaps] = useState([])
  const [stints, setStints] = useState([])
  const [pitStops, setPitStops] = useState([])

  const selectedDriverInfo = drivers.find(driver => driver.driver_number == selectedDriver)

  const formatLapTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = (seconds % 60).toFixed(3).padStart(6, '0')
    return `${minutes}:${remainingSeconds}`
  }

  const validLaps = laps.filter(lap => lap.lap_duration)
  let fastestLap = validLaps[0]
  for (const lapToCheck of validLaps) {
    if (lapToCheck.lap_duration < fastestLap.lap_duration) {
      fastestLap = lapToCheck
    }
  }

  useEffect(() => {
  if (!selectedYear) return
  fetch(`http://localhost:8000/sessions/${selectedYear}`).then(res => res.json())
    .then(data => setSessions(data))
  }, [selectedYear])

  useEffect(() => {
    if (!selectedSession) {
      setDrivers([])
      setSelectedDriver('')
      return
    }
  fetch(`http://localhost:8000/drivers/${selectedSession}`).then(res => res.json())
    .then(data => {
      setDrivers(data)
      setSelectedDriver('')
      console.log(data)
    })
    }, [selectedSession])

  useEffect(() => {
    if (!selectedSession || !selectedDriver) {
      return
  }
  Promise.all([
  fetch(`http://localhost:8000/laps/${selectedSession}/${selectedDriver}`).then(res => res.json()),
  fetch(`http://localhost:8000/stints/${selectedSession}/${selectedDriver}`).then(res => res.json()),
  fetch(`http://localhost:8000/pitstops/${selectedSession}/${selectedDriver}`).then(res => res.json()),
  ]).then(([lapsData, stintsData, pitStopsData]) => {
    setLaps(lapsData)
    setStints(stintsData)
    setPitStops(pitStopsData)
    console.log(lapsData, stintsData, pitStopsData)
  })
  }, [selectedSession, selectedDriver])
    
  
  return (
    <div>
      <h1>F1 Stats</h1>
      {selectedDriverInfo?.headshot_url && (
      <img
      src={selectedDriverInfo.headshot_url}
      alt={selectedDriverInfo.full_name}
      />
        )}
      <br /> 
      <label>
      Pick a year:
        <select 
        value={selectedYear} 
        onChange={(e) => {
          setSelectedYear(e.target.value)
          setSelectedSession('')
          setSelectedDriver('')
          setDrivers([])
          setLaps([])
          setStints([])
          setPitStops([])
        }}>
        <option value="" disabled>Pick a year</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
      </select>
      </label>

      <label>
          Pick a session:
          <select
          name = "selectedSession"
          value = {selectedSession}
          onChange={(e) => {
            setSelectedSession(e.target.value)
            setSelectedDriver('')
            setLaps([])
            setStints([])
            setPitStops([])
          }}
          >
            <option value= "" disabled>Pick a session</option>
            {sessions.map(session => (
              <option key = {session.session_key} value = {session.session_key}>
                {session.country_name} - 
                {session.session_name} - 
                {session.date_start.split('T')[0]}
              </option>
            ))}
          </select>
      </label>
      <label>
        Pick a driver:
        <select 
        name ="selectedDriver"
        value = {selectedDriver}
        disabled={!selectedSession}
        onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <option value="" disabled>Pick a driver</option>
          {drivers.map(driver => (
            <option key = {driver.driver_number} value = {driver.driver_number}>
              {driver.full_name}
              </option>
          ))}
        </select>
      </label>
      <br />
      <br />

      {laps.length > 0 && (
        <div className="chart-section">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart key={selectedDriver} data={laps} margin={{ top: 10, right: 24, bottom: 16, left: 24 }}>
              <XAxis dataKey="lap_number" interval={2} />
              <YAxis tickFormatter={formatLapTime} width={80} domain={['dataMin', 'dataMax']} />
              <Tooltip formatter={(value) => [formatLapTime(value), 'Lap Time']} />
              <Line
                type="monotone"
                dataKey="lap_duration"
                stroke={`#${selectedDriverInfo?.team_colour || '7300ff'}`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/*
      {laps.length > 0 && (
        <div className="table-section">
          <h2>Lap Data</h2>
          <table className="data-table">
          <thead>
            <tr>
              <th>Lap</th>
              <th>Lap Time</th>
              <th> Sector 1</th>
              <th>Sector 2</th>
              <th>Sector 3</th>
            </tr>
            </thead>
           <tbody>
          {laps.map(lap => (
            <tr 
            key={lap.lap_number}
            className={lap.lap_number === fastestLap?.lap_number ? 'fastest-lap' : ''}
            >
              <td>{lap.lap_number}</td>
              <td>{lap.lap_duration}</td>
              <td>{lap.duration_sector_1}</td>
              <td>{lap.duration_sector_2}</td>
              <td>{lap.duration_sector_3}</td>
        </tr>
      ))}
        </tbody>
      </table>
    </div>
      )}
    */}


      </div>
  )}
export default App
