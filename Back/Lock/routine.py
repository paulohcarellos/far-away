from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from Lock.models import Task
 
def TriggerTasks():
        now = datetime.now()

        tasks = list(Task.objects.filter(time__gte=now))
        now.minute -= 1

        for task in tasks:
            if task.time > now:
                task.terminal.status = 1
                task.terminal.save()

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(TriggerTasks, 'interval', minutes=1)
    scheduler.start()