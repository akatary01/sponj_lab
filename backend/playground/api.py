"""
Playground api
"""
from api import api
from utils import get

from playground.models import Playground

@api.get("/playground", auth=None)
def playground_get(request, id: str):
    return get(Playground, id)

