from django.apps import AppConfig

class LockConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Lock'

    def ready(self):
        from Lock import routine
        routine.start()
