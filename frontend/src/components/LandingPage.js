import React, { useState, useRef, useEffect } from "react";
import ButtonAppBar from "./ButtonAppBar";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import CourseCard from "./CourseCard"; // Assuming you have a CourseCard component
import "./LandingPage.css";
import Slider from "react-slick";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventCard from "./EventCard";
import TrustedCompanies from "./TrustedCompanies";
import NewsletterSignup from "./NewsLetterSignup";

const LandingPage = () => {
  const [userId,setUserId]=useState();
  const [selectedTab, setSelectedTab] = useState("courses"); // Default selected tab is courses
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [events, setEvents] = useState([]); // State to store fetched courses
  const sliderRef = useRef(null); // Create a ref for the Slider component
  useEffect(() => {
    // Fetch courses when the component mounts
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST_URL}/api/courses/`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          console.log(data)
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
  useEffect(() => {
    // Fetch courses when the component mounts
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST_URL}/api/events/`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  useEffect(()=>{
   const userid = localStorage.getItem("userid");
   console.log(userid)
   setUserId(userid)
  },[])
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const settings = {
    dots: true, // Show dots navigation
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <ButtonAppBar />
      <Container>
        <Box my={3}>
          <Typography variant="h3" component="h1" gutterBottom>
            Skills that drive you forward
          </Typography>
          <Typography variant="body1" paragraph>
            Technology and the world of work change fast with us, you're faster.
            Get the skills to achieve goals and stay competitive.
          </Typography>
        </Box>
        <TrustedCompanies/>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Courses" value="courses" />
          <Tab label="Events" value="events" />
          {/* Add additional tabs for events if needed */}
        </Tabs>
        <Box my={3} sx={{marginBottom:"5rem"}}>
          {selectedTab === "courses" ? (
            <Box>
              <h2 style={{textAlign:"center"}}>A broad selection of courses</h2>
              <p style={{fontSize:"18px",textAlign:"center",marginBottom:"2rem"}}>Choose from over 210,000 online video courses with new additions published every month</p>
              <Slider {...settings} ref={sliderRef}>
                {courses.map((course) => (
                  <Box key={course._id} sx={{ margin: "0 10px" }}>
                    <CourseCard course={course} userId={userId}/>
                  </Box>
                ))}
              </Slider>
            </Box>
          ):(  <Box>
            <h2 style={{textAlign:"center",marginBottom:"2rem"}}>Our events and tickets</h2>
            <Slider {...settings} ref={sliderRef}>
              {events.map((event) => (
                <Box key={event._id} sx={{ margin: "0 10px" }}>
                  <EventCard event={event} userId={userId}/>
                </Box>
              ))}
            </Slider>
          </Box>)}
        </Box>
      </Container>
      <NewsletterSignup/>
      <footer className="footer">
        <div className="footer__container container">
          <h1 className="footer__title">EventCon</h1>
          <ul className="footer__list">
            <li>
              <a href="#about" className="footer__link">
                About us
              </a>
            </li>

            <li>
              <a href="#skills" className="footer__link">
                Contact us
              </a>
            </li>
            <li>
              <a href="#projects" className="footer__link">
                Policy
              </a>
            </li>
            <li>
              <a href="#qualification" className="footer__link">
                Terms
              </a>
            </li>
          </ul>
          <div className="footer__social">
            <a
              href="#"
              className="footer__social-link facebook"
              target="_blank"
            >
              <i className="bx bxl-facebook"></i>
            </a>
            <a
              href="#"
              className="footer__social-link linkedin"
              target="_blank"
            >
              <i className="bx bxl-linkedin"></i>
            </a>
            <a
              href="#"
              className="footer__social-link instagram"
              target="_blank"
            >
              <i className="bx bxl-instagram"></i>
            </a>
          </div>
          <span className="footer__copy">
            Created By <a href="#">Piyush Jaiswal</a> &copy; | 2024 All rights
            reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
