from django.apps import AppConfig

class Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

class PlaygroundConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'playground'

class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user'

