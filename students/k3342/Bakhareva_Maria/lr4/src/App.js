import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PatientsList from "./components/Patients/PatientsList";
import DoctorsList from './components/Doctors/DoctorsList';
import ConsultingRoomList from './components/Rooms/ConsultingRoomsList';
import VisitList from './components/Visits/VisitsList';
import PaymentList from './components/Payments/PaymentsList';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import Home from "./components/Auth/Home";
import TokenStore from './services/TokenStore';
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  // Состояние аутентификации
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const token = TokenStore.getToken();
    setIsAuthenticated(!!token);
  }, []);

  // Функция для обработки логина
  const handleLogin = () => {
    setIsAuthenticated(true); // Устанавливаем состояние аутентификации
  };

  // Функция для обработки логаута
  const handleLogout = () => {
    TokenStore.clearToken(); // Удаляем токен
    setIsAuthenticated(false); // Обновляем состояние
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Страница авторизации */}
          <Route
            path="/login"
            element={<LoginForm onLogin={handleLogin} />}
          />

          {/* Страница регистрации */}
          <Route
            path="/register"
            element={<RegistrationForm />}
          />

          {/* Защищённые маршруты */}
          <Route
            path="/patients"
            element={isAuthenticated ? <PatientsList /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctors"
            element={isAuthenticated ? <DoctorsList /> : <Navigate to="/login" />}
          />
          <Route
            path="/consulting-rooms"
            element={isAuthenticated ? <ConsultingRoomList /> : <Navigate to="/login" />}
          />
          <Route
            path="/visits"
            element={isAuthenticated ? <VisitList /> : <Navigate to="/login" />}
          />
          <Route
            path="/payments"
            element={isAuthenticated ? <PaymentList /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          {/* Редирект на главную страницу, если не авторизован */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/patients" : "/login"} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
