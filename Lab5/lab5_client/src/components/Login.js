import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/login', { username, password });

            const token = response.data.token;
            const exp = response.data.exp;
            Cookies.set('token', token, { expires: new Date(exp * 1000) });

            console.log("Обробка вдалого входу");
            navigate("/user");
        } catch (error) {
            console.log("Обробка помилки входу");
        }
    };

    const isTokenValid = async (token) => {
        try {
            const response = await axios.post('/verify-token', { token });

            if (response.data.isValid) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token && isTokenValid(token)) {
            console.log('User is already authenticated.');
            navigate("/user");
        }
    }, []);

    return (
        <div className='myForm'>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <Link to="/register">Don't have an account? Register here.</Link>
        </div>
    );
}

export default Login;
