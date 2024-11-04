from datetime import date

import bcrypt
from django.utils import timezone
from django.db import models


class StudentClass(models.Model):
    # Название класса
    class_name = models.CharField(max_length=2, unique=True)

    def __str__(self):
        return self.class_name


class Student(models.Model):
    # Информация о студенте
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    assigned_class = models.ForeignKey(StudentClass, on_delete=models.SET_NULL, null=True, blank=True, related_name="students")

    def __str__(self):
        return self.username

    def set_password(self, raw_password):
        hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed_password.decode('utf-8')

    def check_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))


class Task(models.Model):
    # Свойства задания
    title = models.CharField(max_length=120)
    description = models.TextField()
    date_issued = models.DateTimeField(default=timezone.now)  # установите значение по умолчанию
    deadline = models.DateField()
    created_by = models.CharField(max_length=100)
    # Связь "многие ко многим" между заданиями и классами, которым они назначены
    applicable_classes = models.ManyToManyField(StudentClass, related_name='tasks', blank=True)

    def __str__(self):
        return f'{self.title} - Due: {self.deadline}'

    @property
    def overdue(self):
        return date.today() > self.deadline


class Assignment(models.Model):
    ASSIGNMENT_STATUSES = [
        ('assigned', 'Assigned'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
    ]

    # Связь "многие ко многим" между заданиями и студентами для учета назначенных и выполненных заданий
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='assignments')

    submission_text = models.TextField(blank=True, null=True)
    grade = models.PositiveSmallIntegerField(null=True, blank=True)
    submission_date = models.DateField(null=True, blank=True)
    reviewed_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=ASSIGNMENT_STATUSES, default='assigned')


    class Meta:
        unique_together = ('task', 'student')

    def __str__(self):
        return f'{self.task.title} - {self.student.username} - Status: {self.status}'

