"""
Mesh api
"""
import uuid
import asyncio
import requests
from typing import List
from channels.layers import get_channel_layer

from api import api
from utils.notify import notify
from utils import get, AI_API_URL

from playground.mesh.models import Mesh
from playground.models import Playground
from playground.mesh.schema import Geometry, Style
from playground.queues import mesh_tasks, playground_tasks

@api.get("/playground/mesh", auth=None)
def mesh_get(request, id: str):
    return get(Mesh, id)

@api.post("/playground/mesh/generate")
def mesh_generate(request, pid: str, geos: List[Geometry], styles: List[Style]):
    uid = request.auth.id
    playground = Playground.objects.get(id=pid)

    url, body = f"{AI_API_URL}/mesh/generate", {
        'uid': uid,

        'geos': [Mesh.parse_data(geos[0])],
        'styles': [Mesh.parse_data(style) for style in styles],
        
        'is_sketch': False
    }
    
    response = requests.post(url, json=body)
    task_id = response.json()["task_id"]
    playground_tasks[task_id] = str(playground.id)

    notify(uid, {"status": "regenerating"}, notify_type="playgroundUpdate", pid=str(playground.id))

    return {"task_id": task_id}

@api.post("/playground/mesh/segment")
def mesh_segment(request, mid: str):
    mesh = Mesh.objects.get(id=mid)
    
    if mesh.labels: return 

    mesh_json = mesh.json()

    mesh.status = "segmenting"
    mesh.save()

    url, body = f"{AI_API_URL}/mesh/segment", {
        'uid': f"{request.auth.id}",
        
        'faces': mesh_json["faces"],
        'vertices': mesh_json["vertices"],
    }
    
    response = requests.post(url, json=body)
    task_id = response.json()["task_id"]
    mesh_tasks[task_id] = str(mesh.id)

    notify(request.auth.id, {"status": "segmenting"}, notify_type="meshUpdate", mid=mid)
    return {"task_id": task_id}

# TODO: @api.post("/playground/mesh/style")
