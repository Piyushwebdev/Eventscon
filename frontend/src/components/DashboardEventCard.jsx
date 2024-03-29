import React, { useState, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

const DashboardEventCard = ({ event, onEventEdit, onEventDelete }) => {
  return (
    <Card sx={{ height: "400px", margin: "8px", position: "relative" }}>
      <CardActionArea
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <CardMedia
          component="img"
          height="140px"
          image={event.image}
          alt={event.eventName}
        />
        <CardContent sx={{ flex: "1" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ lineHeight: "1.2", maxHeight: "80px", overflow: "hidden" }}
          >
            {event.eventName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {new Date(event.eventDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time: {event.eventTime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location: {event.eventLocation}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description: {event.description}{" "}
          </Typography>
        </CardContent>
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            left: "16px",
            right: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" color="text.primary">
            Price: ${event.eventPrice}
          </Typography>
          <Box>
            <Button
              onClick={() => onEventEdit(event._id)}
              variant="outlined"
              sx={{ marginRight: 1 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => onEventDelete(event._id)}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default DashboardEventCard;
