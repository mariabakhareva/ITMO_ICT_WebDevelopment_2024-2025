from rest_framework import serializers
from .models import Patient, MedicalRecord, Diagnosis, Service, Doctor, ConsultingRoom, Visit, DoctorSchedule, Payment

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['patient_id', 'first_name', 'last_name', 'birth_date', 'phone_number', 'email']

class MedicalRecordSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()

    class Meta:
        model = MedicalRecord
        fields = ['record_id', 'patient']

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = ['diagnosis_id', 'name', 'description']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['service_id', 'name', 'description', 'price']

class DoctorSerializer(serializers.ModelSerializer):
    services = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all(), many=True)

    class Meta:
        model = Doctor
        fields = [
            'doctor_id', 'first_name', 'last_name', 'specialization', 'education',
            'gender', 'birth_date', 'work_start_date', 'work_end_date',
            'employment_contract', 'services'
        ]

class ConsultingRoomSerializer(serializers.ModelSerializer):
    responsible_doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())  # Только ID

    class Meta:
        model = ConsultingRoom
        fields = ['room_id', 'responsible_doctor', 'phone_number', 'work_date', 'work_start_time', 'work_end_time']

class VisitSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())  # Only ID
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())  # Only ID
    room = serializers.PrimaryKeyRelatedField(queryset=ConsultingRoom.objects.all())  # Only ID
    diagnoses = serializers.PrimaryKeyRelatedField(queryset=Diagnosis.objects.all(), many=True)  # Only ID for many
    services = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all(), many=True)  # Only ID for many

    class Meta:
        model = Visit
        fields = [
            'visit_id', 'patient', 'doctor', 'room', 'visit_date', 'visit_time',
            'diagnoses', 'current_state', 'treatment_recommendations', 'services'
        ]

class DoctorScheduleSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())  # Используем ID для врача

    class Meta:
        model = DoctorSchedule
        fields = ['schedule_id', 'doctor', 'work_date', 'work_start_time', 'work_end_time']

class PaymentSerializer(serializers.ModelSerializer):
    visit = serializers.PrimaryKeyRelatedField(queryset=Visit.objects.all())  # Используем ID для врача

    class Meta:
        model = Payment
        fields = ['payment_id', 'visit', 'payment_date', 'payment_amount', 'payment_method', 'is_successful']
