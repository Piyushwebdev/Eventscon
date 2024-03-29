require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const eventRoutes = require("./routes/events");
const courseCheckoutRoutes = require("./routes/courseCheckout"); // Import checkout router
const eventCheckoutRoutes = require("./routes/eventCheckout"); // Import checkout router
// const coursePurchasedRoutes = require('./routes/coursePurchasedStats');
const profileRoutes  = require("./routes/profileData")


app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/courses", courseCheckoutRoutes); // Use checkout router with appropriate route path
app.use("/api/events", eventCheckoutRoutes); // Use checkout router with appropriate route path
// app.use('/api/courses', coursePurchasedRoutes);
app.use('/api/profile',profileRoutes )
// MongoDB connection
mongoose
  .connect(
process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
