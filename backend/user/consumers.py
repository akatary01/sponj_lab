import json
from utils import user_logger
from user.models import CustomUser
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class UserConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        params =  self.scope['url_route']['kwargs']
        uid = params['uid'].replace("_", "-")

        self.user = await CustomUser.objects.aget(id=uid)
        await self.channel_layer.group_add(self.user.id, self.channel_name)

        user_logger.info(f"{self.user.id} connected")

    async def disconnect(self, close_code):
        pass

    async def notify(self, event):
        user_logger.debug(f"notifying {self.user.id}...")
        await self.send(text_data=json.dumps(event['json']))
    
    async def notify_bytes(self, event):
        user_logger.debug(f"notifying {self.user.id}...")
        await self.send(bytes_data=event['bytes'])
    
    async def receive(self, text_data=None, bytes_data=None):
        user_logger.debug(f"received {text_data} from {self.user.id}...")