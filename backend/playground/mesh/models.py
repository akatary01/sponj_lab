"""
Mesh models
"""
import os
import base64
import requests
from io import BytesIO
from typing import List
from typing_extensions import override

import pymeshlab
import numpy as np 
from django.db import models
from django.conf import settings

from utils.models.perm import BaseModel
from utils import APP_URL, ALPHABET_SIZE
from playground.schema import MeshStatus
from playground.mesh.schema import Geometry, Style

class MeshParam(BaseModel):
    params = models.JSONField(blank=True, null=True)

    @override
    def json(self):
        return self.params
        
class Mesh(BaseModel):
    labels = models.TextField(blank=True, null=True)
    path = models.CharField(max_length=255, blank=True, null=True)

    params = models.ForeignKey(MeshParam, on_delete=models.CASCADE, blank=True, null=True)

    gif = models.ImageField(upload_to="mesh_gifs", blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True, default="Unnamed Mesh")
    status = models.CharField(max_length=ALPHABET_SIZE, choices={status.name: status.name for status in MeshStatus}, default="ready")
    
    parent_mesh = models.ForeignKey("Mesh", on_delete=models.CASCADE, blank=True, null=True, name="parent_mesh")

    def segment(self, labels: List[int]):
        self.labels = labels
        self.save()

        mesh_json = self.json()

        n = len(set(labels)) 
        segments_faces = {i: [] for i in range(n)} 

        for i in range(len(labels)):
            segments_faces[labels[i]].append(mesh_json["faces"][i])
        
        ms = pymeshlab.MeshSet()
        for i, faces in segments_faces.items():
            seen = {}
            colors = []
            vertices = []
            remapped_faces = []
            for face in faces:
                remapped_face = []

                for v in face:
                    if v not in seen:
                        seen[v] = len(vertices)
                        vertices.append(mesh_json["vertices"][v])
                        colors.append(mesh_json["colors"][v] + [1.0])

                    remapped_face.append(seen[v])
                remapped_faces.append(remapped_face)

            mesh = pymeshlab.Mesh(
                v_color_matrix=np.array(colors),
                vertex_matrix=np.array(vertices),
                face_matrix=np.array(remapped_faces),
            )
            ms.add_mesh(mesh)

            segment_path = f"{self.path.replace('.obj', f'_{i}.obj')}"
            ms.save_current_mesh(segment_path)

            segment = Mesh.objects.create(
                parent_mesh=self,
                path=segment_path,
                title=f"{self.title}_{i}"
            )
            segment.save()
        ms.clear()

    def delete(self):
        if self.gif: self.gif.delete()
        os.remove(self.path)
        super().delete()
    
    @staticmethod
    def parse_data(data: Geometry | Style):
        data_info = {
            'strength': data.strength,
        }
        
        if data.prompt:
            data_info['prompt'] = data.prompt

        elif data.img:
            data_info['img'] = data.img.split(",")[1]
    
        return data_info
    
    @override
    def json(self, meta=False):
        gif = ""
        if self.gif: gif = f"{APP_URL}{self.gif.url}"

        meta_json = {
            "gif": gif,
            "id": str(self.id),
            "title": self.title,
            "status": self.status,
            "url": f"{settings.MEDIA_URL}{self.path.split("media/")[-1]}",
            "segments": [segment.json(meta=True) for segment in Mesh.objects.filter(parent_mesh=self)]
        }

        if meta: return meta_json
        
        ms = pymeshlab.MeshSet()
        ms.load_new_mesh(self.path)

        mesh = ms.current_mesh()
        mesh_json = {
            "faces": mesh.face_matrix().tolist(),
            "vertices": mesh.vertex_matrix().tolist(),
            "normals": mesh.vertex_normal_matrix().tolist(),
            "colors": mesh.vertex_color_matrix()[:, :3].tolist()
        }
        if self.params: 
            return {**mesh_json, **meta_json, **self.params.json()}
        return {**mesh_json, **meta_json}
    
    def __str__(self):
        return f"{self.title} ({self.id})"
    