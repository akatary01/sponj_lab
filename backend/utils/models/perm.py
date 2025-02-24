from django.db import models
from utils import ALPHABET_SIZE
from user.models import CustomUser
from typing_extensions import override
from utils.models.base import BaseModel

class PermModel(BaseModel):
    title = models.CharField(max_length=ALPHABET_SIZE)

    editors = models.ManyToManyField(CustomUser, related_name="%(class)s_editors", blank=True)
    viewers = models.ManyToManyField(CustomUser, related_name="%(class)s_viewers", blank=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="%(class)s_owner")

    class Meta:
        abstract = True

    @override
    def json(self):
        return {
            "title": self.title,
            "owner": self.owner.json(),
            "editors": [editor.json() for editor in self.editors.all()],
            "viewers": [viewer.json() for viewer in self.viewers.all()],

            **super().json()
        }
    
    def get_perms(self, uid: str):
        return {
            "isOwner": self.is_owner(uid),
            "isEditor": self.is_editor(uid),
            "isViewer": self.is_viewer(uid),
        }

    def is_viewer(self, uid: str):
        return self.viewers.filter(id=uid).exists()

    def is_editor(self, uid: str):
        return self.editors.filter(id=uid).exists()
    
    def is_owner(self, uid: str):
        return self.owner.id == uid
    
    def __str__(self):
        return f"{self.title} ({self.id})"