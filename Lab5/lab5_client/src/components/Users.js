import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Users() {
    const [users, setUsers] = useState([]);
    const token = Cookies.get('token');
    const [access, setAccess] = useState([]);
    const [isAuth, setIsAuth] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                setUsers(response.data);
            } catch (error) {
                if (error.response.status === 403) {
                    console.log("Недостатньо доступу");
                    setAccess(false);
                } else {
                    if (error.response.status === 401) {
                        console.log("Недоступно неавторизованим користувачам");
                        setIsAuth(false);
                    } else {
                        console.log("Невідома помилка");
                    }
                }
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Users</h2>
            {!(access && isAuth) ? (
                !isAuth ? (<p>Недоступно неавторизованим користувачам</p>) : (<p>Недостатньо доступу</p>)
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) ? (
                            users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No users available</td>
                            </tr>
                        )}
                    </tbody>
                </table>)}
        </div>
    );
}

export default Users;
