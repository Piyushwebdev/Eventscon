const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    coursePurchased: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        purchasedAt: {
            type: Date,
            default: Date.now
        },
        isPurchased: {
            type: Boolean,
            default: true
        },
        // You can add more fields specific to each purchase, such as price, transactionId, etc.
    }],
    eventsRegistered: [{
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        isPurchased: {
            type: Boolean,
            default: true
        },
        // You can add more fields specific to each registration, such as registrationStatus, paymentStatus, etc.
    }],
    // Add more fields as needed
});

module.exports = mongoose.model('User', userSchema);
