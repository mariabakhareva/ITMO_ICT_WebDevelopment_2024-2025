from django.urls import path
from .views import (
    register_student,
    login_student,
    task_list,
    create_task,
    submit_assignment,
    edit_assignment,
    admin_grades_list,
    show_only_my_grades,
    base_view,
    logout_student,
)

app_name = 'assignments'

urlpatterns = [
    # Учетная запись
    path('', base_view, name='base'),  # Главная страница
    path('register/', register_student, name='register'),
    path('login/', login_student, name='login'),
    path('logout/', logout_student, name='logout'),

    # Задания
    path('tasks/', task_list, name='task_list'),  # Список заданий
    path('tasks/create/', create_task, name='create_task'),  # Создание задания (только для админа)
    path('tasks/submit/<int:task_id>/', submit_assignment, name='submit_assignment'),  # Отправка задания
    path('tasks/edit/<int:assignment_id>/', edit_assignment, name='edit_assignment'),  # Редактирование задания

    # Оценки
    path('grades/', show_only_my_grades, name='my_grades'),  # Оценки текущего студента
    path('admin/grades/', admin_grades_list, name='admin_grades'),  # Оценки всех студентов (только админ)
]
