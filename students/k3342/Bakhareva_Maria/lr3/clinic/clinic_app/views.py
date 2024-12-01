from django.db.models import Count, Sum, F
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import (
    Patient, MedicalRecord, Diagnosis, Service, Doctor, ConsultingRoom,
    Visit, DoctorSchedule, Payment
)
from .serializers import (
    PatientSerializer, MedicalRecordSerializer, DiagnosisSerializer, ServiceSerializer,
    DoctorSerializer, ConsultingRoomSerializer, VisitSerializer, DoctorScheduleSerializer, PaymentSerializer
)


### CRUD для пациентов
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def patient_list(request):
    if request.method == 'GET':
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def patient_detail(request, pk):
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        patient.delete()
        return Response(status=204)


### CRUD для медицинских карт
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def medical_record_list(request):
    if request.method == 'GET':
        records = MedicalRecord.objects.all()
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MedicalRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def medical_record_detail(request, pk):
    try:
        record = MedicalRecord.objects.get(pk=pk)
    except MedicalRecord.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = MedicalRecordSerializer(record)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MedicalRecordSerializer(record, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        record.delete()
        return Response(status=204)


### CRUD для диагнозов
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def diagnosis_list(request):
    if request.method == 'GET':
        diagnoses = Diagnosis.objects.all()
        serializer = DiagnosisSerializer(diagnoses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DiagnosisSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def diagnosis_detail(request, pk):
    try:
        diagnosis = Diagnosis.objects.get(pk=pk)
    except Diagnosis.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = DiagnosisSerializer(diagnosis)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DiagnosisSerializer(diagnosis, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        diagnosis.delete()
        return Response(status=204)


### CRUD для услуг
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def service_list(request):
    if request.method == 'GET':
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def service_detail(request, pk):
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        service.delete()
        return Response(status=204)


### CRUD для врачей
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def doctor_list(request):
    if request.method == 'GET':
        doctors = Doctor.objects.prefetch_related('services').all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            services = request.data.get('services', [])
            instance = serializer.save()
            instance.services.set(services)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def doctor_detail(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DoctorSerializer(doctor, data=request.data)
        if serializer.is_valid():
            services = request.data.get('services', [])
            instance = serializer.save()
            instance.services.set(services)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        doctor.delete()
        return Response(status=204)


### CRUD для кабинетов
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def consulting_room_list(request):
    if request.method == 'GET':
        rooms = ConsultingRoom.objects.all()
        serializer = ConsultingRoomSerializer(rooms, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ConsultingRoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def consulting_room_detail(request, pk):
    try:
        room = ConsultingRoom.objects.get(pk=pk)
    except ConsultingRoom.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = ConsultingRoomSerializer(room)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ConsultingRoomSerializer(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        room.delete()
        return Response(status=204)


### CRUD для визитов
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def visit_list(request):
    if request.method == 'GET':
        visits = Visit.objects.prefetch_related('diagnoses', 'services').all()
        serializer = VisitSerializer(visits, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = VisitSerializer(data=request.data)
        if serializer.is_valid():
            diagnoses = request.data.get('diagnoses', [])
            services = request.data.get('services', [])
            instance = serializer.save()
            instance.diagnoses.set(diagnoses)
            instance.services.set(services)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def visit_detail(request, pk):
    try:
        visit = Visit.objects.get(pk=pk)
    except Visit.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = VisitSerializer(visit)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = VisitSerializer(visit, data=request.data)
        if serializer.is_valid():
            diagnoses = request.data.get('diagnoses', [])
            services = request.data.get('services', [])
            instance = serializer.save()
            instance.diagnoses.set(diagnoses)
            instance.services.set(services)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        visit.delete()
        return Response(status=204)


### CRUD для расписания врачей (DoctorSchedule)
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def doctor_schedule_list(request):
    if request.method == 'GET':
        schedules = DoctorSchedule.objects.select_related('doctor').all()
        serializer = DoctorScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DoctorScheduleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def doctor_schedule_detail(request, pk):
    try:
        schedule = DoctorSchedule.objects.get(pk=pk)
    except DoctorSchedule.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = DoctorScheduleSerializer(schedule)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DoctorScheduleSerializer(schedule, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        schedule.delete()
        return Response(status=204)


### CRUD для платежей (Payment)
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def payment_list(request):
    if request.method == 'GET':
        payments = Payment.objects.select_related('visit').all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def payment_detail(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
    except Payment.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)

    if request.method == 'GET':
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PaymentSerializer(payment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        payment.delete()
        return Response(status=204)

### Реализация отчетов по тексту задания ###

### 1. Список всех пациентов заданного врача с датами и стоимостью приемов (по алфавиту)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def patients_of_doctor(request, doctor_id):
    patients = Patient.objects.filter(visit__doctor_id=doctor_id).annotate(
        visit_date=F('visit__date'),
        visit_cost=F('visit__total_cost')
    ).order_by('last_name', 'first_name')
    data = [
        {
            "patient_name": f"{patient.last_name} {patient.first_name}",
            "visit_date": patient.visit_date,
            "visit_cost": patient.visit_cost
        }
        for patient in patients
    ]
    return Response(data)

### 2. Телефоны пациентов, посещавших отоларингологов и рожденных после 1987 года
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def ent_patients_after_1987(request):
    patients = Patient.objects.filter(
        visit__doctor__specialization='Отоларинголог',
        date_of_birth__year__gt=1987
    ).values('phone_number').distinct()
    return Response(list(patients))

### 3. Список врачей, работающих в указанный день
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def doctors_working_on_day(request, day):
    doctors = Doctor.objects.filter(schedule__day_of_week=day).distinct()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)

### 4. Количество приемов пациентов по датам
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def visits_count_by_date(request):
    visits = Visit.objects.values('date').annotate(total_visits=Count('id')).order_by('date')
    return Response(list(visits))

### 5. Суммарная стоимость лечения пациентов по дням и по врачам
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def total_cost_by_day_and_doctor(request):
    costs = Visit.objects.values('date', 'doctor__last_name').annotate(
        total_cost=Sum('total_cost')
    ).order_by('date', 'doctor__last_name')
    return Response(list(costs))

### 6. Список пациентов, уже оплативших лечение
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def paid_patients_list(request):
    patients = Patient.objects.filter(visit__payment__isnull=False).distinct()
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)

### 7. Отчет о работе врачей за указанный промежуток времени
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def doctor_report(request, start_date, end_date):
    doctors = Doctor.objects.prefetch_related('visit_set').filter(
        visit__date__range=[start_date, end_date]
    ).distinct()

    report = []
    for doctor in doctors:
        visits = doctor.visit_set.filter(date__range=[start_date, end_date])
        total_income = visits.aggregate(total_income=Sum('total_cost'))['total_income']
        visit_details = [
            {
                "patient": f"{visit.patient.last_name} {visit.patient.first_name}",
                "diagnosis": [diag.name for diag in visit.diagnoses.all()],
                "cost": visit.total_cost
            }
            for visit in visits
        ]
        report.append({
            "doctor": f"{doctor.last_name} {doctor.first_name}",
            "visits": visit_details,
            "total_income": total_income
        })

    return Response(report)
