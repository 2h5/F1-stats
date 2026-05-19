import { useState, useEffect } from 'react'

function App() {
  const [selectedYear, setSelectedYear] = useState('')
  
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState('')
 
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState('')
  
  useEffect(() => {
  if (!selectedYear) return
  fetch(`http://localhost:8000/sessions/${selectedYear}`)
    .then(res => res.json())
    .then(data => setSessions(data))
  }, [selectedYear])

  useEffect(() => {
    if (!selectedSession) {
      setDrivers([])
      setSelectedDriver('')
      return
    }
  fetch(`http://localhost:8000/drivers/${selectedSession}`)
    .then(res => res.json())
    .then(data => {
      setDrivers(data)
      setSelectedDriver('')
      console.log(data)
    })
    }, [selectedSession])
  
  return (
    <div>
      <h1>F1 Stats</h1>
      <br /> 
      <label>
        <select 
        value={selectedYear} 
        onChange={(e) => setSelectedYear(e.target.value)}>
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
          onChange = {(e) => setSelectedSession(e.target.value)}
          >
            <option value= "" disabled>Pick a session</option>
            {sessions.map(session => (
              <option key = {session.session_key} value = {session.session_key}>
                {session.country_name} - {session.session_name} - {session.date_start.split('T')[0]}
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
            <option key = {driver.driver_number} value = {driver.driver_number}>{driver.full_name}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
export default App
