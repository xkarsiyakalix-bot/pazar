from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample listings data
SAMPLE_LISTINGS = [
    {
        "id": "1",
        "title": "iPhone 13 Pro",
        "description": "Sehr gut erhalten, mit Originalverpackung",
        "price": 750,
        "category": "Elektronik",
        "subCategory": "Handys & Telefone",
        "city": "Berlin",
        "image": "https://via.placeholder.com/300x200?text=iPhone+13+Pro",
        "images": ["https://via.placeholder.com/300x200?text=iPhone+13+Pro"],
        "isTop": False
    },
    {
        "id": "2",
        "title": "MacBook Pro 2021",
        "description": "16 Zoll, M1 Pro, 16GB RAM",
        "price": 1800,
        "category": "Elektronik",
        "subCategory": "PCs",
        "city": "München",
        "image": "https://via.placeholder.com/300x200?text=MacBook+Pro",
        "images": ["https://via.placeholder.com/300x200?text=MacBook+Pro"],
        "isTop": False
    },
    {
        "id": "3",
        "title": "Designer Sofa",
        "description": "Modernes 3-Sitzer Sofa in grau",
        "price": 850,
        "category": "Haus & Garten",
        "subCategory": "Wohnzimmer",
        "city": "Hamburg",
        "image": "https://via.placeholder.com/300x200?text=Sofa",
        "images": ["https://via.placeholder.com/300x200?text=Sofa"],
        "isTop": False
    },
    {
        "id": "4",
        "title": "Kinderwagen Bugaboo",
        "description": "Gut erhaltener Kinderwagen",
        "price": 350,
        "category": "Familie, Kind & Baby",
        "subCategory": "Kinderwagen & Buggys",
        "city": "Frankfurt",
        "image": "https://via.placeholder.com/300x200?text=Kinderwagen",
        "images": ["https://via.placeholder.com/300x200?text=Kinderwagen"],
        "isTop": False
    },
    {
        "id": "5",
        "title": "PlayStation 5",
        "description": "Neuwertig, mit 2 Controllern",
        "price": 450,
        "category": "Elektronik",
        "subCategory": "Konsolen",
        "city": "Köln",
        "image": "https://via.placeholder.com/300x200?text=PS5",
        "images": ["https://via.placeholder.com/300x200?text=PS5"],
        "isTop": False
    }
]

@app.get("/")
async def root():
    return {"message": "Kleinanzeigen API"}

@app.get("/api/listings")
async def get_listings():
    """Return sample listings"""
    return SAMPLE_LISTINGS

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
