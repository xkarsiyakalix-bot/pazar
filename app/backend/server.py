from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import hashlib


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Messaging System Models
class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    listing_id: str
    sender_id: str
    receiver_id: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False
    message_type: str = "text"  # 'text', 'image', 'system'

class MessageCreate(BaseModel):
    listing_id: str
    receiver_id: str
    content: str
    message_type: str = "text"

class Conversation(BaseModel):
    conversation_id: str
    listing_id: str
    listing_title: str
    listing_image: str
    other_user_id: str
    other_user_name: str
    last_message: str
    last_message_time: datetime
    unread_count: int

# Promotion System Models
class Promotion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    listing_id: str
    package_type: str  # 'highlight', 'top', 'galerie', 'premium'
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime
    price: float
    is_active: bool = True

class PromotionPurchase(BaseModel):
    listing_id: str
    package_type: str

# User Authentication Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

# Helper function to create conversation ID
def create_conversation_id(listing_id: str, buyer_id: str) -> str:
    """Create a unique conversation ID from listing and buyer IDs"""
    return f"{listing_id}_{buyer_id}"

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Authentication Endpoints
def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

@api_router.post("/auth/register", response_model=UserResponse)
async def register_user(input: UserCreate):
    """Register a new user"""
    # Check if email already exists
    existing_user = await db.users.find_one({"email": input.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(input.password)
    
    # Create user object
    user_dict = {
        "name": input.name,
        "email": input.email,
        "hashed_password": hashed_password
    }
    user_obj = User(**user_dict)
    
    # Save to database
    await db.users.insert_one(user_obj.dict())
    
    # Return user without password
    return UserResponse(**user_obj.dict())

@api_router.post("/auth/login", response_model=UserResponse)
async def login_user(input: UserLogin):
    """Login a user"""
    # Find user by email
    user = await db.users.find_one({"email": input.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    hashed_password = hash_password(input.password)
    if user['hashed_password'] != hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Return user without password
    return UserResponse(**user)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user(user_id: str):
    """Get current user information"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**user)

# Messaging Endpoints
@api_router.post("/messages/send", response_model=Message)
async def send_message(input: MessageCreate, sender_id: str = "user_123"):
    """Send a new message"""
    # Create conversation ID
    conversation_id = create_conversation_id(input.listing_id, sender_id)
    
    # Create message object
    message_dict = input.dict()
    message_dict['sender_id'] = sender_id
    message_dict['conversation_id'] = conversation_id
    message_obj = Message(**message_dict)
    
    # Save to database
    await db.messages.insert_one(message_obj.dict())
    
    return message_obj

@api_router.get("/messages/conversations")
async def get_conversations(user_id: str = "user_123"):
    """Get all conversations for a user"""
    # Find all messages where user is sender or receiver
    messages = await db.messages.find({
        "$or": [
            {"sender_id": user_id},
            {"receiver_id": user_id}
        ]
    }).sort("timestamp", -1).to_list(1000)
    
    # Group by conversation_id and get latest message
    conversations_dict = {}
    for msg in messages:
        conv_id = msg['conversation_id']
        if conv_id not in conversations_dict:
            # Count unread messages
            unread_count = await db.messages.count_documents({
                "conversation_id": conv_id,
                "receiver_id": user_id,
                "read": False
            })
            
            # Determine other user
            other_user_id = msg['receiver_id'] if msg['sender_id'] == user_id else msg['sender_id']
            
            conversations_dict[conv_id] = {
                "conversation_id": conv_id,
                "listing_id": msg['listing_id'],
                "listing_title": f"Listing {msg['listing_id'][:8]}",  # Placeholder
                "listing_image": "/placeholder.jpg",  # Placeholder
                "other_user_id": other_user_id,
                "other_user_name": f"User {other_user_id[:8]}",  # Placeholder
                "last_message": msg['content'],
                "last_message_time": msg['timestamp'],
                "unread_count": unread_count
            }
    
    return list(conversations_dict.values())

@api_router.get("/messages/conversation/{conversation_id}")
async def get_conversation_messages(conversation_id: str):
    """Get all messages in a conversation"""
    messages = await db.messages.find({
        "conversation_id": conversation_id
    }).sort("timestamp", 1).to_list(1000)
    
    return [Message(**msg) for msg in messages]

@api_router.put("/messages/{message_id}/read")
async def mark_message_read(message_id: str):
    """Mark a message as read"""
    result = await db.messages.update_one(
        {"id": message_id},
        {"$set": {"read": True}}
    )
    return {"success": result.modified_count > 0}

@api_router.get("/messages/unread-count")
async def get_unread_count(user_id: str = "user_123"):
    """Get total unread message count for a user"""
    count = await db.messages.count_documents({
        "receiver_id": user_id,
        "read": False
    })
    return {"unread_count": count}

# Listing Models
class Listing(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    listingType: str = "selling"  # 'selling' or 'buying'
    title: str
    description: str
    price: float
    category: str
    subCategory: Optional[str] = None
    condition: str = "used"  # 'new' or 'used'
    priceType: str = "fixed"  # 'fixed', 'negotiable', 'giveaway'
    images: List[str] = []
    seller_id: str
    seller_name: str
    city: Optional[str] = None
    postalCode: Optional[str] = None
    address: Optional[str] = None
    federalState: Optional[str] = None
    showLocation: bool = False
    showPhoneNumber: bool = False
    contactName: Optional[str] = None
    phoneNumber: Optional[str] = None
    legalInfo: Optional[str] = None
    # Auto-specific fields
    carBrand: Optional[str] = None
    carModel: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    views: int = 0

class ListingCreate(BaseModel):
    listingType: str = "selling"
    title: str
    description: str
    price: float
    category: str
    subCategory: Optional[str] = None
    condition: str = "used"
    priceType: str = "fixed"
    images: List[str] = []
    city: Optional[str] = None
    postalCode: Optional[str] = None
    address: Optional[str] = None
    federalState: Optional[str] = None
    showLocation: bool = False
    showPhoneNumber: bool = False
    contactName: Optional[str] = None
    phoneNumber: Optional[str] = None
    legalInfo: Optional[str] = None
    # Auto-specific fields
    carBrand: Optional[str] = None
    carModel: Optional[str] = None

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    condition: Optional[str] = None
    price_type: Optional[str] = None
    images: Optional[List[str]] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    is_active: Optional[bool] = None

# Listings Endpoints
@api_router.post("/listings", response_model=Listing)
async def create_listing(input: ListingCreate, seller_id: str = "user_123", seller_name: str = "Demo User"):
    """Create a new listing"""
    listing_dict = input.dict()
    listing_dict['seller_id'] = seller_id
    listing_dict['seller_name'] = seller_name
    listing_obj = Listing(**listing_dict)
    
    await db.listings.insert_one(listing_obj.dict())
    return listing_obj

@api_router.get("/listings", response_model=List[Listing])
async def get_all_listings(limit: int = 100, skip: int = 0, category: Optional[str] = None):
    """Get all listings with optional filtering"""
    query = {"is_active": True}
    if category:
        query["category"] = category
    
    listings = await db.listings.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return [Listing(**listing) for listing in listings]

@api_router.get("/listings/latest", response_model=List[Listing])
async def get_latest_listings(limit: int = 10):
    """Get the latest listings"""
    listings = await db.listings.find({"is_active": True}).sort("created_at", -1).limit(limit).to_list(limit)
    return [Listing(**listing) for listing in listings]

@api_router.get("/listings/{listing_id}", response_model=Listing)
async def get_listing(listing_id: str):
    """Get a specific listing by ID"""
    listing = await db.listings.find_one({"id": listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Increment view count
    await db.listings.update_one(
        {"id": listing_id},
        {"$inc": {"views": 1}}
    )
    
    return Listing(**listing)

@api_router.get("/listings/user/{user_id}")
async def get_user_listings(user_id: str):
    """Get all listings for a specific user"""
    listings = await db.listings.find({"seller_id": user_id}).sort("created_at", -1).to_list(1000)
    return [Listing(**listing) for listing in listings]

@api_router.put("/listings/{listing_id}", response_model=Listing)
async def update_listing(listing_id: str, input: ListingUpdate):
    """Update a listing"""
    # Get existing listing
    existing = await db.listings.find_one({"id": listing_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in input.dict().items() if v is not None}
    update_data['updated_at'] = datetime.utcnow()
    
    await db.listings.update_one(
        {"id": listing_id},
        {"$set": update_data}
    )
    
    # Get updated listing
    updated_listing = await db.listings.find_one({"id": listing_id})
    return Listing(**updated_listing)

@api_router.delete("/listings/{listing_id}")
async def delete_listing(listing_id: str):
    """Delete a listing (soft delete by setting is_active to False)"""
    result = await db.listings.update_one(
        {"id": listing_id},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    return {"success": True, "message": "Listing deleted successfully"}

# Promotion Endpoints
@api_router.post("/promotions/purchase", response_model=Promotion)
async def purchase_promotion(input: PromotionPurchase):
    """Purchase a promotion package for a listing"""
    from datetime import timedelta
    
    # Define package details
    packages = {
        'highlight': {'days': 1, 'price': 4.99},
        'top': {'days': 7, 'price': 9.99},
        'galerie': {'days': 7, 'price': 19.99},
        'premium': {'days': 10, 'price': 59.99}
    }
    
    package = packages.get(input.package_type)
    if not package:
        return {"error": "Invalid package type"}
    
    # Calculate end date
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=package['days'])
    
    # Create promotion
    promotion_dict = {
        'listing_id': input.listing_id,
        'package_type': input.package_type,
        'start_date': start_date,
        'end_date': end_date,
        'price': package['price']
    }
    promotion_obj = Promotion(**promotion_dict)
    
    # Save to database
    await db.promotions.insert_one(promotion_obj.dict())
    
    return promotion_obj

@api_router.get("/promotions/listing/{listing_id}")
async def get_listing_promotions(listing_id: str):
    """Get all promotions for a specific listing"""
    promotions = await db.promotions.find({
        "listing_id": listing_id,
        "is_active": True
    }).to_list(100)
    
    return [Promotion(**promo) for promo in promotions]

@api_router.get("/promotions/active")
async def get_active_promotions():
    """Get all currently active promotions"""
    now = datetime.utcnow()
    promotions = await db.promotions.find({
        "is_active": True,
        "end_date": {"$gte": now}
    }).to_list(1000)
    
    return [Promotion(**promo) for promo in promotions]

# Add CORS middleware BEFORE including the router
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
