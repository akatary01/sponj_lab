import json 
import base64
import logging
from PIL import Image
from io import BytesIO
from pathlib import Path
from copy import deepcopy
from http import HTTPStatus
from django.db import models
from typing import Dict, Any
from collections.abc import Callable
from django.core.exceptions import ValidationError

ALPHABET_SIZE = 26
# APP_URL = "https://sponj3d.com"
APP_URL = "http://localhost:8000"
AI_API_URL = "https://sponj3d.com/ai"
BASE_DIR = Path(__file__).resolve().parent.parent


INFO = "info"
WARN = "warn"
ERROR = "error"
FILE = "[utils]"

user_logger = logging.getLogger('user')
django_logger = logging.getLogger('django')
playground_logger = logging.getLogger('playground')
request_logger = logging.getLogger('django.request')


type Json = dict[str, "Json"] | list["Json"] | str | int | float | bool | None

def get(model: models.Model, id: str, default=-1) -> Dict[str, str | int]:
    try:
        return model.objects.get(id=id).json()
    except model.DoesNotExist:
        if default != -1: return default
        return {"error": f"{model.__name__} does not exist", "status": HTTPStatus.NOT_FOUND}
    except ValidationError:
        if default != -1: return default
        return {"error": f"Invalid {model.__name__} id", "status": HTTPStatus.BAD_REQUEST}

def base64_to_bytes(base64_str: str):
    return BytesIO(base64.decodebytes(bytes(base64_str, "utf-8")))

def img_to_bytes(img: Image):
    img_byte_arr = BytesIO()
    img.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

def remove_none_keys(obj: Dict) -> Dict:
    valid = {}
    for key, val in obj.items():
        if isinstance(val, Dict):
            val = remove_none_keys(val)

        if val is not None:
            if isinstance(val, Dict) and len(val) == 0: continue
            valid[key] = val

    return valid

def merge(obj: Dict, valid: Dict, merge_fn: Callable[[Any, Any], Any] = lambda a, b: a + b):
    """ Requires valid to have no None values """
    merged = deepcopy(obj)
    for key, val in valid.items():
        if obj.get(key, None) is not None:
            if isinstance(val, Dict):
                merged[key] = merge(obj[key], val, merge_fn)
            else:
                merged[key] = merge_fn(obj[key], val)
        else:
            merged[key] = val

    return merged