const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

// Database Connection
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

module.exports = app;