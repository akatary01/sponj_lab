"""
User models
"""
from django.db import models
from utils import ALPHABET_SIZE
from typing_extensions import override
from utils.models.base import BaseModel
from user.managers import CustomUserManager
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

##### Classes #####
class CustomUser(AbstractBaseUser, PermissionsMixin, BaseModel):
    """
    AF(first_name, last_name, date_of_birth, email) = user first_name last_name born on date_of_birth reachable at email
    
    Represnetation Invariant
        - inherits from AbstractBaseUser

    Representation Exposure
        - inherits from AbstractBaseUser
        - access is allowed to all fields but they are all immutable
    """
    
    ##### Representation #####
    first_name = models.CharField(max_length=ALPHABET_SIZE)
    last_name = models.CharField(max_length=ALPHABET_SIZE)
    email = models.EmailField(max_length=9*ALPHABET_SIZE, unique=True)
    
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # override uuid id
    id = models.CharField(primary_key=True, unique=True, max_length=2*ALPHABET_SIZE)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['id', 'first_name', 'last_name']

    objects = CustomUserManager()

    @override
    def json(self):
        return {
            "id": self.id,
            "email": self.email,
            
            "name": f"{self.first_name} {self.last_name}",

            # **super().json()
        }
    
    @override
    def __str__(self) -> str:
        """ Override AbstractBaseUser.__str__() """
        return f"{self.first_name} {self.last_name}: {self.id}"