import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Pagination, Tabs, Tab } from "@mui/material";
import CourseCard from "./CourseCard"; // Assuming you have a CourseCard component
import EventCard from "./EventCard";
import ButtonAppBar from "./ButtonAppBar";

const ProfilePage = () => {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4); // 6 cards per page
  const [selectedTab, setSelectedTab] = useState("courses"); // Default selected tab is courses

  useEffect(() => {
    // Fetch courses data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PRODUCTION_URL}/api/courses?page=${page}&pageSize=${pageSize}`
        );
        setRegisteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    // Fetch purchased courses
    axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/profile/purchased-courses`, {
      headers: {
        'x-auth-token': localStorage.getItem('token') // Assuming token is stored in localStorage
      }
    })
    .then(response => {
      setRegisteredCourses(response.data);
    })
    .catch(error => {
      console.error('Error fetching purchased courses:', error);
    });

    // Fetch registered events
    axios.get(`${process.env.REACT_APP_PRODUCTION_URL}/api/profile/registered-events`, {
      headers: {
        'x-auth-token': localStorage.getItem('token') // Assuming token is stored in localStorage
      }
    })
    .then(response => {
      setRegisteredEvents(response.data);
    })
    .catch(error => {
      console.error('Error fetching registered events:', error);
    });
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div>
      <ButtonAppBar />
      <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{marginBottom:"2rem"}}>
        <Tab label="Registered courses" value="courses" />
        <Tab label="Registered events" value="events" />
      </Tabs>
      <Container>
      {selectedTab === "courses" ? (
        <Grid container spacing={3}>
          {registeredCourses.map((course) => (
            <Grid key={course.id} item xs={12} sm={6} md={4} lg={3}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
        ):
        <Grid container spacing={3}>
        {registeredEvents.map((event) => (
          <Grid key={event.id} item xs={12} sm={6} md={4} lg={3}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
        }
        <Pagination
          count={3} // Assuming there are 10 pages, you should replace this with the actual count
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          size="large"
          sx={{ mt: 3, justifyContent: "center" }}
        />
      </Container>
    </div>
  );
};

export default ProfilePage;
