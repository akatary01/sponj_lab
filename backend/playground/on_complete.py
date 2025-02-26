from task.schema import TaskSchema
from utils import playground_logger

from playground.models import Playground
from playground.queues import playground_tasks

def playground_on_complete(uid: str, task_id: str, task: TaskSchema) -> str | None:
    if task_id not in playground_tasks: return 

    pid = playground_tasks[task_id] # playground id

    playground = Playground.objects.get(id=pid)
    if task.type.name == "generate":
        if task.out.type.name == "mesh":
            playground_logger.info(f"{task.out.mesh} added to {pid}")
            playground.add_mesh(task.out.mesh)
        
    else:
        raise ValueError(f"Unknown task type {task.type}")
    
    del playground_tasks[task_id]

    return pid

