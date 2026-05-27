from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/drivers/{session_key}")
def get_drivers(session_key: int):
    r = requests.get(f'https://api.openf1.org/v1/drivers?session_key={session_key}')
    data = r.json()
    drivers = []
    for driver in data:
        drivers.append({
            "driver_number": driver.get("driver_number"),
            "full_name": driver.get("full_name"),
            "headshot_url": driver.get("headshot_url"),
            "team_name": driver.get("team_name"),
            "team_colour": driver.get("team_colour"),
        })
    return drivers

@app.get("/sessions/{year}")
def get_sessions(year: int):
    r = requests.get(f"https://api.openf1.org/v1/sessions?year={year}&session_type=Race")
    return r.json()
    
@app.get('/laps/{session_key}/{driver_number}')
def get_laps(session_key: int, driver_number: int):
    r = requests.get(f'https://api.openf1.org/v1/laps?session_key={session_key}&driver_number={driver_number}')
    return r.json()

@app.get('/stints/{session_key}/{driver_number}')
def get_stints(session_key: int, driver_number: int):
    r = requests.get(f'https://api.openf1.org/v1/stints?session_key={session_key}&driver_number={driver_number}')
    return r.json()

@app.get('/pitstops/{session_key}/{driver_number}')
def get_pit_stops(session_key: int, driver_number: int):
    r = requests.get(f'https://api.openf1.org/v1/pit?session_key={session_key}&driver_number={driver_number}')
    return r.json()