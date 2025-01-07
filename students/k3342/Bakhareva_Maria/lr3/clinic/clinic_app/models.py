from django.db import models

class Patient(models.Model):
    patient_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    phone_number = models.CharField(max_length=15)
    email = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

class MedicalRecord(models.Model):
    record_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')

    def __str__(self):
        return f"Medical Record #{self.record_id} for {self.patient}"


class Diagnosis(models.Model):
    diagnosis_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Service(models.Model):
    service_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Doctor(models.Model):
    doctor_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    education = models.CharField(max_length=200)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    birth_date = models.DateField()
    work_start_date = models.DateField()
    work_end_date = models.DateField(null=True, blank=True)
    employment_contract = models.TextField()
    services = models.ManyToManyField(Service, related_name='doctors')  # Many-to-Many Field

    def __str__(self):
        return f"Dr. {self.last_name} ({self.specialization})"

class ConsultingRoom(models.Model):
    room_id = models.AutoField(primary_key=True)
    responsible_doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name='managed_rooms')
    phone_number = models.CharField(max_length=15)
    work_date = models.DateField()
    work_start_time = models.TimeField()
    work_end_time = models.TimeField()

    def __str__(self):
        return f"Room #{self.room_id} - Phone: {self.phone_number}"


class Visit(models.Model):
    visit_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='visits')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='visits')
    room = models.ForeignKey(ConsultingRoom, on_delete=models.SET_NULL, null=True, related_name='visits')
    visit_date = models.DateField()
    visit_time = models.TimeField()
    diagnoses = models.ManyToManyField(Diagnosis, related_name='visits')  # Many-to-Many Field
    current_state = models.TextField(blank=True)
    treatment_recommendations = models.TextField(blank=True)
    services = models.ManyToManyField(Service, related_name='visits')  # Many-to-Many Field

    @property
    def total_cost(self):
        return sum(service.price for service in self.services.all())

    def __str__(self):
        return f"Visit #{self.visit_id} on {self.visit_date} by Dr. {self.doctor.last_name}"

class DoctorSchedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='schedule')
    work_date = models.DateField()
    work_start_time = models.TimeField()
    work_end_time = models.TimeField()

    def __str__(self):
        return f"Schedule for Dr. {self.doctor.last_name} on {self.work_date}"

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateTimeField()
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=[
        ('Cash', 'Cash'),
        ('Card', 'Card'),
        ('Online', 'Online'),
    ])
    is_successful = models.BooleanField(default=True)

    def __str__(self):
        return f"Payment #{self.payment_id} - ${self.payment_amount} for Visit #{self.visit_id}"
