const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const dataPath = path.join(__dirname, 'data', 'users.json');

app.use(express.json());

// Helper function to read JSON data
const readData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

// Helper function to write JSON data
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Create a new user
app.post('/users', (req, res) => {
    const users = readData();
    const newUser = {
        id: users.length + 1,
        ...req.body
    };
    users.push(newUser);
    writeData(users);
    res.status(201).json(newUser);
});

// Get all users
app.get('/users', (req, res) => {
    const users = readData();
    res.json(users);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const users = readData();
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// Update user by ID
app.put('/users/:id', (req, res) => {
    const users = readData();
    const userIndex = users.findIndex(u => u.id == req.params.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    users[userIndex] = { id: users[userIndex].id, ...req.body };
    writeData(users);
    res.json(users[userIndex]);
});

// Delete user by ID
app.delete('/users/:id', (req, res) => {
    const users = readData();
    const newUsers = users.filter(u => u.id != req.params.id);
    if (users.length === newUsers.length) return res.status(404).json({ message: 'User not found' });

    writeData(newUsers);
    res.json({ message: 'User deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
