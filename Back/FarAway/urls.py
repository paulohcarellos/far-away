from django.urls import include, path
from rest_framework import routers
from Lock import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'terminals', views.TerminalViewSet)
router.register(r'devices', views.DeviceViewSet)
router.register(r'register', views.RegisterView, basename='register')
router.register(r'trigger', views.TriggerView, basename='trigger')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
