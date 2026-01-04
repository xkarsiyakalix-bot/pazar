from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 1. Ensure columns exist (PostgREST doesn't support ALTER TABLE easily via client)
# However, we can use the 'rpc' method if there's a stored procedure, OR just try to update and ignore errors if columns missing (which implies we need to add them).
# Since I cannot run DDL (ALTER TABLE) easily via Supabase-py client without an RPC, 
# I will assume the columns exist or that I need to use the SQL editor.
# BUT, wait, I can use the 'sql' function if enabled, or just rely on the user to run the SQL.
# Since I am in agentic mode, I should try to solve it.
# The previous `run_sql.py` failed because of file paths. I will fix `run_sql.py` quickly.

sql = """
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS bike_art text,
ADD COLUMN IF NOT EXISTS bike_type text;

UPDATE listings
SET bike_art = 'Erkek',
    bike_type = 'Dağ Bisikleti (MTB)'
WHERE category = 'Otomobil, Bisiklet & Tekne' 
  AND sub_category ILIKE '%Bisiklet%'
  AND (bike_art IS NULL OR bike_art = '');
"""

# I will recreate run_sql.py to be more robust
