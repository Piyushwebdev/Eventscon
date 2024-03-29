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
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import GroupIcon from "@mui/icons-material/Group";
const stripePromise = loadStripe(process.env.REACT_APP_COURSE_STRIPE_KEY);

const CourseCard = ({ course, userId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCoursePurchased, setIsCoursePurchased] = useState(false);

  useEffect(() => {
    const checkCoursePurchased = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PRODUCTION_URL}/api/auth/${userId}`
        );
        if (response.status === 200) {
          const userData = response.data;
          const purchasedCoursesIds = userData?.coursePurchased?.map(
            (p) => p.courseId
          );
          setIsCoursePurchased(purchasedCoursesIds.includes(course._id));
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      checkCoursePurchased();
    }
  }, [userId, course._id]);

  const handleClickBuy = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsProcessing(true);

    try {
      const stripe = await stripePromise;
      const courseId = course?._id;
      const response = await axios.post(
        `${process.env.REACT_APP_PRODUCTION_URL}/api/courses/create-checkout-session`,
        {
          courseId,
          userId,
        }
      );

      if (!response.data) {
        throw new Error("Failed to create checkout session");
      }

      const session = response.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        throw new Error("Error redirecting to Checkout");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: "none" }}>
      <Card sx={{ height: "370px", margin: "8px", position: "relative" }}>
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
            image={course.image}
            alt={course.title}
          />
          <CardContent sx={{ flex: "1" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ lineHeight: "1.2", maxHeight: "80px", overflow: "hidden" }}
            >
              {course.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.teacherName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.language}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{display:"flex",alignItems:"center",gap:"5px"}}>
              Purchased by: {course.purchasedCount} <GroupIcon />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated on: {new Date(course.lastUpdated).toLocaleDateString()}
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
              Price: ${course.price}
            </Typography>
            <Button
              onClick={handleClickBuy}
              variant="contained"
              color="primary"
              disabled={isProcessing || isCoursePurchased}
            >
              {isProcessing
                ? "Processing..."
                : isCoursePurchased
                ? "Purchased"
                : "Buy"}
            </Button>
          </Box>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default CourseCard;
