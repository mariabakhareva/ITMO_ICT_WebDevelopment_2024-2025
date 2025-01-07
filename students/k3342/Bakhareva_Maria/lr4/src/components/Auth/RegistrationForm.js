import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    re_password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/users/", formData);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login"); // Переход на страницу логина
      }, 2000);
    } catch (error) {
      setError(error.response ? error.response.data : "An error occurred.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Регистрация
      </Typography>
      {success ? (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          Регистрация успешна! Проверьте свою почту для активации аккаунта.
          <br />
          Переадресация на страницу входа...
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Имя пользователя"
              name="username"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Пароль"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Подтвердите пароль"
              name="re_password"
              type="password"
              variant="outlined"
              value={formData.re_password}
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
              Зарегистрироваться
            </Button>
          </Box>
        </form>
      )}
    </Container>
  );
};

export default RegistrationForm;
