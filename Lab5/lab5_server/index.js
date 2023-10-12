const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const PORT = 3010;
const SECRET_KEY = 'My_super_secret_key';
const EXPIRE_TIME = '60m';

app.use(bodyParser.json());

const uri = "mongodb+srv://nazarkharchuk:F1WkRfXpWPnBzhhb@cluster0.rafwxex.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

const hashPassword = (password, salt) => {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash;
};

const verifyPassword = (password, savedSalt, savedHashedPassword) => {
    const hash = hashPassword(password, savedSalt);
    return hash === savedHashedPassword;
};

client.connect()
    .then(() => {
        const db = client.db('database');
        const usersCollection = db.collection('users');

        const authMiddleware = async (req, res, next) => {
            const token = req.headers['authorization'];

            if (!token || token === 'undefined') {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            try {
                const decodedToken = jwt.verify(token, SECRET_KEY);

                if (!decodedToken) {
                    return res.status(401).json({ error: 'Invalid token' });
                }

                req.username = decodedToken.username;
                req.role = decodedToken.role;

                next();
            } catch (error) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        };

        app.post('/api/login', async (req, res) => {
            const { username, password } = req.body;

            const user = await usersCollection.findOne({ username });

            if (!user || !verifyPassword(password, user.salt, user.password)) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            const payload = {
                username: user.username,
                role: user.role,
            };

            const jwt_token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRE_TIME });

            res.json({ username: user.username, role: user.role, token: jwt_token, exp: EXPIRE_TIME });
        });

        app.post('/api/register', async (req, res) => {
            const { username, password, fullName, group, phone, address, email } = req.body;
            const salt = generateSalt();
            const hashedPassword = hashPassword(password, salt);


            const existingUser = await usersCollection.findOne({ username });

            if (existingUser) {
                return res.status(400).json({ message: 'Користувач з таким ім\'ям вже існує' });
            }

            const newUser = {
                username,
                password: hashedPassword,
                salt,
                fullName,
                group,
                phone,
                address,
                email,
                role: 'user'
            };
            await usersCollection.insertOne(newUser);
            res.status(201).json({ message: 'Користувач створений' });

        });

        app.get('/api/user', authMiddleware, async (req, res) => {
            const user = await usersCollection.findOne({ username: req.username });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userWithoutPasswords = {
                username: user.username,
                role: user.role,
                fullName: user.fullName,
                group: user.group,
                phone: user.phone,
                address: user.address,
                email: user.email,
            };

            res.json(userWithoutPasswords);
        });

        app.get('/api/users', authMiddleware, async (req, res) => {
            if (req.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ заборонено' });
            }

            const userList = await usersCollection.find({}, { projection: { password: 0, salt: 0, fullName: 0, group: 0, phone: 0, address: 0, email: 0 } }).toArray();
            res.json(userList);
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
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });