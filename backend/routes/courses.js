const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { getCourseSalesStats } = require('../controllers/courseService');

// Create Course
router.post('/', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create course', details: err.message });
    }
});

// Get All Courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
    }
});

// Get Course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch course', details: err.message });
    }
});

// Update Course
router.put('/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update course', details: err.message });
    }
});

// Delete Course
router.delete('/:id', async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete course', details: err.message });
    }
});


// Route for fetching course sales stats
router.get('/sales/stats', async (req, res) => {
    try {
        const salesStats = await getCourseSalesStats();
        res.json(salesStats);
    } catch (error) {
        console.error('Error fetching course sales stats:', error);
        res.status(500).json({ error: 'Failed to fetch course sales stats' });
    }
});

module.exports = router;
