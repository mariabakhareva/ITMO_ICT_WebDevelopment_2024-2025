import React from "react";
import { useNavigate } from "react-router-dom";
import TokenStore from "../../services/TokenStore";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        TokenStore.clearToken();
        navigate("/login");
    };

    return <button onClick={handleLogout}>Выйти</button>;
};

export default Logout;
