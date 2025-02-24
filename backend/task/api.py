"""
Task api
"""
from api import api
from utils.notify import notify
from task.schema import TaskSchema

from playground.mesh.models import Mesh
from playground.queues import mesh_tasks
from playground.mesh import mesh_on_complete

@api.post("/task/notify", auth=None)
def notify_task(request, uid: str, task_id: str, task: TaskSchema):
    if task_id in mesh_tasks:
        mid = mesh_on_complete(uid, task_id, task)

        mesh = Mesh.objects.get(id=mid)
        mesh_json = mesh.json(meta=True)
        notify(uid, mesh_json, mid=mid, notify_type="meshUpdate")
    