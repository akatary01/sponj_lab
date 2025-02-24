from enum import Enum
from typing import List
from ninja import Schema

class MeshStatus(str, Enum):
    error = "error"
    ready = "ready"
    segmenting = "segmenting"
    regenerating = "regenerating"

class SponjMesh(Schema):
    gif: str

    faces: List[List[int]]
    colors: List[List[float]]
    normals: List[List[float]]
    vertices: List[List[float]]
