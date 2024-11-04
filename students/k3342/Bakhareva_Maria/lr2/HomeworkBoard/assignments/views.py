from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone

from .models import Student, Assignment, Task
from .forms import (
    StudentRegistrationForm,
    StudentLoginForm,
    AssignmentSubmissionForm,
    TaskCreationForm
)

def base_view(request):
    return render(request, 'base.html')

def register_student(request):
    if request.method == 'POST':
        form = StudentRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('assignments:login')
    else:
        form = StudentRegistrationForm()
    return render(request, 'account/register.html', {'form': form})



def login_student(request):
    if request.method == 'POST':
        form = StudentLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            student = Student.objects.filter(username=username)
            if student.exists() and student.first().check_password(password):
                request.session['userid'] = student.first().id
                return redirect('assignments:base')
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid form submission.")
    else:
        form = StudentLoginForm()
    return render(request, 'account/login.html', {'form': form})


# Функция для проверки аутентификации студента
def student_authenticated(user_id):
    return Student.objects.filter(pk=user_id).exists()


# Представление для просмотра заданий
def task_list(request):
    userid = request.session.get('userid')
    if not student_authenticated(userid):
        return redirect('assignments:login')

    student = Student.objects.get(pk=userid)
    tasks = Task.objects.all()
    student_assignments = Assignment.objects.filter(student=student)
    assignment_grades = {assignment.task.id: assignment.grade for assignment in student_assignments}

    return render(request, 'tasks/task_list.html', {
        'tasks': tasks,
        'assignment_grades': assignment_grades,
    })


# Представление для сдачи задания
def submit_assignment(request, task_id):
    userid = request.session.get('userid')
    if not student_authenticated(userid):
        return redirect('assignments:login')

    student = Student.objects.get(pk=userid)
    task = get_object_or_404(Task, id=task_id)

    # Проверяем, существует ли уже отправленное задание
    assignment = Assignment.objects.filter(task=task, student=student).first()

    # Если задание уже отправлено, перенаправляем пользователя
    if assignment and assignment.status == 'submitted':
        messages.info(request, 'Вы уже отправили это задание.')
        return redirect('assignments:task_list')

    # Если форма отправлена
    if request.method == 'POST':
        form = AssignmentSubmissionForm(request.POST)
        if form.is_valid():
            if not assignment:  # Создаем новое задание, если его еще нет
                assignment = form.save(commit=False)
                assignment.task = task
                assignment.student = student

            # Устанавливаем статус "submitted" и дату сдачи
            assignment.status = 'submitted'
            assignment.submission_date = timezone.now()
            assignment.save()

            messages.success(request, 'Задание успешно отправлено!')
            return redirect('assignments:task_list')
    else:
        form = AssignmentSubmissionForm(instance=assignment)

    return render(request, 'submit_assignment.html', {
        'form': form,
        'task': task
    })



# Представление для редактирования задания (домашнего задания)
def edit_assignment(request, assignment_id):
    userid = request.session.get('userid')
    if not student_authenticated(userid):
        return redirect('assignments:login')  # Перенаправляем на страницу входа, если пользователь не аутентифицирован

    assignment = get_object_or_404(Assignment, id=assignment_id)
    if request.method == 'POST':
        form = AssignmentSubmissionForm(request.POST, instance=assignment)
        if form.is_valid():
            form.save()
            messages.success(request, "Assignment updated successfully!")
            return redirect('assignments:task_list')
    else:
        form = AssignmentSubmissionForm(instance=assignment)
    return render(request, 'assignments/edit_assignment.html', {'form': form, 'assignment': assignment})



# Представление для создания новой задачи (только для администратора)
@user_passes_test(lambda user: user.is_superuser)
def create_task(request):
    if request.method == 'POST':
        form = TaskCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Task created successfully!")
            return redirect('assignments:task_list')  # Перенаправление на список задач
    else:
        form = TaskCreationForm()
    return render(request, 'tasks/create_task.html', {'form': form})


# Представление для отображения оценок всех учеников (только для администратора)
@user_passes_test(lambda user: user.is_superuser)
def admin_grades_list(request):
    assignments = Assignment.objects.select_related('task', 'student').all()
    return render(request, 'grades/admin_grades.html', {
        'assignments': assignments
    })


# Представление для отображения оценок студента
def show_only_my_grades(request):
    userid = request.session.get('userid')
    if not student_authenticated(userid):
        return redirect('assignments:login')  # Перенаправляем на страницу входа, если пользователь не аутентифицирован

    student = Student.objects.get(pk=userid)  # Получаем текущего студента
    graded_assignments = Assignment.objects.filter(
        student=student,
        status='reviewed'  # Получаем только оцененные задания
    ).select_related('task')

    return render(request, 'grades/show_only_my_grades.html', {
        'graded_assignments': graded_assignments
    })


def logout_student(request):
    del request.session['userid']
    return redirect('assignments:login')