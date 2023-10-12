import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        navigate("/login");
    };

    return (
        <header>
            <h1>My App</h1>
            <button onClick={() => {navigate("/login");}}>Login</button>
            <button onClick={() => {navigate("/user");}}>User</button>
            <button onClick={() => {navigate("/users");}}>Users</button>
            <button onClick={handleLogout}>Logout</button>
        </header>
    );
};

export default Header;