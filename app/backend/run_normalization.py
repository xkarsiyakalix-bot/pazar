import os
import re
from supabase import create_client, Client

# Configuration
URL = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"

supabase: Client = create_client(URL, KEY)

SQL_FILE_PATH = "../../normalize_categories.sql"

def parse_and_execute():
    if not os.path.exists(SQL_FILE_PATH):
        print(f"Error: File not found at {SQL_FILE_PATH}")
        return

    with open(SQL_FILE_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print("Starting normalization...")
    
    for line in lines:
        line = line.strip()
        if not line or line.startswith('--'):
            continue

        # Regex for UPDATE listings SET col = 'val' WHERE col IN ('v1', 'v2')
        match = re.search(r"UPDATE listings SET (\w+) = '([^']+)' WHERE (\w+) IN \((.+)\);", line)
        if match:
            col_to_set = match.group(1)
            new_val = match.group(2)
            filter_col = match.group(3)
            # Parse values inside IN (...)
            in_values_str = match.group(4)
            # Split by comma, strip quotes and whitespace
            in_values = [v.strip().strip("'") for v in in_values_str.split(',')]
            
            print(f"Updating {col_to_set} to '{new_val}' where {filter_col} in {in_values}")
            
            try:
                # Perform update
                data = {col_to_set: new_val}
                result = supabase.table("listings").update(data).in_(filter_col, in_values).execute()
                # print(f"Result: {result}")
            except Exception as e:
                print(f"Failed to execute line: {line}\nError: {e}")

    print("Normalization complete.")

if __name__ == "__main__":
    parse_and_execute()
