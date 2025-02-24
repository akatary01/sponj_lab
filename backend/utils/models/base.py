import uuid
from django.db import models
from utils.logger import Logger
from asgiref.sync import sync_to_async

class BaseModel(models.Model, Logger):
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True

    def json(self):
        return {
            "id": self.id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    async def ajson(self):
        return await sync_to_async(self.json)()

    