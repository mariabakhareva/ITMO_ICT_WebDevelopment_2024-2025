import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState({
    doctor: "",
    patient: "",
    date: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка данных врачей и пациентов для фильтров
        const [doctorsRes, patientsRes] = await Promise.all([
          axiosInstance.get("doctors/"),
          axiosInstance.get("patients/"),
        ]);
        setDoctors(doctorsRes.data);
        setPatients(patientsRes.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных для фильтров:", error);
      }
    };

    fetchData();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.doctor) params.doctor = filter.doctor;
      if (filter.patient) params.patient = filter.patient;
      if (filter.date) params.date = filter.date;

      const res = await axiosInstance.get("payments/", { params });

      // Форматирование данных для отображения
      const formattedPayments = res.data.map((payment) => ({
        id: payment.payment_id,
        date: new Date(payment.payment_date).toLocaleDateString(),
        amount: payment.payment_amount,
        method: payment.payment_method,
        visitId: payment.visit,
        isSuccessful: payment.is_successful,
      }));

      setPayments(formattedPayments);
    } catch (error) {
      console.error("Ошибка при загрузке списка оплат:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <h2>Список оплат</h2>

      {/* Фильтры */}
      <Box display="flex" alignItems="center" mb={3}>
        <FormControl fullWidth sx={{ marginRight: 2 }}>
          <InputLabel>Врач</InputLabel>
          <Select
            name="doctor"
            value={filter.doctor}
            onChange={handleFilterChange}
            label="Врач"
          >
            <MenuItem value="">Все</MenuItem>
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.first_name} {doctor.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginRight: 2 }}>
          <InputLabel>Пациент</InputLabel>
          <Select
            name="patient"
            value={filter.patient}
            onChange={handleFilterChange}
            label="Пациент"
          >
            <MenuItem value="">Все</MenuItem>
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Дата"
          name="date"
          type="date"
          value={filter.date}
          onChange={handleFilterChange}
          fullWidth
          sx={{ marginRight: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={fetchPayments}
          sx={{ height: "100%" }}
        >
            Фильтр
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : payments.length > 0 ? (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID визита</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Метод оплаты</TableCell>
                <TableCell>Успешно</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.visitId}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.amount} ₽</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.isSuccessful ? "Да" : "Нет"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>Записи не найдены</p>
      )}
    </Container>
  );
};

export default PaymentsList;
