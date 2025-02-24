"""
User api
"""
from api import api
from user import consumers
from utils import get, user_logger
from user.models import CustomUser
from user.schema import UserSchema
from django.urls import path, re_path
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login, logout

@api.get("/user")
def get_user(request):
    uid = request.auth.id
    user_json = get(CustomUser, uid)
    if "error" in user_json: return user_json

    return {
        **user_json,
        "isAuthenticated": request.user.is_authenticated,
    }


@api.post("/user/signin", auth=None)
def signin_user(request, data: UserSchema):
    user = authenticate(request, username=data.email, password=data.password)

    if user is not None:
        login(request, user)
        user_logger.info(f"User {user.id} signed in")
        
        return {'success': True, 'uid': user.id}
    else:
        return {'success': False}

@api.post("/user/signup", auth=None)
def signup_user(request):
    pass

@api.post("/user/signout")
def signout_user(request):
    logout(request)
    user_logger.info(f"User {request.auth.id} signed out")

@api.get("/user/csrf", auth=None)
def get_csrf(request):
    return {"csrftoken": get_token(request)}

websocket_urlpatterns = [
    re_path(r'ws/user/(?P<uid>\w+)$', consumers.UserConsumer.as_asgi(), name="user_consumer")
]