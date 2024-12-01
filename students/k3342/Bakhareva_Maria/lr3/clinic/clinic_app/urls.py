from django.urls import path
from . import views

urlpatterns = [
    # CRUD для пациентов
    path('patients/', views.patient_list, name='patient-list'),
    path('patients/<int:pk>/', views.patient_detail, name='patient-detail'),

    # CRUD для медицинских карт
    path('medical-records/', views.medical_record_list, name='medical-record-list'),
    path('medical-records/<int:pk>/', views.medical_record_detail, name='medical-record-detail'),

    # CRUD для диагнозов
    path('diagnoses/', views.diagnosis_list, name='diagnosis-list'),
    path('diagnoses/<int:pk>/', views.diagnosis_detail, name='diagnosis-detail'),

    # CRUD для услуг
    path('services/', views.service_list, name='service-list'),
    path('services/<int:pk>/', views.service_detail, name='service-detail'),

    # CRUD для врачей
    path('doctors/', views.doctor_list, name='doctor-list'),
    path('doctors/<int:pk>/', views.doctor_detail, name='doctor-detail'),

    # CRUD для кабинетов
    path('consulting-rooms/', views.consulting_room_list, name='consulting-room-list'),
    path('consulting-rooms/<int:pk>/', views.consulting_room_detail, name='consulting-room-detail'),

    # CRUD для визитов
    path('visits/', views.visit_list, name='visit-list'),
    path('visits/<int:pk>/', views.visit_detail, name='visit-detail'),

    # CRUD для расписания врачей
    path('doctor-schedules/', views.doctor_schedule_list, name='doctor-schedule-list'),
    path('doctor-schedules/<int:pk>/', views.doctor_schedule_detail, name='doctor-schedule-detail'),

    # CRUD для платежей
    path('payments/', views.payment_list, name='payment-list'),
    path('payments/<int:pk>/', views.payment_detail, name='payment-detail'),

    # Отчеты
    path('reports/patients-of-doctor/<int:doctor_id>/', views.patients_of_doctor, name='patients-of-doctor'),
    path('reports/ent-patients-after-1987/', views.ent_patients_after_1987, name='ent-patients-after-1987'),
    path('reports/doctors-working-on-day/<str:day>/', views.doctors_working_on_day, name='doctors-working-on-day'),
    path('reports/visits-count-by-date/', views.visits_count_by_date, name='visits-count-by-date'),
    path('reports/total-cost-by-day-and-doctor/', views.total_cost_by_day_and_doctor, name='total-cost-by-day-and-doctor'),
    path('reports/paid-patients-list/', views.paid_patients_list, name='paid-patients-list'),
    path('reports/doctor-report/<str:start_date>/<str:end_date>/', views.doctor_report, name='doctor-report'),

]
