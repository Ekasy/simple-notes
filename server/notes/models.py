from django.db import models
from django.utils import timezone
from uuid import uuid4


class Note(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(max_length=1000)
    updated = models.DateTimeField(default=timezone.now, blank=True)
    owner = models.CharField(max_length=30, default='None')

    def update_date(self):
        self.updated = timezone.now()

    def __str__(self):
        return "{0} upd: {1}".format(self.title, self.updated)


class User(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    token = models.CharField(max_length=36)

    def set_token(self):
        self.token = str(uuid4())

    def __str__(self):
        return self.username
