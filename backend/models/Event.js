// Import necessary modules
const mongoose = require("mongoose");

// Define the schema for the event
const eventSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventPrice: {
    type: Number,
    required: true,
  },
  purchasedBy: [
    {
      username: String,
      userId: String,
    },
  ],
  purchasedCount: {
    type: Number,
    default: 0,
  },
});

// Create the model using the schema
module.exports = mongoose.model("Event", eventSchema);
