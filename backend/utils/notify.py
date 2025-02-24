import asyncio
from utils import Json
from channels.layers import get_channel_layer

def notify(uid: str, data_json: Json, notify_type: str, **kwargs):
    channel_layer = get_channel_layer()
    asyncio.run(channel_layer.group_send(
        uid, 
        {
            "json": {
                'data': data_json,
                'type': notify_type,
                **kwargs
            },
            "type": "notify", 
        }
    ))