from pymongo import MongoClient
import bcrypt

client = MongoClient('mongodb://localhost:27017/')
db = client['helphub']
users_col = db['users']

email = 'admin@helphub.com'
password = 'adminpassword123'
hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Update or create admin
user = users_col.find_one({'email': email})
if user:
    users_col.update_one({'email': email}, {'$set': {'password': hashed_pw, 'role': 'admin'}})
    print(f"Admin password updated for {email}")
else:
    admin_user = {
        'name': 'System Administrator',
        'email': email,
        'password': hashed_pw,
        'role': 'admin',
        'favorites': [],
        'avatar': 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        'is_plus': True,
        'referral_code': 'ADMIN123',
        'halp_coins': 99999,
        'contact_email': 'prajabrijesh67@gmail.com',
        'phone': '9313116750'
    }
    users_col.insert_one(admin_user)
    print(f"Admin user created successfully for {email}")

print(f"ID: {email}")
print(f"Password: {password}")
