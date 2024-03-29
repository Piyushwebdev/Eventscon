require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        const { name, email, password, isAdmin } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            isAdmin
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check if user is admin
        // if (!user.isAdmin) {
        //     return res.status(401).json({ msg: 'Unauthorized' });
        // }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    isAdmin:user.isAdmin
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Define route to fetch user data by ID
router.get('/:id', async (req, res) => {
    try {
        // Fetch user data by ID
        const user = await User.findById(req.params.id);

        // If user is not found, return 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If user is found, return user data
        res.status(200).json(user);
    } catch (error) {
        // If an error occurs, return 500 error
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
