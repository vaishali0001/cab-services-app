const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.registerEmployee = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword,
        });

        await newEmployee.save();

        res.status(201).json({ message: 'Employee registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginEmployee = async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: employee._id }, config.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};