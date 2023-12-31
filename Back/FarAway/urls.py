from django.urls import include, path
from rest_framework import routers
from Lock import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'terminals', views.TerminalViewSet)
router.register(r'register', views.RegisterView, basename='register')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
    path('setup/', views.SetupView.as_view(), name='setup'),
    path('trigger/', views.TriggerView.as_view(), name='trigger'),
    path('update/', views.UpdateView.as_view(), name='update'),
    path('poll/', views.PollView.as_view(), name='poll'),
    path('user-terminals/', views.UserTerminalsView.as_view(), name='user-terminals'),
    path('generate-qrcodes/', views.GenerateQrCodes.as_view(), name='generate-qrcodes'),
    path('register-task/', views.RegisterTaskView.as_view(), name='register-task'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
