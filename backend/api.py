from ninja import NinjaAPI
from ninja.security import django_auth

api = NinjaAPI(auth=django_auth, csrf=True)
