#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print(f"MONGO_URI: {os.getenv('MONGO_URI')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from interviewHubDB.db_service import db, client
    print(f"Database object: {db}")
    print(f"Client object: {client}")
    
    if db:
        print("Database connection successful!")
        # Test a simple operation
        result = db.users.find_one({"email": "test@example.com"})
        print(f"Test query result: {result}")
    else:
        print("Database connection failed - db is None")
        
except Exception as e:
    print(f"Error importing database service: {e}")
