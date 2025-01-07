import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Box, Typography } from "@mui/material";

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        navigate("/login"); // Переход на страницу логина после выхода
    };

    const goToPatients = () => {
        navigate("/patients"); // Переход на страницу управления пациентами
    };

    const goToDoctors = () => {
        navigate("/doctors"); // Переход на страницу управления врачами
    };

    const goToConsultingRooms = () => {
        navigate("/consulting-rooms"); // Переход на страницу управления кабинетами
    };

    const goToPayments = () => {
        navigate("/payments"); // Переход на страницу управления платежами
    };

    return (
        <>
            <Container maxWidth="md" style={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Добро пожаловать!
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                    <Button variant="contained" color="primary" onClick={goToPatients}>
                        Управление пациентами
                    </Button>
                    <Button variant="contained" color="secondary" onClick={goToDoctors}>
                        Управление врачами
                    </Button>
                    <Button variant="contained" color="success" onClick={goToConsultingRooms}>
                        Управление кабинетами
                    </Button>
                    <Button variant="contained" color="info" onClick={goToPayments}>
                        Управление платежами
                    </Button>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Button variant="outlined" color="error" onClick={handleLogout}>
                        Выйти
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default Home;
