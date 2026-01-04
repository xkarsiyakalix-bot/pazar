import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

# File reading removed as we use direct API calls below

# Execute SQL
try:
    # Supabase-py doesn't have a direct raw sql runner in all versions, 
    # but the rpc call is common or we can use a workaround if needed.
    # However, for simple updates, we can often rely on the table() interface 
    # OR if we have a stored procedure for raw sql.
    # Since I don't know the exact extensions available, I'll use a direct PG update loop 
    # via the client IF I can't run raw SQL. 
    # BUT, actually, the user environment seems to allow standard python scripts.
    # Let's try to simulate the update using the client's query builder if raw match fails
    # OR just fetch and update in python which is safer if raw SQL is not exposed.
    
    # Let's fetch the items that need updating first
    response = supabase.table('listings').select('id, uhren_schmuck_art') \
        .eq('category', 'Moda & Güzellik') \
        .eq('sub_category', 'Saat & Takı') \
        .in_('uhren_schmuck_art', ['Schmuck', 'Uhren', 'Weiteres']) \
        .execute()
        
    listings_to_update = response.data
    print(f"Found {len(listings_to_update)} listings to update.")
    
    count = 0
    for item in listings_to_update:
        old_val = item['uhren_schmuck_art']
        new_val = old_val
        if old_val == 'Schmuck': new_val = 'Takı'
        elif old_val == 'Uhren': new_val = 'Saat'
        elif old_val == 'Weiteres': new_val = 'Diğer'
        
        if new_val != old_val:
            supabase.table('listings').update({'uhren_schmuck_art': new_val}).eq('id', item['id']).execute()
            count += 1
            
    print(f"Successfully updated {count} listings.")

except Exception as e:
    print(f"An error occurred: {e}")
