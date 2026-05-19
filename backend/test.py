import requests

r = requests.get("https://api.openf1.org/v1/laps?session_key=9158&driver_number=1")
print(r.status_code)
print(r.json()[0])
r = requests.get("https://api.openf1.org/v1/sessions?year=2024&session_type=Race")
print(r.status_code)
print(r.json()[0])

