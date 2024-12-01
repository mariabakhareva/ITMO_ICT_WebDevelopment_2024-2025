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
    services = ServiceSerializer(many=True)  # Many-to-Many Field

    class Meta:
        model = Doctor
        fields = [
            'doctor_id', 'first_name', 'last_name', 'specialization', 'education',
            'gender', 'birth_date', 'work_start_date', 'work_end_date',
            'employment_contract', 'services'
        ]

class ConsultingRoomSerializer(serializers.ModelSerializer):
    responsible_doctor = DoctorSerializer()

    class Meta:
        model = ConsultingRoom
        fields = ['room_id', 'responsible_doctor', 'phone_number', 'work_date', 'work_start_time', 'work_end_time']

class VisitSerializer(serializers.ModelSerializer):
    record = MedicalRecordSerializer()
    doctor = DoctorSerializer()
    room = ConsultingRoomSerializer()
    diagnoses = DiagnosisSerializer(many=True)  # Many-to-Many Field
    services = ServiceSerializer(many=True)    # Many-to-Many Field

    class Meta:
        model = Visit
        fields = [
            'visit_id', 'record', 'doctor', 'room', 'visit_date', 'visit_time',
            'diagnoses', 'current_state', 'treatment_recommendations', 'services'
        ]

class DoctorScheduleSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer()

    class Meta:
        model = DoctorSchedule
        fields = ['schedule_id', 'doctor', 'work_date', 'work_start_time', 'work_end_time']

class PaymentSerializer(serializers.ModelSerializer):
    visit = VisitSerializer()

    class Meta:
        model = Payment
        fields = ['payment_id', 'visit', 'payment_date', 'payment_amount', 'payment_method', 'is_successful']
