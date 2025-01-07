import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TokenStore from "../../services/TokenStore";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/token/token/login/",
        formData
      );
      const token = response.data.auth_token;
      TokenStore.setToken(token); // Сохраняем токен
      onLogin(); // Уведомляем App об успешном входе
      navigate("/home"); // Перенаправляем на Home
    } catch (error) {
      setError(error.response ? error.response.data : "An error occurred.");
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "50px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Вход
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Имя пользователя"
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            variant="outlined"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          {error && (
            <Alert severity="error">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </Alert>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Войти
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default LoginForm;
