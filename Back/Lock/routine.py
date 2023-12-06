from datetime import datetime, timedelta
from django.utils import timezone
from apscheduler.schedulers.background import BackgroundScheduler
from Lock.models import Task
 
def TriggerTasks():
        tz = timezone.get_default_timezone()

        min_start = timezone.make_aware(datetime.now().replace(second=0, microsecond=0), tz)
        min_end = timezone.make_aware(datetime.now().replace(second=59, microsecond=999999), tz)

        tasks = list(Task.objects.filter(time__gte=min_start, time__lte=min_end))

        for task in tasks:
            task.terminal.status = 1
            task.terminal.save()
            
def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(TriggerTasks, 'interval', minutes=1)
    scheduler.start()