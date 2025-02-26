"""
Task api
"""
from api import api
from utils.notify import notify
from task.schema import TaskSchema
from utils import playground_logger

from playground.mesh.models import Mesh
from playground.models import Playground
from playground.mesh import mesh_on_complete
from playground.on_complete import playground_on_complete
from playground.queues import mesh_tasks, playground_tasks

@api.post("/task/notify", auth=None)
def notify_task(request, uid: str, task_id: str, task: TaskSchema):
    playground_logger.info(f"(uid) >> {uid}")
    playground_logger.info(f"(task_id) >> {task_id}")
    playground_logger.info(f"(task) >> {task}")

    if task_id in mesh_tasks:
        mid = mesh_on_complete(uid, task_id, task)

        mesh = Mesh.objects.get(id=mid)
        mesh_json = mesh.json(meta=True)
        notify(uid, mesh_json, mid=mid, notify_type="meshUpdate")
    
    elif task_id in playground_tasks:
        pid = playground_on_complete(uid, task_id, task)
        playground_logger.info(f"playground {pid} updated")
        
        playground = Playground.objects.get(id=pid)
        
        playground_json = playground.json()
        notify(uid, playground_json, mid=pid, notify_type="playgroundUpdate")
    