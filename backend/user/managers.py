"""
User managers
"""
import json
from http import HTTPStatus
from utils import user_logger
from datetime import datetime
from typing import Any, Coroutine
from asgiref.sync import sync_to_async
from django.core.validators import validate_email
from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError, ObjectDoesNotExist

from utils import BASE_DIR

##### Classes #####
class CustomUserManager(BaseUserManager):
    use_in_migrations = True
    
    def create(self, id, first_name, last_name, email, password = None):
        try: 
            validate_email(email)
            if self.get(email=email): 
                raise ValidationError("Email exists")
    
        except ValidationError as error:
            user_logger.error(f"Error occured while signing up user\n{error}")
            return None, HTTPStatus.PRECONDITION_FAILED

        except ObjectDoesNotExist as error:
            user = self.model(
                id = id,
                email = email,
                last_name = last_name,
                first_name = first_name,
            )
    
            user.set_password(password)
            user.save(using = self._db)

            return user, HTTPStatus.CREATED
    
    def create_user(self, id, first_name, last_name, email, password = None):
        user, user_status = self.create(id, first_name, last_name, email, password)

        if user_status == HTTPStatus.CREATED:
            user_logger.info("User created")
            
            with open(f"{BASE_DIR}/media/users/template.json", "r") as template_log:
                template_log = json.loads(template_log.read())

            # creates user's summarized log
            with open(f"{BASE_DIR}/media/users/{user.id}.json", "r") as user_log:
                
                template_log['uid'] = user.id
                template_log['last_login'] = datetime.now().isoformat()

                user_log.write(template_log)

            user.save(using = self._db)
        else: 
            user_logger.warning(f"Failed to create user: {user_status}")

        return user, user_status

    def create_superuser(self, id, first_name, last_name, email, password = None):
        user, user_status = self.create(id, first_name, last_name, email, password=password)

        if user_status == HTTPStatus.CREATED:
            user_logger.info("User created\nSetting permissions ...")
            user.is_staff = True
            user.is_admin = True
            user.is_superuser = True
            user.save(using = self._db)
        else: user_logger.warning(f"Failed to create user: {user_status}")

        return user, user_status

    async def acreate(self, id, first_name, last_name, email, password = None) -> Coroutine[Any, Any, Any]:
        user_logger.info(f"Creating user...")
        return await sync_to_async(self.create)(id, first_name, last_name, email, password)

