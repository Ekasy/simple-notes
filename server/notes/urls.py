from django.urls import path

from .views import NoteViews, UserRegistrationView, UserLoginView


app_name = 'notes'

urlpatterns = [
    path('notes/', NoteViews.as_view()),
    path('notes/<int:pk>', NoteViews.as_view()),
    path('create_user/', UserRegistrationView.as_view()),
    path('login/', UserLoginView.as_view()),
]
