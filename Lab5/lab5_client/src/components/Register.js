import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [group, setGroup] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);

    const userNameRegex = /^[A-Za-z\s]{3,50}$/;
    const passwordRegex = /^[A-Za-z\s]{3,50}$/;
    const fullNameRegex = /^[A-ZА-ЯҐІЇЄ][a-zа-яґіїє]+ [A-ZА-ЯҐІЇЄ]\.[A-ZА-ЯҐІЇЄ]\.$/;
    const groupRegex = /^[A-ZА-ЯҐІЇЄ]{2}-[0-9]{2}$/;
    const phoneRegex = /^\(\d{3}\) \d{3} \d{2} \d{2}$/;
    const addressRegex = /^(м|s).[A-Za-zА-Яа-яҐґІіЇїЄє\s]{3,50}$/;
    const emailRegex = /^[A-Za-z]+@[A-Za-z]+\.com$/;

    const validateForm = () => {
        if (
            userNameRegex.test(username) &&
            passwordRegex.test(password) &&
            fullNameRegex.test(fullName) &&
            groupRegex.test(group) &&
            phoneRegex.test(phone) &&
            addressRegex.test(address) &&
            emailRegex.test(email)
        ) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }

        setIsFormValid(true);
    };

    const handleRegister = async () => {
        validateForm();

        if (!isFormValid) {
            return;
        }
        try {
            const response = await axios.post('/api/register', {
                username,
                password,
                fullName,
                group,
                phone,
                address,
                email,
            });
            console.log("Вдала реєстрація");
            navigate("/login");
        } catch (error) {
            console.log("Обробка помилки реєстрації");
        }
    };

    return (
        <div className='myForm'>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                className={`${(userNameRegex.test(username)) ? "greenBG" : "redBG"}`}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                className={`${(passwordRegex.test(password)) ? "greenBG" : "redBG"}`}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                className={`${(fullNameRegex.test(fullName)) ? "greenBG" : "redBG"}`}
                onChange={(e) => setFullName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Group"
                value={group}
                className={`${(groupRegex.test(group)) ? "greenBG" : "redBG"}`}
                onChange={(e) => setGroup(e.target.value)}
            />

            <input
                type="text"
                placeholder="Phone"
                value={phone}
                className={`${(phoneRegex.test(phone)) ? "greenBG" : "redBG"}`}
                onChange={(e) => setPhone(e.target.value)}
            />

            <input
                type="text"
                placeholder="Address"
                value={address}
                className={`${(addressRegex.test(address)) ? "greenBG" : "redBG"}`}
                onChange={(e) => setAddress(e.target.value)}
            />

            <input
                type="text"
                placeholder="Email"
                value={email}
                className={`${(emailRegex.test(email)) ? "greenBG" : "redBG"}`}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;