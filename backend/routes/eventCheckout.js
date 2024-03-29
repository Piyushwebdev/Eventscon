const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.EVENTS_STRIPE_SECRET_KEY);
const Event = require('../models/Event');
const User = require('../models/User');

router.post('/create-checkout-session', async (req, res) => {
    const { eventId, userId } = req.body;

    try {
        // Retrieve event details based on eventId
        const event = await Event.findById(eventId);
        console.log('Retrieved event:', event);

        // Create a new checkout session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: event.eventName,
                            description: event.description,
                        },
                        unit_amount: Math.round(event.eventPrice * 100), // Stripe requires amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success', // Redirect URL after successful payment
            cancel_url: 'http://localhost:3000/cancel', // Redirect URL if payment is canceled
        });

        // Update the user's schema with the details of the registered event
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $push: {
                eventsRegistered: {
                    eventId: event._id,
                    registeredAt: new Date(),
                    isRegistered: true
                }
            }
        });
        console.log('User updated with registered event:', updatedUser);

        // Update the event document with registrant details and increase registeredCount
        const updatedEvent = await Event.findByIdAndUpdate(eventId, {
            $push: {
                registeredBy: {
                    userId: userId
                }
            },
            $inc: { registeredCount: 1 }
        });
        console.log('Event updated with registrant details:', updatedEvent);

        // Send the session ID to the client to redirect to the checkout page
        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
