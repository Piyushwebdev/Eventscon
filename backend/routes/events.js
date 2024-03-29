const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { getEventRegistrationStats } = require('../controllers/eventsService');

// Create Event
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create event', details: err.message });
    }
});

// Get All Events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events', details: err.message });
    }
});

// Get Event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch event', details: err.message });
    }
});

// Update Event
router.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event', details: err.message });
    }
});

// Delete Event
router.delete('/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully', event: deletedEvent });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event', details: err.message });
    }
});

// Route for fetching event registration stats
router.get('/registration/stats', async (req, res) => {
    try {
        const registrationStats = await getEventRegistrationStats();
        res.json(registrationStats);
    } catch (error) {
        console.error('Error fetching event registration stats:', error);
        res.status(500).json({ error: 'Failed to fetch event registration stats' });
    }
});

module.exports = router;
