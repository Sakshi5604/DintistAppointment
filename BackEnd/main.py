from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Appointment
from database import appointments_collection
from datetime import datetime

app = FastAPI()

# Allow React frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route
@app.get("/")
def home():
    return {"message": "Backend is running!"}

# Get appointments by date
@app.get("/appointments")
async def get_appointments(date: str):
    appointments = await appointments_collection.find({"date": date}).to_list(100)
    return appointments
