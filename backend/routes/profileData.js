// routes/auth.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require("../models/User")
// Fetch registered events for a user with details
router.get('/registered-events', auth, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the authentication middleware

        // Fetch user data by ID with populated events
        const user = await User.findById(userId).populate({
            path: 'eventsRegistered.eventId',
            model: 'Event'
        });

        // If user is not found, return 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If user is found, return registered events with details
        res.status(200).json(user.eventsRegistered);
    } catch (error) {
        // If an error occurs, return 500 error
        console.error('Error fetching registered events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch purchased courses for a user with details
router.get('/purchased-courses', auth, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the authentication middleware

        // Fetch user data by ID with populated courses
        const user = await User.findById(userId).populate({
            path: 'coursePurchased.courseId',
            model: 'Course'
        });

        // If user is not found, return 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If user is found, return purchased courses with details
        res.status(200).json(user.coursePurchased);
    } catch (error) {
        // If an error occurs, return 500 error
        console.error('Error fetching purchased courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
