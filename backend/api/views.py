from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import jwt
import bcrypt
from datetime import datetime, timedelta
from django.conf import settings
from .db_utils import users_col, services_col, bookings_col, reviews_col
from bson import ObjectId
from django.core.mail import send_mail

def generate_token(user_id):
    payload = {
        'user_id': str(user_id),
        'id': str(user_id),
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

class SignupView(APIView):
    def post(self, req):
        data = req.data
        if not data.get('email') or not data.get('password'):
            return Response({'message': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)
            
        if users_col.find_one({'email': data['email']}):
            return Response({'message': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        import random, string
        ref_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

        role = data.get('role', 'user')
        user_doc = {
            'name': data.get('name', 'Anonymous'),
            'email': data['email'],
            'password': hashed_pw,
            'role': role,
            'favorites': [],
            'avatar': data.get('avatar', f"https://api.dicebear.com/7.x/avataaars/svg?seed={data['email']}"),
            'is_plus': False,
            'referral_code': ref_code,
            'halp_coins': 100 
        }

        # Extra fields for business/provider
        if role == 'provider':
            user_doc.update({
                'category': data.get('category'),
                'experience': data.get('experience'),
                'bio': data.get('bio'),
                'verification_status': 'pending',
                'verification_image': data.get('verification_image')
            })

        user_id = users_col.insert_one(user_doc).inserted_id
        
        return Response({
            'token': generate_token(user_id),
            'user': { 
                'id': str(user_id), 
                'name': data.get('name', 'Anonymous'), 
                'email': data['email'], 
                'role': data.get('role', 'user'),
                'favorites': [],
                'avatar': f"https://api.dicebear.com/7.x/avataaars/svg?seed={data['email']}"
            }
        })

class LoginView(APIView):
    def post(self, req):
        data = req.data
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response({'message': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)

        user = users_col.find_one({'email': email})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return Response({
                'token': generate_token(user['_id']),
                'user': { 
                    'id': str(user['_id']), 
                    'name': user.get('name', 'User'), 
                    'email': user['email'], 
                    'role': user['role'],
                    'favorites': user.get('favorites', []),
                    'avatar': user.get('avatar', f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}"),
                    'is_plus': user.get('is_plus', False),
                    'referral_code': user.get('referral_code', 'N/A'),
                    'halp_coins': user.get('halp_coins', 0)
                }
            })
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class ServiceListView(APIView):
    permission_classes = []
    def get(self, req):
        services = list(services_col.find())
        for s in services: s['_id'] = str(s['_id'])
        return Response(services)

class BookingView(APIView):
    def post(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            user = users_col.find_one({'_id': ObjectId(user_id)})
            
            data = req.data
            data['user_id'] = user_id
            data['user_name'] = user.get('name', 'Anonymous')
            data['user_email'] = user.get('email', 'N/A')
            data['status'] = 'pending'
            data['created_at'] = datetime.utcnow()
            
            # Initialize Visual Roadmap Milestones
            data['milestones'] = [
                {'id': 1, 'title': 'Booking Confirmed', 'status': 'completed', 'date': datetime.utcnow().strftime('%Y-%m-%d')},
                {'id': 2, 'title': 'Provider Assigned', 'status': 'pending', 'date': ''},
                {'id': 3, 'title': 'Work Started', 'status': 'pending', 'date': ''},
                {'id': 4, 'title': 'Quality Check', 'status': 'pending', 'date': ''},
                {'id': 5, 'title': 'Completed', 'status': 'pending', 'date': ''},
            ]
            
            # Send Email (Console for now)
            try:
                send_mail(
                    'HelpHub Booking Confirmation',
                    f"Hi {user.get('name', 'User')}, your booking for {data.get('service_name', 'service')} is confirmed! Your project roadmap is now active.",
                    'noreply@helphub.in',
                    ['user@example.com'],
                    fail_silently=False,
                )
            except: pass

            bookings_col.insert_one(data)
            return Response({'message': 'Booking successful. Roadmap initialized!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': f'Error: {str(e)}'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            bookings = list(bookings_col.find({'user_id': payload['user_id']}))
            for b in bookings: b['_id'] = str(b['_id'])
            return Response(bookings)
        except:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, req, pk):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            
            # Remove trailing slash from pk if present
            clean_pk = pk.rstrip('/')
            
            # Verify the booking belongs to this user before deleting
            booking = bookings_col.find_one({'_id': ObjectId(clean_pk)})
            
            if not booking:
                return Response({'message': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
            
            if str(booking.get('user_id')) != str(user_id):
                return Response({'message': 'Access denied: You do not own this booking'}, status=status.HTTP_403_FORBIDDEN)
            
            bookings_col.delete_one({'_id': ObjectId(clean_pk)})
            return Response({'message': 'Booking cancelled successfully'})
        except Exception as e:
            return Response({'message': f'Server Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminBookingView(APIView):
    def get(self, req):
        bookings = list(bookings_col.find())
        for b in bookings: b['_id'] = str(b['_id'])
        return Response(bookings)

    def put(self, req, pk):
        try:
            bookings_col.update_one({'_id': ObjectId(pk)}, {'$set': {'status': req.data.get('status')}})
            return Response({'message': 'Status updated'})
        except:
            return Response({'message': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

class ReviewView(APIView):
    def get(self, req, service_id):
        reviews = list(reviews_col.find({'service_id': service_id}))
        for r in reviews: r['_id'] = str(r['_id'])
        return Response(reviews)

    def post(self, req):
        data = req.data
        comment = data.get('comment', '').lower()
        
        # Simple AI Sentiment Analysis
        positive_words = ['good', 'great', 'excellent', 'amazing', 'best', 'satisfied', 'perfect', 'awesome', 'nice', 'smooth']
        negative_words = ['bad', 'poor', 'worst', 'disappointed', 'late', 'rude', 'unprofessional', 'expensive']
        
        sentiment = 'neutral'
        if any(word in comment for word in positive_words): sentiment = 'positive'
        elif any(word in comment for word in negative_words): sentiment = 'critical'
        
        data['sentiment'] = sentiment
        reviews_col.insert_one(data)
        return Response({'message': 'Review added', 'sentiment': sentiment})

class AIReviewSummaryView(APIView):
    def get(self, req, service_id):
        reviews = list(reviews_col.find({'service_id': service_id}))
        if not reviews:
            return Response({'summary': 'No reviews yet for this expert.', 'stats': {'total': 0, 'avg': 0, 'positive_percent': 0}})
        
        avg_rating = sum(r.get('rating', 0) for r in reviews) / len(reviews)
        positive_count = len([r for r in reviews if r.get('sentiment') == 'positive'])
        
        # AI Logic: Build a natural language summary
        summary = f"Based on {len(reviews)} customer reviews, this professional has an average rating of {avg_rating:.1f}/5. "
        if len(reviews) > 0 and positive_count / len(reviews) > 0.7:
            summary += "Customers are overwhelmingly positive about the quality of work and punctuality. "
        elif avg_rating > 4:
            summary += "Most users find the service reliable and worth the price. "
        else:
            summary += "Experiences are mixed; some users reported minor issues with communication. "
            
        return Response({
            'summary': summary,
            'stats': {
                'total': len(reviews),
                'avg': round(avg_rating, 1),
                'positive_percent': round((positive_count / len(reviews)) * 100) if reviews else 0
            }
        })

class ChatbotView(APIView):
    permission_classes = []
    
    def post(self, req):
        msg = req.data.get('message', '').lower()
        
        # Premium Smart Matching Logic
        if any(word in msg for word in ["need", "want", "looking for", "hire", "find"]):
            all_services = list(services_col.find())
            matches = []
            for s in all_services:
                if s['category'].lower() in msg or s['name'].lower() in msg or s.get('description', '').lower() in msg:
                    matches.append(s)
            
            if matches:
                reply = "Based on your requirements, I've found some experts for you:\n\n"
                for m in matches[:2]:
                    reply += f"• {m['name']} ({m['category']}) - ₹{m['price']}. Highly rated for this task!\n"
                reply += "\nWould you like me to show you their full profiles?"
                return Response({'reply': reply, 'type': 'suggestions', 'matches': [str(m['_id']) for m in matches]})

        responses = {
            'hello': "Hello! I am HelpHub AI, your personal service consultant. I can find the perfect professional for your home or business. What can I do for you?",
            'hi': "Hi! Looking to get something fixed or built? I'm here to match you with the best talent on HelpHub.",
            'price': "Prices vary by service. For example, Plumbing starts at ₹400, while Painting starts at ₹2000. I can give you a specific quote if you tell me what you need!",
            'book': "I can help with that! Just find a service you like and click 'Book Now', or tell me what you need and I'll find a match for you.",
            'status': "You can track your projects live on your Dashboard. We now have a 'Visual Roadmap' feature to show exactly where your job is!",
            'help': "I can find experts, check prices, or explain how our secure milestone payments work. Just ask!",
            'who': "I am HelpHub's Premium AI Assistant, designed to make hiring hassle-free.",
            'thanks': "Happy to help! Let me know if you need anything else.",
            'bye': "Goodbye! Have a productive day."
        }

        for key in responses:
            if key in msg:
                return Response({'reply': responses[key]})
                
        # Default matching
        all_services = list(services_col.find())
        for s in all_services:
            if s['category'].lower() in msg or s['name'].lower() in msg:
                return Response({'reply': f"I found a great match for that: {s['name']} in {s['location']} for ₹{s['price']}. Shall we proceed with the booking?"})

        return Response({'reply': "I'm here to help! Try asking about 'plumbing', 'painting', or 'electrical' services. You can also say 'I need a plumber' for a smart match."})

class FavoriteToggleView(APIView):
    def post(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            service_id = req.data.get('service_id')
            user = users_col.find_one({'_id': ObjectId(payload['user_id'])})
            
            if service_id in user.get('favorites', []):
                users_col.update_one({'_id': ObjectId(payload['user_id'])}, {'$pull': {'favorites': service_id}})
                return Response({'message': 'Removed from favorites', 'favorites': [f for f in user['favorites'] if f != service_id]})
            else:
                users_col.update_one({'_id': ObjectId(payload['user_id'])}, {'$push': {'favorites': service_id}})
                return Response({'message': 'Added to favorites', 'favorites': user.get('favorites', []) + [service_id]})
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProviderBookingView(APIView):
    def get(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            # In a real app, we'd filter by provider_id. For demo, we'll show all pending ones to providers.
            bookings = list(bookings_col.find())
            for b in bookings: b['_id'] = str(b['_id'])
            return Response(bookings)
        except:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

class ProviderServiceView(APIView):
    def get(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            services = list(services_col.find({'provider_id': payload['user_id']}))
            for s in services: s['_id'] = str(s['_id'])
            return Response(services)
        except:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            
            user = users_col.find_one({'_id': ObjectId(user_id)})
            if user.get('halp_coins', 0) < 50:
                return Response({'message': 'Insufficient HalpCoins to post an ad. You need 50 coins. Please contact admin to purchase more.'}, status=status.HTTP_400_BAD_REQUEST)
                
            data = req.data
            service = {
                'title': data['title'],
                'category': data['category'],
                'price': data['price'],
                'rating': 4.5,
                'reviews': 0,
                'image': data.get('image', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'),
                'provider_id': user_id,
                'provider_name': data.get('provider_name', 'Professional'),
                'description': data.get('description', ''),
                'location': data.get('location', 'Global')
            }
            
            # Deduct coins and insert service
            users_col.update_one({'_id': ObjectId(user_id)}, {'$inc': {'halp_coins': -50}})
            res = services_col.insert_one(service)
            service['_id'] = str(res.inserted_id)
            
            return Response({'service': service, 'new_balance': user.get('halp_coins', 0) - 50})
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Social Hub (Feed) Views
from .db_utils import db
posts_col = db['posts']

class FeedListView(APIView):
    permission_classes = []
    def get(self, req):
        posts = list(posts_col.find().sort('created_at', -1))
        for p in posts: p['_id'] = str(p['_id'])
        return Response(posts)

class FeedCreateView(APIView):
    def post(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            data = req.data
            data['user_id'] = payload['user_id']
            data['created_at'] = datetime.utcnow()
            posts_col.insert_one(data)
            return Response({'message': 'Post created successfully'}, status=status.HTTP_201_CREATED)
        except:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

class VerifyWorkView(APIView):
    def post(self, req):
        data = req.data
        booking_id = data.get('booking_id')
        before = data.get('before_photo')
        after = data.get('after_photo')
        
        # Simulated AI Comparison Logic
        report = "AI Analysis: Comparing 'Before' and 'After' states. "
        score = 95
        
        if before and after:
            report += "Significant progress detected in the target area. Texture and color matching confirms authenticity. "
            score = 98
        else:
            report += "Verification based on partial data. Work appears to be completed as per standards. "
            score = 85

        verification_data = {
            'status': 'verified',
            'score': score,
            'report': report,
            'verified_at': datetime.utcnow().isoformat()
        }
        
        if booking_id:
            bookings_col.update_one({'_id': ObjectId(booking_id)}, {'$set': {'verification': verification_data}})
            
        return Response(verification_data)

class UpgradeMembershipView(APIView):
    def post(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            users_col.update_one({'_id': ObjectId(payload['user_id'])}, {'$set': {'is_plus': True}})
            return Response({'message': 'Welcome to HalpHub Plus!', 'is_plus': True})
        except:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

# New Admin Views
class AdminUserListView(APIView):
    def get(self, req):
        users = list(users_col.find())
        for u in users: 
            u['_id'] = str(u['_id'])
            if 'password' in u: del u['password']
        return Response(users)
    
    def delete(self, req, pk):
        try:
            users_col.delete_one({'_id': ObjectId(pk)})
            return Response({'message': 'User deleted successfully'})
        except:
            return Response({'message': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)

class AdminServiceManagementView(APIView):
    def delete(self, req, pk):
        try:
            services_col.delete_one({'_id': ObjectId(pk)})
            return Response({'message': 'Service deleted successfully'})
        except:
            return Response({'message': 'Invalid ID'}, status=status.HTTP_400_BAD_REQUEST)

class AdminCoinTransferView(APIView):
    def post(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            admin_user = users_col.find_one({'_id': ObjectId(payload['user_id'])})
            if not admin_user or admin_user.get('role') != 'admin':
                return Response({'message': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
                
            target_user_id = req.data.get('user_id')
            amount = int(req.data.get('amount', 0))
            
            if not target_user_id or amount <= 0:
                return Response({'message': 'Valid user ID and positive amount required'}, status=status.HTTP_400_BAD_REQUEST)
                
            users_col.update_one({'_id': ObjectId(target_user_id)}, {'$inc': {'halp_coins': amount}})
            return Response({'message': f'Successfully added {amount} HalpCoins to user.'})
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ClaimReferralView(APIView):
    def post(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            code = req.data.get('code', '').upper()
            
            if not code: return Response({'message': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Find the referrer
            referrer = users_col.find_one({'referral_code': code})
            if not referrer: return Response({'message': 'Invalid referral code'}, status=status.HTTP_400_BAD_REQUEST)
            
            if str(referrer['_id']) == user_id:
                return Response({'message': 'You cannot refer yourself!'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user already claimed a referral
            user = users_col.find_one({'_id': ObjectId(user_id)})
            if user.get('referral_claimed'):
                return Response({'message': 'You have already claimed a referral bonus'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Award coins: 100 for referrer, 50 for referee
            users_col.update_one({'_id': referrer['_id']}, {'$inc': {'halp_coins': 100}})
            users_col.update_one({'_id': ObjectId(user_id)}, {
                '$inc': {'halp_coins': 50},
                '$set': {'referral_claimed': True}
            })
            
            return Response({'message': f'Success! You earned 50 Coins and {referrer.get("name")} earned 100 Coins.'})
        except:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

class UpdateAvatarView(APIView):
    def put(self, req):
        auth_header = req.headers.get('Authorization', '')
        if not auth_header: return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            avatar_url = req.data.get('avatar')
            if not avatar_url:
                return Response({'message': 'Avatar URL is required'}, status=status.HTTP_400_BAD_REQUEST)
                
            users_col.update_one({'_id': ObjectId(payload['user_id'])}, {'$set': {'avatar': avatar_url}})
            return Response({'message': 'Avatar updated successfully', 'avatar': avatar_url})
        except:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
