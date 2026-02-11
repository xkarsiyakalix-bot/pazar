from fastapi import FastAPI, Request
from fastapi.responses import Response
import datetime
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-anon-key")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print(f"✅ Connected to Supabase: {SUPABASE_URL}")
except Exception as e:
    print(f"❌ Failed to connect to Supabase: {e}")
    supabase = None

@app.get("/")
async def root():
    return {"message": "ExVitrin API - Supabase Backend"}

@app.get("/api/listings")
async def get_listings(category: str = None, limit: int = 1000):
    """Get listings with optional category filter and all fields"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        query = supabase.table("listings").select("*")
        if category and category != "Tüm Kategoriler":
            query = query.eq("category", category)
        
        response = query.limit(limit).execute()
        
        listings = []
        # Mapping for pet subcategories (Singular from DB -> Plural for Frontend)
        sub_category_mapping = {
            "Balık": "Balıklar",
            "Köpek": "Köpekler",
            "Kedi": "Kediler",
            "Küçükbaş Hayvanlar": "Küçük Hayvanlar",
            "Kümes Hayvanları": "Çiftlik Hayvanları",
            "At": "Atlar",
            "Kuş": "Kuşlar",
            "Hayvan Aksesuarları": "Aksesuarlar"
        }

        for item in response.data:
            raw_sub_cat = item.get("sub_category")
            # Apply mapping if it's a pet category and exists in our mapping
            sub_cat = sub_category_mapping.get(raw_sub_cat, raw_sub_cat) if item.get("category") == "Evcil Hayvanlar" else raw_sub_cat
            
            listing = {
                **item,
                "id": str(item.get("id")),
                "subCategory": sub_cat,
                "location": item.get("city"),
                "postalCode": item.get("postal_code"),
                "sellerId": item.get("user_id"),
                "sellerName": "Satıcı",
                "isTop": item.get("is_top", False),
                "date": item.get("created_at", "").split("T")[0] if item.get("created_at") else "",
                "image": item.get("images", ["https://via.placeholder.com/300x200"])[0] if item.get("images") else "https://via.placeholder.com/300x200",
                "offer_type": item.get("offer_type") or item.get("autoteile_angebotstyp")
            }
            listings.append(listing)
        
        print(f"✅ Fetched {len(listings)} listings (Category: {category})")
        return listings
    except Exception as e:
        print(f"❌ Error fetching listings: {e}")
        return []

# Favorites Endpoints
@app.get("/api/favorites")
async def get_favorites(user_id: str):
    """Get all favorites for a user"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        response = supabase.table("favorites").select("*").eq("user_id", user_id).execute()
        print(f"✅ Fetched {len(response.data)} favorites for user {user_id}")
        return response.data
    except Exception as e:
        print(f"❌ Error fetching favorites: {e}")
        return []

@app.post("/api/favorites")
async def add_favorite(user_id: str, listing_id: str):
    """Add a listing to favorites"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        # Check if already exists
        existing = supabase.table("favorites").select("*").eq("user_id", user_id).eq("listing_id", listing_id).execute()
        if existing.data:
            return {"success": True, "message": "Already in favorites", "favorite": existing.data[0]}
        
        # Insert new favorite
        response = supabase.table("favorites").insert({
            "user_id": user_id,
            "listing_id": listing_id
        }).execute()
        
        print(f"✅ Added favorite: user {user_id}, listing {listing_id}")
        return {"success": True, "favorite": response.data[0] if response.data else None}
    except Exception as e:
        print(f"❌ Error adding favorite: {e}")
        return {"success": False, "error": str(e)}

@app.delete("/api/favorites/{listing_id}")
async def remove_favorite(listing_id: str, user_id: str):
    """Remove a listing from favorites"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        response = supabase.table("favorites").delete().eq("user_id", user_id).eq("listing_id", listing_id).execute()
        print(f"✅ Removed favorite: user {user_id}, listing {listing_id}")
        return {"success": True}
    except Exception as e:
        print(f"❌ Error removing favorite: {e}")
        return {"success": False, "error": str(e)}

@app.get("/api/search")
async def search_listings(
    request: Request,
    q: str = None,
    category: str = None,
    location: str = None,
    min_price: float = None,
    max_price: float = None,
    condition: str = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    # Specific wage filters that need parsing
    hourly_wage_min: float = None,
    hourly_wage_max: float = None
):
    """Search listings with generic filter support"""
    raw_params = request.query_params
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        # Start query
        query = supabase.table("listings").select("*")
        
        # 1. Text search (title or description)
        if q:
            query = query.or_(f"title.ilike.%{q}%,description.ilike.%{q}%")
        
        # 2. Basic fixed filters
        if category and category != "Alle Kategorien":
            query = query.eq("category", category)
        
        # Mapping for pet subcategories (Plural from Frontend -> Singular for DB)
        reverse_sub_category_mapping = {
            "Balıklar": "Balık",
            "Köpekler": "Köpek",
            "Kediler": "Kedi",
            "Küçük Hayvanlar": "Küçükbaş Hayvanlar",
            "Çiftlik Hayvanları": "Kümes Hayvanları",
            "Atlar": "At",
            "Kuşlar": "Kuş",
            "Aksesuarlar": "Hayvan Aksesuarları"
        }

        # Handle both subCategory (frontend) and sub_category (DB)
        sub_cat = raw_params.get("subCategory") or raw_params.get("sub_category")
        if sub_cat:
            # Map back to singular if it's a plural pet category
            mapped_sub_cat = reverse_sub_category_mapping.get(sub_cat, sub_cat)
            query = query.eq("sub_category", mapped_sub_cat)
        
        if location and location != "Türkiye":
            query = query.ilike("city", f"%{location}%")
        
        if min_price is not None:
            query = query.gte("price", min_price)
        if max_price is not None:
            query = query.lte("price", max_price)
        
        if condition and condition != "all":
            query = query.eq("condition", condition)
            
        if hourly_wage_min is not None:
            query = query.gte("hourly_wage", hourly_wage_min)
        if hourly_wage_max is not None:
            query = query.lte("hourly_wage", hourly_wage_max)

        # 3. Generic filtering for everything else
        # Reserved parameters that are handled separately
        reserved = [
            'q', 'category', 'subCategory', 'sub_category',
            'location', 'min_price', 'max_price', 
            'condition', 'sort_by', 'sort_order', 'hourly_wage_min', 'hourly_wage_max',
            'page', 'limit'
        ]
        
        for key, value in raw_params.items():
            if key in reserved or not value:
                continue
            
            # Special handling for 'versand' which has custom logic
            if key == 'versand':
                versand_options = value.split(",")
                wants_versand = "Kargo mümkün" in versand_options or "Versand möglich" in versand_options
                wants_abholung = "Sadece elden teslim" in versand_options or "Nur Abholung" in versand_options
                
                if wants_versand and not wants_abholung:
                    query = query.eq("versand", True)
                elif wants_abholung and not wants_versand:
                    query = query.or_("versand.eq.false,versand.is.null")
                continue

            # Generic IN filter for multiselect/single values
            values = value.split(",")
            if len(values) > 1:
                query = query.in_(key, values)
            else:
                query = query.eq(key, value)
        
        # 4. Sorting
        desc = (sort_order == "desc")
        query = query.order(sort_by, desc=desc)
        
        # Execute query
        response = query.execute()
        
        # Transform data with generic mapping for custom fields
        listings = []
        for item in response.data:
            # Base listing with some mapping for frontend compatibility
            listing = {
                **item, # Include all DB fields (e.g. katzen_art, etc.)
                "id": str(item.get("id")),
                "subCategory": item.get("sub_category"),
                "location": item.get("city"),
                "postalCode": item.get("postal_code"),
                "sellerId": item.get("user_id"),
                "sellerName": "Satıcı",
                "isTop": item.get("is_top", False),
                "date": item.get("created_at", "").split("T")[0] if item.get("created_at") else "",
                "image": item.get("images", ["https://via.placeholder.com/300x200"])[0] if item.get("images") else "https://via.placeholder.com/300x200",
                # Special mapping: offer_type fallback
                "offer_type": item.get("offer_type") or item.get("autoteile_angebotstyp")
            }
            listings.append(listing)
        
        print(f"✅ Search returned {len(listings)} results for params: {dict(raw_params)}")
        return listings
    except Exception as e:
        print(f"❌ Error searching listings: {e}")
        import traceback
        traceback.print_exc()
        return []

@app.get("/api/favorites/count/{listing_id}")
async def get_favorite_count(listing_id: str):
    """Get the number of users who favorited a listing"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        response = supabase.table("favorites").select("id", count="exact").eq("listing_id", listing_id).execute()
        count = response.count if hasattr(response, 'count') else len(response.data)
        print(f"✅ Listing {listing_id} has {count} favorites")
        return {"listing_id": listing_id, "count": count}
    except Exception as e:
        print(f"❌ Error getting favorite count: {e}")
        return {"listing_id": listing_id, "count": 0}

# ==================== RESERVATION ENDPOINTS ====================

@app.post("/api/reservations/create")
async def create_reservation(data: dict):
    """Create a new reservation for a listing"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        listing_id = data.get("listing_id")
        buyer_id = data.get("buyer_id")
        duration_hours = data.get("duration_hours", 24)
        
        # Check if listing exists and is available
        listing_response = supabase.table("listings").select("*").eq("id", listing_id).execute()
        if not listing_response.data:
            return {"error": "Listing not found"}
        
        listing = listing_response.data[0]
        
        # Check if already reserved
        if listing.get("reserved_by") and listing.get("reserved_until"):
            from datetime import datetime
            reserved_until = datetime.fromisoformat(listing["reserved_until"].replace('Z', '+00:00'))
            if reserved_until > datetime.now(reserved_until.tzinfo):
                return {"error": "Listing is already reserved"}
        
        # Calculate expiry date
        from datetime import datetime, timedelta
        expiry_date = datetime.now() + timedelta(hours=duration_hours)
        
        # Create reservation
        reservation_data = {
            "listing_id": listing_id,
            "buyer_id": buyer_id,
            "seller_id": listing.get("user_id"),
            "status": "pending",
            "expiry_date": expiry_date.isoformat()
        }
        
        reservation_response = supabase.table("reservations").insert(reservation_data).execute()
        
        if not reservation_response.data:
            return {"error": "Failed to create reservation"}
        
        reservation = reservation_response.data[0]
        
        # Update listing
        supabase.table("listings").update({
            "reserved_by": buyer_id,
            "reserved_until": expiry_date.isoformat(),
            "reservation_count": listing.get("reservation_count", 0) + 1
        }).eq("id", listing_id).execute()
        
        print(f"✅ Created reservation {reservation['id']} for listing {listing_id}")
        return reservation
        
    except Exception as e:
        print(f"❌ Error creating reservation: {e}")
        return {"error": str(e)}

@app.get("/api/reservations/user/{user_id}")
async def get_user_reservations(user_id: str, status: str = "active"):
    """Get all reservations for a user"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        query = supabase.table("reservations").select("*, listings(*)")
        
        # Filter by user (buyer or seller)
        query = query.or_(f"buyer_id.eq.{user_id},seller_id.eq.{user_id}")
        
        # Filter by status
        if status == "active":
            query = query.in_("status", ["pending", "confirmed"])
        elif status != "all":
            query = query.eq("status", status)
        
        response = query.order("created_at", desc=True).execute()
        
        print(f"✅ Found {len(response.data)} reservations for user {user_id}")
        return response.data
        
    except Exception as e:
        print(f"❌ Error getting user reservations: {e}")
        return []

@app.patch("/api/reservations/{reservation_id}/cancel")
async def cancel_reservation(reservation_id: str, data: dict):
    """Cancel a reservation"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        user_id = data.get("user_id")
        
        # Get reservation
        reservation_response = supabase.table("reservations").select("*").eq("id", reservation_id).execute()
        if not reservation_response.data:
            return {"error": "Reservation not found"}
        
        reservation = reservation_response.data[0]
        
        # Check if user is buyer or seller
        if reservation["buyer_id"] != user_id and reservation["seller_id"] != user_id:
            return {"error": "Unauthorized"}
        
        # Update reservation status
        supabase.table("reservations").update({
            "status": "cancelled"
        }).eq("id", reservation_id).execute()
        
        # Free up listing
        supabase.table("listings").update({
            "reserved_by": None,
            "reserved_until": None
        }).eq("id", reservation["listing_id"]).execute()
        
        print(f"✅ Cancelled reservation {reservation_id}")
        return {"message": "Reservation cancelled successfully"}
        
    except Exception as e:
        print(f"❌ Error cancelling reservation: {e}")
        return {"error": str(e)}

@app.patch("/api/reservations/{reservation_id}/confirm")
async def confirm_reservation(reservation_id: str):
    """Confirm a reservation (seller action)"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        # Update reservation status
        response = supabase.table("reservations").update({
            "status": "confirmed"
        }).eq("id", reservation_id).execute()
        
        print(f"✅ Confirmed reservation {reservation_id}")
        return response.data[0] if response.data else {"error": "Failed to confirm"}
        
    except Exception as e:
        print(f"❌ Error confirming reservation: {e}")
        return {"error": str(e)}

@app.get("/api/reservations/expire-old")
async def expire_old_reservations():
    """Auto-expire old reservations (background job)"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        from datetime import datetime
        
        # Find expired reservations
        response = supabase.table("reservations").select("*").lt("expiry_date", datetime.now().isoformat()).in_("status", ["pending", "confirmed"]).execute()
        
        expired_count = 0
        for reservation in response.data:
            # Update reservation status
            supabase.table("reservations").update({
                "status": "expired"
            }).eq("id", reservation["id"]).execute()
            
            # Free up listing
            supabase.table("listings").update({
                "reserved_by": None,
                "reserved_until": None
            }).eq("id", reservation["listing_id"]).execute()
            
            expired_count += 1
        
        print(f"✅ Expired {expired_count} old reservations")
        return {"expired_count": expired_count}
        
    except Exception as e:
        print(f"❌ Error expiring reservations: {e}")
        return {"error": str(e)}

@app.get("/api/reservations/listing/{listing_id}")
async def get_listing_reservation(listing_id: str):
    """Get active reservation for a listing"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        response = supabase.table("reservations").select("*, profiles!buyer_id(full_name, avatar_url)").eq("listing_id", listing_id).in_("status", ["pending", "confirmed"]).execute()
        
        if response.data:
            return response.data[0]
        return None
        
    except Exception as e:
        print(f"❌ Error getting listing reservation: {e}")
        return None


@app.patch("/api/listings/{listing_id}")
async def update_listing(listing_id: str, data: dict):
    """Update listing fields (for reservation toggle)"""
    try:
        if not supabase:
            return {"error": "Supabase not connected"}
        
        print(f"🔄 Updating listing {listing_id} with data: {data}")
        
        # Update listing with provided data
        response = supabase.table("listings").update(data).eq("id", listing_id).execute()
        
        print(f"📊 Supabase response: {response}")
        print(f"📊 Response data: {response.data}")
        print(f"📊 Response count: {len(response.data) if response.data else 0}")
        
        if response.data and len(response.data) > 0:
            print(f"✅ Updated listing {listing_id}")
            return response.data[0]
        
        print(f"⚠️ No data returned for listing {listing_id}")
        return {"error": "Listing not found or not updated"}
        
    except Exception as e:
        print(f"❌ Error updating listing: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}


@app.get("/sitemap.xml")
async def generate_sitemap(request: Request):
    """Generate dynamic sitemap.xml"""
    base_url = "https://exvitrin.com"
    
    # 1. Static Pages
    static_urls = [
        "/",
        "/hakkimizda",
        "/iletisim",
        "/mobile-apps",
        "/packages",
        "/Butun-Kategoriler",
        "/yasal-uyarilar",
        "/cerez-politikasi",
        # Categories
        "/Otomobil-Bisiklet-Tekne",
        "/Emlak",
        "/Elektronik",
        "/Evcil-Hayvanlar",
        "/Moda-Guzellik",
        "/Ev-Bahce",
        "/Is-Ilanlari"
    ]
    
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    today = datetime.date.today().isoformat()
    
    # Add Static Pages
    for url in static_urls:
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}{url}</loc>\n'
        xml += f'    <lastmod>{today}</lastmod>\n'
        xml += '    <changefreq>daily</changefreq>\n'
        xml += '    <priority>0.8</priority>\n'
        xml += '  </url>\n'
        
    # 2. Dynamic Listings (Active)
    try:
        listings = supabase.table("listings").select("id, updated_at").eq("status", "active").limit(2000).execute()
        for item in listings.data:
            updated_at = (item.get("updated_at") or "").split("T")[0] or today
            xml += '  <url>\n'
            xml += f'    <loc>{base_url}/product/{item["id"]}</loc>\n'
            xml += f'    <lastmod>{updated_at}</lastmod>\n'
            xml += '    <changefreq>weekly</changefreq>\n'
            xml += '    <priority>0.6</priority>\n'
            xml += '  </url>\n'
            
    except Exception as e:
        print(f"Error fetching listings for sitemap: {e}")

    # 3. Seller Profiles / Stores
    try:
        stores = supabase.table("profiles").select("id, store_slug, updated_at").not_.is_("store_slug", "null").execute()
        for item in stores.data:
            updated_at = (item.get("updated_at") or "").split("T")[0] or today
            slug = item.get("store_slug")
            xml += '  <url>\n'
            xml += f'    <loc>{base_url}/{slug}</loc>\n'
            xml += f'    <lastmod>{updated_at}</lastmod>\n'
            xml += '    <changefreq>weekly</changefreq>\n'
            xml += '    <priority>0.7</priority>\n'
            xml += '  </url>\n'
    except Exception as e:
        print(f"Error fetching stores for sitemap: {e}")

    xml += '</urlset>'
    
    return Response(content=xml, media_type="application/xml")


if __name__ == "__main__":
    uvicorn.run("supabase_server:app", host="0.0.0.0", port=8000, reload=True)
