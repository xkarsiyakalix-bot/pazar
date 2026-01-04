
import os
from supabase import create_client, Client

url = "https://ynleaatvkftkafiyqufv.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA"

supabase: Client = create_client(url, key)

try:
    # Try to fetch one row and see the columns
    response = supabase.table("promotions").select("*").limit(1).execute()
    if response.data:
        print("Columns in 'promotions':")
        print(response.data[0].keys())
    else:
        print("Table 'promotions' is empty, cannot determine columns this way.")
        # Alternatively, try a query that will fail if the column doesn't exist
        try:
            supabase.table("promotions").select("invoice_sent_at").limit(1).execute()
            print("Column 'invoice_sent_at' exists!")
        except Exception as e:
            print(f"Column 'invoice_sent_at' does NOT exist or error: {e}")
except Exception as e:
    print(f"Error: {e}")
