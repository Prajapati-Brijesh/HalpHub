from pymongo import MongoClient
import os

# MongoDB Connection
client = MongoClient('mongodb://localhost:27017/')
db = client['helphub']

# Collections
users_col = db['users']
services_col = db['services']
bookings_col = db['bookings']
reviews_col = db['reviews']
