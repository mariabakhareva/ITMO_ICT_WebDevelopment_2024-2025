import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => navigate("/home")} style={{ textTransform: 'none' }}>
          <Typography variant="h6">
            Медицинское приложение
          </Typography>
        </Button>

        {/* Разделитель для выравнивания кнопок справа */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Кнопки навигации справа */}
        <Button color="inherit" onClick={() => navigate("/patients")}>Пациенты</Button>
        <Button color="inherit" onClick={() => navigate("/doctors")}>Врачи</Button>
        <Button color="inherit" onClick={() => navigate("/visits")}>Визиты</Button>
        <Button color="inherit" onClick={() => navigate("/payments")}>Платежи</Button>
        <Button color="inherit" onClick={() => navigate("/consulting-rooms")}>Кабинеты</Button>
        <Button color="inherit" onClick={() => navigate("/login")}>Выйти</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
