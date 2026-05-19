import bcrypt
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['helphub']
users_col = db['users']

email = 'admin@helphub.com'
password = 'adminpassword123'

user = users_col.find_one({'email': email})
if user:
    match = bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8'))
    print(f"User found: {user['email']}")
    print(f"Role: {user['role']}")
    print(f"Password Match: {match}")
else:
    print("User not found")
