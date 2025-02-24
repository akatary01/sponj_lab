"""
Mesh api
"""
import uuid
import requests

from api import api
from utils import get, AI_API_URL

from playground.mesh.models import Mesh
from playground.queues import mesh_tasks

@api.get("/playground/mesh", auth=None)
def mesh_get(request, id: str):
    return get(Mesh, id)

@api.post("/playground/mesh/segment")
def mesh_segment(request, mid: str):
    path_id = str(uuid.uuid4())
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
    
    task_id = requests.post(url, json=body)
    mesh_tasks[task_id] = path_id

    return {"task_id": task_id}

# TODO: @api.post("/playground/mesh/style")
