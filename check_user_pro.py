import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('app/frontend/.env')

db_url = os.environ.get('DATABASE_URL')
# Or if not in env, I'll try to guess or use the one from psql if I had it.
# Wait, I don't have DATABASE_URL in .env.
# Let's check where it might be.
