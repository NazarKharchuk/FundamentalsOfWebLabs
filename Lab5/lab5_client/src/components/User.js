import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function User() {
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState([]);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                if (response.status === 401) {
                    Cookies.remove('token');
                    navigate("/login");
                } else {
                    setUser(response.data);
                }
            } catch (error) {
                if (error.response.status === 401) {
                    console.log("Недоступно неавторизованим користувачам");
                    setIsAuth(false);
                } else {
                    console.log("Невідома помилка");
                }
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            {isAuth === false ? (
                <p>Недоступно неавторизованим користувачам</p>
            ) : (
                <div>
                    <h2>User</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Full Name</th>
                                <th>Group</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                <td>{user.fullName}</td>
                                <td>{user.group}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>{user.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>)}
        </div>
    );
}

export default User;
