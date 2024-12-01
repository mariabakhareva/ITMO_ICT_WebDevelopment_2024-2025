from rest_framework.test import APITestCase
from rest_framework import status
from .models import Patient

class PatientAPITestCase(APITestCase):
    def test_create_patient(self):
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "birth_date": "1980-01-01",
            "phone_number": "+123456789",
            "email": "john.doe@example.com"
        }
        response = self.client.post('/patients/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Patient.objects.count(), 1)
        self.assertEqual(Patient.objects.get().first_name, "John")

    def test_get_patients(self):
        Patient.objects.create(
            first_name="Jane",
            last_name="Smith",
            birth_date="1990-05-12",
            phone_number="+987654321",
            email="jane.smith@example.com"
        )
        response = self.client.get('/patients/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
