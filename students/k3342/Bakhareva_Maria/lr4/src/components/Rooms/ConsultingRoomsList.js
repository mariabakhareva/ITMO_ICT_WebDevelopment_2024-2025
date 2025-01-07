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
  IconButton,
  Box,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const ConsultingRoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    room_number: "",
    work_date: "",
    work_start_time: "",
    work_end_time: "",
    responsible_doctor: "",
  });

  // Fetch rooms data
  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("consulting-rooms/");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (selectedRoom) {
        await axiosInstance.put(`consulting-rooms/${selectedRoom.room_id}/`, formData);
      } else {
        await axiosInstance.post("consulting-rooms/", formData);
      }
      fetchRooms();
      setIsModalOpen(false);
      setSelectedRoom(null);
      setFormData({
        room_number: "",
        work_date: "",
        work_start_time: "",
        work_end_time: "",
        responsible_doctor: "",
      });
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`consulting-rooms/${id}/`);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setFormData({
      room_number: room.room_number,
      work_date: room.work_date,
      work_start_time: room.work_start_time,
      work_end_time: room.work_end_time,
      responsible_doctor: room.responsible_doctor,
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedRoom(null);
    setFormData({
      room_number: "",
      work_date: "",
      work_start_time: "",
      work_end_time: "",
      responsible_doctor: "",
    });
    setIsModalOpen(true);
  };

  const filteredRooms = rooms.filter((room) =>
    `${room.room_number}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <h2>Список кабинетов</h2>

      <Box display="flex" alignItems="center" mb={3}>
        <TextField
          label="Поиск по номеру кабинета"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ flexGrow: 1, marginRight: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={openAddModal}
          startIcon={<Add />}
        >
          Добавить кабинет
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер кабинета</TableCell>
              <TableCell>Дата работы</TableCell>
              <TableCell>Время работы</TableCell>
              <TableCell>Ответственный врач</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.room_id}>
                <TableCell>{room.room_number}</TableCell>
                <TableCell>{room.work_date}</TableCell>
                <TableCell>
                  {room.work_start_time} - {room.work_end_time}
                </TableCell>
                <TableCell>{room.responsible_doctor}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => openEditModal(room)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(room.room_id)}
                    style={{ marginLeft: "10px" }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Add/Edit Room */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth>
        <DialogTitle>
          {selectedRoom ? "Редактировать кабинет" : "Добавить кабинет"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Номер кабинета"
                name="room_number"
                value={formData.room_number}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Дата работы"
                name="work_date"
                type="date"
                value={formData.work_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Время работы с"
                name="work_start_time"
                type="time"
                value={formData.work_start_time}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Время работы до"
                name="work_end_time"
                type="time"
                value={formData.work_end_time}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ответственный врач"
                name="responsible_doctor"
                value={formData.responsible_doctor}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            Сохранить
          </Button>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultingRoomsList;
