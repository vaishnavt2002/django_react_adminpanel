from django.urls import path
from .views import RegisterView, ProfileView, AdminUsersView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin/users/', AdminUsersView.as_view(), name='admin_users'),
    path('admin/users/<int:user_id>/', AdminUsersView.as_view(), name='admin_user_detail'),
    path('admin/users/<int:user_id>/delete/', AdminUsersView.as_view(), name='admin_user_delete')
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)