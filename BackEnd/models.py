# models.py
from pydantic import BaseModel

class Appointment(BaseModel):
    patient_name: str
    contact_info: str
    appointment_type: str
    duration: int
    date: str      # YYYY-MM-DD
    time: str      # HH:MM
