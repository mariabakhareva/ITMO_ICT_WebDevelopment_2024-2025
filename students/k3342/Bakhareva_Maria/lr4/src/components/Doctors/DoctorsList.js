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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ScheduleIcon from "@mui/icons-material/AccessTime"; // Add Schedule Icon

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleEditModalOpen, setIsScheduleEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    specialization: "",
    education: "",
    gender: "",
    birth_date: "",
    work_start_date: "",
    work_end_date: "",
  });
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [newScheduleEntry, setNewScheduleEntry] = useState({
    doctor: "",
    work_date: "",
    work_start_time: "",
    work_end_time: "",
  });

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("doctors/");
      setDoctors(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке врачей:", error);
    }
  };

  const fetchDoctorSchedules = async (doctorId) => {
    try {
      const response = await axiosInstance.get("doctor-schedules/");
      const schedules = response.data.filter((schedule) => schedule.doctor === doctorId);
      setDoctorSchedules(schedules);
    } catch (error) {
      console.error("Ошибка при загрузке расписания врача:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (selectedDoctor) {
        await axiosInstance.put(`doctors/${selectedDoctor.doctor_id}/`, formData);
      } else {
        await axiosInstance.post("doctors/", formData);
      }
      fetchDoctors();
      setIsModalOpen(false);
      setSelectedDoctor(null);
      setFormData({
        first_name: "",
        last_name: "",
        specialization: "",
        education: "",
        gender: "",
        birth_date: "",
        work_start_date: "",
        work_end_date: "",
      });
    } catch (error) {
      console.error("Ошибка при сохранении врача:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`doctors/${id}/`);
      fetchDoctors();
    } catch (error) {
      console.error("Ошибка при удалении врача:", error);
    }
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      specialization: doctor.specialization,
      education: doctor.education,
      gender: doctor.gender,
      birth_date: doctor.birth_date,
      work_start_date: doctor.work_start_date,
      work_end_date: doctor.work_end_date,
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedDoctor(null);
    setFormData({
      first_name: "",
      last_name: "",
      specialization: "",
      education: "",
      gender: "",
      birth_date: "",
      work_start_date: "",
      work_end_date: "",
    });
    setIsModalOpen(true);
  };

  const openScheduleEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    fetchDoctorSchedules(doctor.doctor_id);
    setNewScheduleEntry({
      doctor: doctor.doctor_id,
      work_date: "",
      work_start_time: "",
      work_end_time: "",
    });
    setIsScheduleEditModalOpen(true);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.first_name} ${doctor.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Модальное окно для редактирования расписания
  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setNewScheduleEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSchedule = async () => {
    try {
      await axiosInstance.post("doctor-schedules/", newScheduleEntry);
      fetchDoctorSchedules(selectedDoctor.doctor_id); // Re-fetch schedules for the doctor
      setIsScheduleEditModalOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении расписания:", error);
    }
  };

  return (
    <Container>
      <h2>Список врачей</h2>

      <Box display="flex" alignItems="center" mb={3}>
        <TextField
          label="Поиск по имени или фамилии"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, marginRight: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddModal}
        >
          Добавить врача
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Специальность</TableCell>
              <TableCell>Образование</TableCell>
              <TableCell>Пол</TableCell>
              <TableCell>Дата рождения</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.doctor_id}>
                <TableCell>{doctor.first_name}</TableCell>
                <TableCell>{doctor.last_name}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.education}</TableCell>
                <TableCell>{doctor.gender}</TableCell>
                <TableCell>{doctor.birth_date}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => openEditModal(doctor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(doctor.doctor_id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openScheduleEditModal(doctor)}
                    sx={{ ml: 2 }}
                  >
                    <ScheduleIcon /> {/* Schedule button */}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Модальное окно для редактирования врача */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth>
        <DialogTitle>
          {selectedDoctor ? "Редактировать врача" : "Добавить врача"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Имя"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Фамилия"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Специальность"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Образование"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Пол"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Дата рождения"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Дата начала работы"
            name="work_start_date"
            type="date"
            value={formData.work_start_date}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Дата окончания работы"
            name="work_end_date"
            type="date"
            value={formData.work_end_date}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary">
            Сохранить
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="outlined"
            color="secondary"
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно для редактирования расписания */}
      <Dialog open={isScheduleEditModalOpen} onClose={() => setIsScheduleEditModalOpen(false)} fullWidth>
        <DialogTitle>Редактировать расписание</DialogTitle>
        <DialogContent>
          <TextField
            label="Дата работы"
            name="work_date"
            type="date"
            value={newScheduleEntry.work_date}
            onChange={handleScheduleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Время начала"
            name="work_start_time"
            type="time"
            value={newScheduleEntry.work_start_time}
            onChange={handleScheduleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Время окончания"
            name="work_end_time"
            type="time"
            value={newScheduleEntry.work_end_time}
            onChange={handleScheduleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveSchedule} variant="contained" color="primary">
            Сохранить
          </Button>
          <Button
            onClick={() => setIsScheduleEditModalOpen(false)}
            variant="outlined"
            color="secondary"
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorsList;
