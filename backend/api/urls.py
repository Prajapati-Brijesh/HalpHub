from django.urls import path
from .views import (
    SignupView, LoginView, ServiceListView, BookingView, AdminBookingView, 
    ReviewView, ChatbotView, FavoriteToggleView, ProviderBookingView, ProviderServiceView,
    FeedListView, FeedCreateView, VerifyWorkView, UpgradeMembershipView,
    AdminUserListView, AdminServiceManagementView, AIReviewSummaryView, ClaimReferralView, AdminCoinTransferView
)

urlpatterns = [
    path('auth/signup/', SignupView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('services/', ServiceListView.as_view()),
    path('bookings/', BookingView.as_view()),
    path('bookings/user/', BookingView.as_view()),
    path('bookings/<str:pk>/', BookingView.as_view()),
    path('admin/bookings/', AdminBookingView.as_view()),
    path('admin/bookings/<str:pk>/', AdminBookingView.as_view()),
    path('admin/users/', AdminUserListView.as_view()),
    path('admin/users/<str:pk>/', AdminUserListView.as_view()),
    path('admin/services/<str:pk>/', AdminServiceManagementView.as_view()),
    path('admin/coins/add/', AdminCoinTransferView.as_view()),
    path('reviews/', ReviewView.as_view()),
    path('reviews/<str:service_id>/', ReviewView.as_view()),
    path('chat/', ChatbotView.as_view()),
    path('favorites/', FavoriteToggleView.as_view()),
    path('provider/bookings/', ProviderBookingView.as_view()),
    path('provider/services/', ProviderServiceView.as_view()),
    path('feed/', FeedListView.as_view()),
    path('feed/create/', FeedCreateView.as_view()),
    path('verify-work/', VerifyWorkView.as_view()),
    path('membership/upgrade/', UpgradeMembershipView.as_view()),
    path('ai/review-summary/<str:service_id>/', AIReviewSummaryView.as_view()),
    path('referral/claim/', ClaimReferralView.as_view()),
]
