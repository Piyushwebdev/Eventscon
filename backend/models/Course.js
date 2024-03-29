const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
      },
    title: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    language: String,
    duration: String,
    exercises: Number,
    articles: Number,
    certification: {
        type: Boolean,
        default: false
    },
    accessOnMobileAndTV: {
        type: Boolean,
        default: false
    },
    purchasedBy: [{  
        userId: String
    }],
    purchasedCount: {
        type: Number,
        default: 0
    }
    // Add more fields as needed
});

module.exports = mongoose.model('Course', courseSchema);
