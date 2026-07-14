from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

from models import Campaign, UserProfile

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'vision')]

app = FastAPI()
api_router = APIRouter(prefix="/api")

def format_doc(doc: dict) -> dict:
    if not doc: return doc
    doc["id"] = str(doc.pop("_id"))
    return doc

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/user", response_model=UserProfile)
async def get_user():
    user = await db.users.find_one({})
    if not user:
        user = UserProfile().model_dump()
        await db.users.insert_one(user.copy())
    return user

@api_router.put("/user", response_model=UserProfile)
async def update_user(user: UserProfile):
    await db.users.update_one({}, {"$set": user.model_dump()}, upsert=True)
    return user

@api_router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns():
    docs = await db.campaigns.find({}).to_list(1000)
    if not docs:
        initial = [
            {"name": "Summer Launch", "channel": "Paid Social", "status": "active", "spend": 14000, "roas": 5.2, "budget": 20000, "prog": 70, "ic": "🚀", "bg": "rgba(0,117,255,.18)", "c": "#0075FF"},
            {"name": "Email Nurture", "channel": "Email", "status": "active", "spend": 3100, "roas": 8.9, "budget": 5000, "prog": 64, "ic": "📧", "bg": "rgba(1,181,116,.18)", "c": "#01B574"},
            {"name": "Brand Search", "channel": "Search", "status": "active", "spend": 8700, "roas": 4.1, "budget": 15000, "prog": 52, "ic": "🔍", "bg": "rgba(33,212,253,.18)", "c": "#21D4FD"},
            {"name": "Retargeting Q3", "channel": "Display", "status": "paused", "spend": 5900, "roas": 3.4, "budget": 12000, "prog": 41, "ic": "🎯", "bg": "rgba(246,173,85,.18)", "c": "#F6AD55"},
        ]
        for c in initial:
            camp = Campaign(**c)
            await db.campaigns.insert_one(camp.model_dump())
        docs = await db.campaigns.find({}).to_list(1000)
    return [format_doc(d) for d in docs]

@api_router.post("/campaigns", response_model=Campaign)
async def create_campaign(camp: Campaign):
    doc = camp.model_dump()
    await db.campaigns.insert_one(doc)
    return camp

@api_router.put("/campaigns/{id}", response_model=Campaign)
async def update_campaign(id: str, camp: Campaign):
    doc = camp.model_dump()
    doc.pop("id", None)
    await db.campaigns.update_one({"id": id}, {"$set": doc})
    return camp

@api_router.delete("/campaigns/{id}")
async def delete_campaign(id: str):
    await db.campaigns.delete_one({"id": id})
    return {"message": "Deleted"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
