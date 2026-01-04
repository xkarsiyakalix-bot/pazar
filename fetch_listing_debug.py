import os
import asyncio
from supabase import create_client, Client

url = "https://ynleaatvkftkafiyqufv.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA"

supabase: Client = create_client(url, key)

async def get_listing():
    id = "b707bb19-ac7b-45df-a5a8-cbd8f25d9461"
    response = supabase.table("listings").select("*").eq("id", id).execute()
    print(response)

if __name__ == "__main__":
    asyncio.run(get_listing())
