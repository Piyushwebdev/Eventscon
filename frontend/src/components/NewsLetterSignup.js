import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import axios from "axios"

const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/subscribe', { email });
            setSubscribed(true);
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    };

    return (
        <Box p={4} display="flex" alignItems="center" justifyContent="center">
            <Grid container alignItems="center" justifyContent="center">
                {subscribed ? (
                    <Grid item xs={12} sm={8} md={6} lg={4}>
                        <Typography variant="h6" align="center">Thank you for subscribing!</Typography>
                    </Grid>
                ) : (
                    <Grid item xs={12} sm={8} md={6} lg={4}>
                        <form onSubmit={handleSubmit} style={{ backgroundColor:"#F7F9FA", padding:"24px", boxShadow:"rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset" }}>
                            <Typography variant="subtitle1" align="center" sx={{ marginBottom: '16px' }}>Subscribe to get notifications</Typography>
                            <TextField
                                size='small'
                                type="email" 
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={handleEmailChange}
                                fullWidth
                                sx={{ marginBottom: '16px' }}
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Subscribe
                            </Button>
                        </form>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default NewsletterSignup;
