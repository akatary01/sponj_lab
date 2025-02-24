from django.contrib import admin

from playground.mesh.models import Mesh, MeshParam
admin.site.register(Mesh)
admin.site.register(MeshParam)

from playground.models import Playground
admin.site.register(Playground)

