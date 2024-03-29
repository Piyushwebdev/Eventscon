import React, { useState, useEffect } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import GroupIcon from "@mui/icons-material/Group";

const stripePromise = loadStripe(process.env.REACT_APP_EVENT_STRIPE_KEY);

const EventCard = ({ event, userId }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEventRegistered, setIsEventRegistered] = useState(false);

    useEffect(() => {
        // Check if the user has already registered for the event
        const checkEventRegistration = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/auth/${userId}`);
                if (response.status === 200) {
                    const userData = response.data;
                    const registeredEventsIds = userData?.eventsRegistered?.map(e => e.eventId);
                    setIsEventRegistered(registeredEventsIds.includes(event._id));
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userId) {
            checkEventRegistration();
        }
    }, [userId, event._id]);

    const handleClickRegister = async () => {
        setIsProcessing(true);
    
        try {
            const stripe = await stripePromise;
            const eventId = event?._id;
            const response = await axios.post(`${process.env.REACT_APP_PRODUCTION_URL}/api/events/create-checkout-session`, {
                eventId,
                userId,
            });
    
            if (!response.data.sessionId) {
                throw new Error('Failed to create checkout session');
            }
    
            const { sessionId } = response.data;
            const result = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });
            if (result.error) {
                throw new Error('Error redirecting to Checkout');
            }
        } catch (error) {
            console.error('Error:', error);
            setIsProcessing(false);
        }
    };
    

    return (
        <Card sx={{ height: '450px', display: 'flex', flexDirection: 'column', position: 'relative', margin: '8px' }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="200px"
                    image={event.image}
                    alt={event.eventName}
                />
                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" component="div" sx={{ lineHeight: '1.2', maxHeight: '60px', overflow: 'hidden' }}>
                        {event.eventName}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        {new Date(event.eventDate).toLocaleDateString()} | {event.eventTime}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Location: {event.eventLocation}
                    </Typography>
                    {/* <Typography variant="subtitle1" color="text.secondary" sx={{display:"flex",alignItems:"center",gap:"5px"}}>
                        Registered by: {event.purchasedCount} <GroupIcon />
                    </Typography> */}
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px', lineHeight: '1.2', maxHeight: '60px', overflow: 'hidden' }}>
                        {event.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <Box sx={{ position: 'absolute', bottom: '20px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" color="text.primary">
                    Price: ${event.eventPrice}
                </Typography>
                <Button onClick={handleClickRegister} variant="contained" color="primary" disabled={isProcessing || isEventRegistered}>
                    {isProcessing ? 'Processing...' : isEventRegistered ? 'Registered' : 'Register'}
                </Button>
            </Box>
        </Card>
    );
};

export default EventCard;
