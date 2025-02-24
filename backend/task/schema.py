from enum import Enum
from ninja import Schema
from typing import List, Optional

from playground.schema import SponjMesh

class TaskOutType(str, Enum):
    img = "img"
    mesh = "mesh"
    labels = "labels"

class TaskOut(Schema):
    type: TaskOutType
    img: Optional[str] = None
    mesh: Optional[SponjMesh] = None
    labels: Optional[List[int]] = None

class TaskType(str, Enum):
    edit = "edit"
    generate = "generate"

# class TaskMeta(Schema):
#     cost: float
    # finished_at: str

class TaskSchema(Schema):
    out: TaskOut 
    # meta: TaskMeta
    type: TaskType 