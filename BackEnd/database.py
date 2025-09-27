# database.py
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Get MongoDB URL from environment variable or default to localhost
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

# Connect to MongoDB asynchronously
client = AsyncIOMotorClient(MONGO_URL)

# Select database
db = client["dentistDB"]

# Select appointments collection
appointments_collection = db["appointments"]
