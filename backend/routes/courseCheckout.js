require('dotenv').config()
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.COURSE_STRIPE_SECRET_KEY);
const Course = require('../models/Course');
const User = require('../models/User');

router.post('/create-checkout-session', async (req, res) => {
    const { courseId, userId } = req.body;

    try {
        // Retrieve course details based on courseId
        const course = await Course.findById(courseId);
        console.log('Retrieved course:', course);

        // Create a new checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course?.title,
                            description: course?.description,
                        },
                        unit_amount: Math.round(course?.price * 100), // Stripe requires amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success', // Redirect URL after successful payment
            cancel_url: 'http://localhost:3000/cancel', // Redirect URL if payment is canceled
        });

        // Update the user's schema with the details of the purchased course
        await User.findByIdAndUpdate(userId, {
            $push: {
                coursePurchased: {
                    courseId: course._id,
                    purchasedAt: new Date(),
                    isPurchased: true
                }
            }
        });

        // Update the course document with purchaser details and increase purchasedCount
        await Course.findByIdAndUpdate(courseId, {
            $push: {
                purchasedBy: {
                    userId: userId
                }
            },
            $inc: { purchasedCount: 1 },
            $set: { lastUpdated: new Date() } // Update lastUpdated field
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
