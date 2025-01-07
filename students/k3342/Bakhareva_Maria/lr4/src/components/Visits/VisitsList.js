import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const VisitsList = () => {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    room: "",
    visit_date: "",
    visit_time: "",
    services: [],
    is_paid: false,
  });

  // Fetch all required data
  const fetchData = async () => {
    try {
      const [visitsResponse, patientsResponse, doctorsResponse, roomsResponse, servicesResponse] =
        await Promise.all([
          axiosInstance.get("/visits/"),
          axiosInstance.get("/patients/"),
          axiosInstance.get("/doctors/"),
          axiosInstance.get("/consulting-rooms/"),
          axiosInstance.get("/services/"),
        ]);
      setVisits(visitsResponse.data);
      setPatients(patientsResponse.data);
      setDoctors(doctorsResponse.data);
      setRooms(roomsResponse.data);
      setServices(servicesResponse.data);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceChange = (serviceId) => {
    setFormData((prev) => {
      const services = prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services };
    });
  };

  // Save or update visit
  const handleSave = async () => {
    try {
      if (selectedVisit) {
        await axiosInstance.put(`/visits/${selectedVisit.visit_id}/`, formData);
      } else {
        await axiosInstance.post("/visits/", formData);
      }
      fetchData();
      setIsModalOpen(false);
      setSelectedVisit(null);
      resetForm();
    } catch (error) {
      console.error("Ошибка при сохранении визита:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      patient: "",
      doctor: "",
      room: "",
      visit_date: "",
      visit_time: "",
      services: [],
      is_paid: false,
    });
  };

  // Delete visit
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/visits/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Ошибка при удалении визита:", error);
    }
  };

  // Open edit modal
  const openEditModal = (visit) => {
    setSelectedVisit(visit);
    setFormData({
      patient: visit.patient,
      doctor: visit.doctor,
      room: visit.room,
      visit_date: visit.visit_date,
      visit_time: visit.visit_time,
      services: visit.services,
      is_paid: visit.is_paid,
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setSelectedVisit(null);
    setIsModalOpen(true);
  };

  return (
      <Container>
        <h2>Список визитов</h2>


        <Box display="flex" alignItems="center" mb={3}>
          <Button
              variant="contained"
              color="primary"
              onClick={openAddModal}
              startIcon={<EditIcon/>}
          >
            Записать пациента на визит
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Пациент</TableCell>
                <TableCell>Врач</TableCell>
                <TableCell>Кабинет</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Время</TableCell>
                <TableCell>Стоимость</TableCell>
                <TableCell>Оплачено</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visits.map((visit) => (
                  <TableRow key={visit.visit_id}>
                    <TableCell>
                      {patients.find((p) => p.patient_id === visit.patient)?.first_name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {doctors.find((d) => d.doctor_id === visit.doctor)?.first_name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {rooms.find((r) => r.room_id === visit.room)?.name || "N/A"}
                    </TableCell>
                    <TableCell>{visit.visit_date}</TableCell>
                    <TableCell>{visit.visit_time}</TableCell>
                    <TableCell>
                      {visit.services
                          .map((id) => services.find((s) => s.service_id === id)?.price || 0)
                          .reduce((acc, price) => acc + price, 0)}
                      руб.
                    </TableCell>
                    <TableCell>{visit.is_paid ? "Да" : "Нет"}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => openEditModal(visit)}>
                        <EditIcon/>
                      </IconButton>
                      <IconButton
                          color="error"
                          onClick={() => handleDelete(visit.visit_id)}
                      >
                        <DeleteIcon/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Модальное окно */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth>
          <DialogTitle>
            {selectedVisit ? "Редактировать визит" : "Записать пациента на визит"}
          </DialogTitle>
          <DialogContent>
            <TextField
                label="Пациент"
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                select
                SelectProps={{native: true}}
            >
              <option value="">Выберите пациента</option>
              {patients.map((patient) => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {patient.first_name} {patient.last_name}
                  </option>
              ))}
            </TextField>
            <TextField
                label="Врач"
                name="doctor"
                value={formData.doctor}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                select
                SelectProps={{native: true}}
            >
              <option value="">Выберите врача</option>
              {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.first_name} {doctor.last_name}
                  </option>
              ))}
            </TextField>
            <TextField
                label="Кабинет"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                select
                SelectProps={{native: true}}
            >
              <option value="">Выберите кабинет</option>
              {rooms.map((room) => (
                  <option key={room.room_id} value={room.room_id}>
                    {room.name}
                  </option>
              ))}
            </TextField>
            <TextField
                label="Дата"
                name="visit_date"
                type="date"
                value={formData.visit_date}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputLabelProps={{shrink: true}}
            />
            <TextField
                label="Время"
                name="visit_time"
                type="time"
                value={formData.visit_time}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputLabelProps={{shrink: true}}
            />
            <Box mt={2}>
              <Typography variant="body1">Услуги:</Typography>
              {services.map((service) => (
                  <FormControlLabel
                      key={service.service_id}
                      control={
                        <Checkbox
                            checked={formData.services.includes(service.service_id)}
                            onChange={() => handleServiceChange(service.service_id)}
                        />
                      }
                      label={service.name}
                  />
              ))}
            </Box>
            <FormControlLabel
                control={
                  <Checkbox
                      name="is_paid"
                      checked={formData.is_paid}
                      onChange={handleInputChange}
                  />
                }
                label="Оплачено"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave} variant="contained" color="primary">
              Сохранить
            </Button>
            <Button onClick={() => setIsModalOpen(false)} variant="outlined" color="secondary">
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
};

export default VisitsList;
