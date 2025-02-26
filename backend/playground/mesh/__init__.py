from task.schema import TaskSchema
from playground.mesh.models import Mesh
from playground.queues import mesh_tasks

def mesh_on_complete(uid: str, task_id: str, task: TaskSchema) -> str | None:
    if task_id not in mesh_tasks: return 

    mid = mesh_tasks[task_id] # mesh id

    mesh = Mesh.objects.get(id=mid)

    mesh.status = "ready"
    if task.type.name == "edit":

        if task.out.type.name == "labels":
            mesh.segment(task.out.labels)
    
    del mesh_tasks[task_id]
    return mid 
