from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

class Campaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    channel: str
    status: str
    spend: float
    roas: float
    budget: float
    prog: int
    ic: str
    bg: str
    c: str

class UserProfile(BaseModel):
    name: str = "Mark Johnson"
    email: str = "mark@vision.io"
    role: str = "Marketing Lead"
    company: str = "Vision Inc."
    location: str = "San Francisco, CA"
    bio: str = "Growth-obsessed marketer running paid, lifecycle and brand across the funnel."
