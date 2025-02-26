from typing import Optional
from ninja import Schema, UploadedFile, File

class Geometry(Schema):
    img: Optional[str] = None
    prompt: Optional[str] = None
    strength: Optional[float] = 0.7

class Style(Schema):
    img: Optional[str] = None
    prompt: Optional[str] = None
    strength: Optional[float] = 0.3