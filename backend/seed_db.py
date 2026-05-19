from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['helphub']
services_col = db['services']

services_col.delete_many({})

services = [
    {
        "name": "Professional Electrician",
        "description": "Expert electrical repairs and installations for your home.",
        "price": 500,
        "location": "Ahmedabad",
        "lat": 23.0225,
        "lng": 72.5714,
        "category": "Repair",
        "image": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
    },
    {
        "name": "Modern Interior Painting",
        "description": "High-quality wall painting and texture services.",
        "price": 2000,
        "location": "Surat",
        "lat": 21.1702,
        "lng": 72.8311,
        "category": "Home Decor",
        "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
    },
    {
        "name": "Expert Plumbing",
        "description": "Leakage repair, pipe fitting, and bathroom installation.",
        "price": 400,
        "location": "Ahmedabad",
        "lat": 23.0338,
        "lng": 72.5850,
        "category": "Repair",
        "image": "https://images.unsplash.com/photo-1585704032915-c3400ca1f965?q=80&w=2070&auto=format&fit=crop"
    }
]

services_col.insert_many(services)
print("MongoDB seeded successfully!")
