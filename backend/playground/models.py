"""
Playground models
"""
import pymeshlab
from django.db import models
from django.conf import settings
from typing_extensions import override

from utils import base64_to_bytes
from playground.schema import SponjMesh
from utils.models.perm import PermModel
from playground.mesh.models import Mesh

class Playground(PermModel):
    meshes = models.ManyToManyField(Mesh, related_name="meshes", blank=True)

    def add_mesh(self, mesh: SponjMesh):
        faces = mesh.faces
        colors =  mesh.colors
        normals = mesh.normals
        vertices = mesh.vertices

        ms = pymeshlab.MeshSet()
        ms.add_mesh(pymeshlab.Mesh(
            face_matrix=faces,
            v_color_matrix=colors,
            vertex_matrix=vertices,
            v_normals_matrix=normals,
        ))
        new_mesh = Mesh.objects.create()

        gif_bytes = base64_to_bytes(mesh.gif)
        new_mesh.gif.save(f"{new_mesh.id}.gif", gif_bytes)

        path = f"{settings.MEDIA_ROOT}/meshes/{new_mesh.id}.obj"
        ms.save_current_mesh(path)

        new_mesh.path = path
        new_mesh.save()
        
        self.meshes.add(new_mesh)

        return new_mesh
    
    def delete(self):
        for mesh in self.meshes.all():
            mesh.delete()
        super().delete()

    @override
    def json(self):
        
        return {
            "id": str(self.id),
            "title": self.title,
            "meshes": [mesh.json(meta=True) for mesh in self.meshes.all()]
        }
