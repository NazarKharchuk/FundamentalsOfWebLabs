const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();

const PORT = 3010;
const SECRET_KEY = 'My_super_secret_key';
const EXPIRE_TIME = '60m';

app.use(bodyParser.json());

let users = [];

function saveUsersToFile() {
    fs.writeFile('users.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error('Помилка при збереженні користувачів:', err);
        } else {
        }
    });
}

function loadUsersFromFile() {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Помилка при завантаженні користувачів:', err);
        } else {
            users = JSON.parse(data);
        }
    });
}

loadUsersFromFile();

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token || token === 'undefined') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, SECRET_KEY);

    if (!decodedToken) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.username = decodedToken.username;
    req.role = decodedToken.role;

    next();
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((user) => {
        if (user.username === username && user.password === password) {
            return true;
        }
        return false;
    });

    if (user) {
        const payload = {
            username: user.username,
            role: user.role,
        };

        const jwt_token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRE_TIME });

        res.json({ username: user.username, role: user.role, token: jwt_token, exp: EXPIRE_TIME });
        return;
    }

    res.status(401).json({ message: 'Доступ заборонено' });
});

app.post('/api/register', async (req, res) => {
    const { username, password, fullName, group, phone, address, email } = req.body;

    try {
        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким ім\'ям вже існує' });
        }

        users.push({ username, password, fullName, group, phone, address, email, role: 'user' });
        saveUsersToFile();

        res.status(201).json({ message: 'Користувач створений' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

app.get('/api/user', authMiddleware, (req, res) => {

    const userWithoutPasswords = users.map((user) => ({
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        group: user.group,
        phone: user.phone,
        address: user.address,
        email: user.email,
    })).find((user) => user.username === req.username);

    res.json(userWithoutPasswords);
});

app.get('/api/users', authMiddleware, (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ заборонено' });
    }

    const userWithoutPasswords = users.map((user) => ({
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        group: user.group,
        phone: user.phone,
        address: user.address,
        email: user.email,
    }));
    res.json(userWithoutPasswords);
});

app.post('/verify-token', (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        res.json({ isValid: true, decodedData: decoded });
    } catch (error) {
        res.json({ isValid: false, error: 'Недійсний токен або помилка перевірки' });
    }
});

/*app.put('/api/users/:username', authMiddleware, (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ заборонено' });
    }

    const { username } = req.params;
    const { newUsername } = req.body;

    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(404).json({ error: 'Користувач не знайдений' });
    }

    user.username = newUsername;
    saveUsersToFile();

    res.json({ message: 'Логін користувача оновлено', user: user });
});*/

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
