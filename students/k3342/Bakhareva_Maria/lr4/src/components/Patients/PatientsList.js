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

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    phone_number: "",
    email: "",
  });

  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get("patients/");
      setPatients(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке пациентов:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (selectedPatient) {
        await axiosInstance.put(`patients/${selectedPatient.patient_id}/`, formData);
      } else {
        await axiosInstance.post("patients/", formData);
      }
      fetchPatients();
      setIsModalOpen(false);
      setSelectedPatient(null);
      setFormData({
        first_name: "",
        last_name: "",
        birth_date: "",
        phone_number: "",
        email: "",
      });
    } catch (error) {
      console.error("Ошибка при сохранении пациента:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`patients/${id}/`);
      fetchPatients();
    } catch (error) {
      console.error("Ошибка при удалении пациента:", error);
    }
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      birth_date: patient.birth_date,
      phone_number: patient.phone_number,
      email: patient.email,
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedPatient(null);
    setFormData({
      first_name: "",
      last_name: "",
      birth_date: "",
      phone_number: "",
      email: "",
    });
    setIsModalOpen(true);
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
      <Container>
        <h2>Список пациентов</h2>

        <Box display="flex" alignItems="center" mb={3}>
          <TextField
              label="Поиск по имени или фамилии"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{flexGrow: 1, marginRight: 2}}
          />
          <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon/>}
              onClick={openAddModal}
          >
            Добавить пациента
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>Дата рождения</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                  <TableRow key={patient.patient_id}>
                    <TableCell>{patient.first_name}</TableCell>
                    <TableCell>{patient.last_name}</TableCell>
                    <TableCell>{patient.birth_date}</TableCell>
                    <TableCell>{patient.phone_number}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      <IconButton
                          color="primary"
                          onClick={() => openEditModal(patient)}
                      >
                        <EditIcon/>
                      </IconButton>
                      <IconButton
                          color="error"
                          onClick={() => handleDelete(patient.patient_id)}
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
            {selectedPatient ? "Редактировать пациента" : "Добавить пациента"}
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
                label="Дата рождения"
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputLabelProps={{shrink: true}}
            />
            <TextField
                label="Телефон"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
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
      </Container>
  );
};

export default PatientsList;
