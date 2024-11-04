from django.contrib import admin
from datetime import date
from .models import Task, Student, Assignment, StudentClass


class StudentClassAdmin(admin.ModelAdmin):
    list_display = ('class_name', 'display_students')

    def display_students(self, obj):
        # Формируем список студентов в классе, выводя их имена через запятую
        students = obj.students.all()
        return ", ".join(student.name for student in students) if students else "No students"

    display_students.short_description = 'Students in Class'


class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'assigned_class')
    list_filter = ('assigned_class',)
    readonly_fields = ('name', 'email')
    fields = ('name', 'email', 'assigned_class')

    def get_student_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('assigned_class')


class TaskAdmin(admin.ModelAdmin):
    exclude = ('created_by', 'date_issued')

    def save_task(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user.username
            obj.date_issued = date.today()
        super().save_model(request, obj, form, change)


class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('get_task_title', 'get_student_name', 'submission_date', 'grade', 'status')
    readonly_fields = ('submission_text', 'task', 'student', 'submission_date')
    fields = ('task', 'student', 'submission_text', 'submission_date', 'grade', 'status')

    def get_assignments_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_authenticated:
            return qs.filter(task__created_by=request.user.username)
        return qs.none()

    def get_task_title(self, obj):
        return obj.task.title

    def get_student_name(self, obj):
        return obj.student.name

    get_task_title.short_description = 'Task Title'
    get_student_name.short_description = 'Student Name'

    def save_assignment(self, request, obj, form, change):
        if not obj.grade:
            obj.reviewed_date = date.today()
            obj.status = 'reviewed'
        super().save_model(request, obj, form, change)


# Регистрация моделей и их админ-интерфейсов
admin.site.register(Task, TaskAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(StudentClass, StudentClassAdmin)
