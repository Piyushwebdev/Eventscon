import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ButtonAppBar from "./ButtonAppBar";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OuxDqSDZV9vUDWBMSVWk5zjPqqZnT06t5ExM9xNCEZZYypyTfllV212ztXer2INKJNdFzoQacHaXfJLeQ0yrJEQ000G1oNIaJ"
);

const CourseDetails = () => {
  const { id } = useParams(); // Get the course ID from the URL parameter
  const [course, setCourse] = useState(null); // State to store the course details
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCoursePurchased, setIsCoursePurchased] = useState(false);
  useEffect(() => {
    const userid = localStorage.getItem("userid");
    setUserId(userid);
    if (userid) {
      // Check if the course is already purchased by the user
      axios
        .get(`${process.env.REACT_APP_PRODUCTION_URL}/api/auth/${userid}`)
        .then((response) => {
          const userData = response.data;
          const purchasedCoursesIds = userData.coursePurchased.map(
            (p) => p.courseId
          );
          setIsCoursePurchased(purchasedCoursesIds.includes(id));
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [id]);

  useEffect(() => {
    const userid=localStorage.getItem("userid")
    console.log(userid)
    setUserId(userid);
  }, []);

  useEffect(() => {
    // Fetch course details based on the ID from the API
    fetch(`${process.env.REACT_APP_PRODUCTION_URL}/api/courses/${id}`)
      .then((response) => response.json())
      .then((data) => setCourse(data))
      .catch((error) => console.error("Error fetching course details:", error));
  }, [id]);

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

  if (!course) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <>
      <ButtonAppBar />
      <Box sx={{ margin: "50px" }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Grid container spacing={5} sx={{ paddingInline: "10%" }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={course.image} // Assuming you have an image field in the course object
              alt={course.title}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Teacher: {course.teacherName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Price: ${course.price}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Posted/Last Updated:{" "}
                {new Date(course.lastUpdated).toLocaleDateString()}{" "}
                {/* Assuming you have a lastUpdated field */}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Language: {course.language}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Duration: {course.duration}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Exercises: {course.exercises}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Articles: {course.articles}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Certification: {course.certification ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Access on Mobile & TV:{" "}
                {course.accessOnMobileAndTV ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Description: {course.description}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default CourseDetails;
