
import os
from supabase import create_client, Client

url = 'https://ynleaatvkftkafiyqufv.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA'

supabase: Client = create_client(url, key)

def check_structure():
    # Check if subcategories table exists
    try:
        res = supabase.table('subcategories').select('*').limit(1).execute()
        print("-- Subcategories table exists")
    except Exception as e:
        print(f"-- Subcategories table check failed: {e}")

    # Check categories table
    try:
        res = supabase.table('categories').select('*').limit(1).execute()
        print("-- Categories table exists")
        if res.data:
            print(f"-- Columns in categories: {res.data[0].keys()}")
    except Exception as e:
        print(f"-- Categories table check failed: {e}")

if __name__ == "__main__":
    check_structure()
