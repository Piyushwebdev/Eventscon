import React, { useEffect } from "react";
import { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Tab,
  Tabs,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardCourseCard from "./DashboardCourseCard";
import DashboardEventCard from "./DashboardEventCard";
const DashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState("courses"); // Default selected tab is courses
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [events, setEvents] = useState([]);
  const [isloggedIn, setIsLoggedIn] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalType, setModalType] = useState("");
  const [courseStats, setCourseStats] = useState({});
  const [eventStats, setEventStats] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem !== "") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn("");
    }
  }, []);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PRODUCTION_URL}/api/courses/`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
        console.log(data);
      } else {
        console.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_PRODUCTION_URL}/api/events/`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const fetchCourseStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PRODUCTION_URL}/api/courses/sales/stats`
      );
      if (response.ok) {
        const data = await response.json();
        setCourseStats(data);
      } else {
        console.error("Failed to fetch course stats");
      }
    } catch (error) {
      console.error("Error fetching course stats:", error);
    }
  };
  const fetchEventStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PRODUCTION_URL}/api/events/registration/stats`
      );
      if (response.ok) {
        const data = await response.json();
        setEventStats(data);
      } else {
        console.error("Failed to fetch events stats");
      }
    } catch (error) {
      console.error("Error fetching events stats:", error);
    }
  };

  useEffect(() => {
    fetchEventStats();
    fetchCourseStats();
    fetchCourses();
    fetchEvents();
  }, []);

  const handleClick = () => {
    if (isloggedIn) {
      localStorage.clear();
      setIsLoggedIn("");
      setIsAdmin("");
      navigate("/");
    } else {
      navigate("/");
    }
  };
  const onEventDelete = async (eventId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PRODUCTION_URL}/api/events/${eventId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // If deletion is successful, trigger the onEventDelete callback
        fetchEvents();
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };
  const onCourseDelete = async (courseId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PRODUCTION_URL}/api/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // If deletion is successful, trigger the onEventDelete callback
        fetchCourses();
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    console.log(modalData);
  }, [modalData]);

  const handleAdd = () => {
    setOpenModal(true);
    setModalType("add");
    setModalData({});
  };

  const handleEdit = (item) => {
    console.log(item);
    setOpenModal(true);
    setModalType("edit");
    setModalData(item);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalSubmit = async () => {
    try {
      let url;
      let method;

      if (selectedTab === "courses") {
        url = `${process.env.REACT_APP_PRODUCTION_URL}/api/courses/`;
      } else {
        url = `${process.env.REACT_APP_PRODUCTION_URL}/api/events/`;
      }

      if (modalType === "edit") {
        url += modalData._id;
        method = "PUT";
      } else {
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modalData),
      });

      if (response.ok) {
        setOpenModal(false);
        fetchCourses();
        fetchEvents();
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginInline: "2rem",
        }}
      >
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Courses" value="courses" />
          <Tab label="Events" value="events" />
          {/* Add additional tabs for events if needed */}
        </Tabs>
        <Box>
          <Button
            sx={{ marginRight: "2rem" }}
            variant="contained"
            onClick={handleAdd}
          >
            {selectedTab === "courses" ? "Add course" : "Add event"}
          </Button>

          <Button color="inherit" variant="outlined" onClick={handleClick}>
            {isloggedIn ? "Logout" : "Login"}
          </Button>
        </Box>
      </Box>
      <Box my={3} sx={{ marginBottom: "5rem" }}>
        {selectedTab === "courses" ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  padding: "2rem",
                  minWidth:"250px",     textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Typography variant="subtitle2">
                  Number of courses sold today
                </Typography>
                <Typography variant="h5">{courseStats.dailySales}</Typography>
              </Box>
              <Box
                sx={{
                  padding: "2rem",
                  minWidth:"250px",     textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Typography variant="subtitle2">
                  Number of courses sold last week
                </Typography>
                <Typography variant="h5">{courseStats.weeklySales}</Typography>
              </Box>
              <Box
                sx={{
                  padding: "2rem",
                  minWidth:"250px",     textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Typography variant="subtitle2">
                  Number of courses sold last month
                </Typography>
                <Typography variant="h5">{courseStats.monthlySales}</Typography>
              </Box>
              <Box
                sx={{
                  padding: "2rem",
                  minWidth:"250px",     textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Typography variant="subtitle2">
                  Number of courses sold last year
                </Typography>
                <Typography variant="h5">{courseStats.yearlySales}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginInline: "5rem",
                marginBlock: "1rem",
                flexWrap: "wrap",
              }}
            >
              {courses.map((course) => (
                <Box key={course._id} sx={{ margin: "0 10px", width: "320px" }}>
                  <DashboardCourseCard
                    course={course}
                    onCourseDelete={() => onCourseDelete(course._id)}
                    onCourseEdit={() => handleEdit(course)}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  padding: "2rem",
                  minWidth:"250px",     textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Typography variant="subtitle2">
                  Number of events registered today
                </Typography>
                <Typography variant="h5">{eventStats.dailyRegistrations}</Typography>
              </Box>
              <Box
                sx={{
                  padding: "2rem",
                  minWidth:"250px",     textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Typography variant="subtitle2">
                  Number of events registered week
                </Typography>
                <Typography variant="h5">{eventStats.weeklyRegistrations}</Typography>
              </Box>
              <Box
                sx={{
                  padding: "2rem",
                  minWidth:"250px",     textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Typography variant="subtitle2">
                  Number of events registered last month
                </Typography>
                <Typography variant="h5">{eventStats.monthlyRegistrations}</Typography>
              </Box>
              <Box
                sx={{
                  padding: "2rem",
                  minWidth:"250px",     textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Typography variant="subtitle2">
                  Number of events registered last year
                </Typography>
                <Typography variant="h5">{eventStats.yearlyRegistrations}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginInline: "5rem",
                marginBlock: "1rem",
                flexWrap: "wrap",
              }}
            >
              {events.map((event) => (
                <Box key={event._id} sx={{ margin: "0 10px", width: "320px" }}>
                  <DashboardEventCard
                    event={event}
                    onEventDelete={() => onEventDelete(event._id)}
                    onEventEdit={() => handleEdit(event)}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
      {/* Modal for adding/editing course/event */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {modalType === "add" ? "Add" : "Edit"}{" "}
            {selectedTab === "courses" ? "Course" : "Event"}
          </Typography>

          {selectedTab === "courses" && (
            <>
              <TextField
                required
                size="small"
                fullWidth
                label="Course title"
                value={modalData.title || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, title: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Course teacher name"
                value={modalData.teacherName || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, teacherName: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Course price"
                type="number"
                value={modalData.price || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, price: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Image Url"
                value={modalData.image || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, image: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Description of course"
                value={modalData.description || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Course language"
                value={modalData.language || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, language: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Duration (in hours)"
                value={modalData.duration || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, duration: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Number of exercises"
                type="number"
                value={modalData.exercises || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, exercises: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Number of articles"
                type="number"
                value={modalData.articles || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, articles: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption text" sx={{ mb: 1 }}>
                  Certification
                </Typography>
                <Switch
                  size="small"
                  checked={modalData.certification || false}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      certification: e.target.checked,
                    })
                  }
                  color="primary"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption text" sx={{ mb: 1 }}>
                  Access On Mobile And TV
                </Typography>
                <Switch
                  size="small"
                  checked={modalData.accessOnMobileAndTV || false}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      accessOnMobileAndTV: e.target.checked,
                    })
                  }
                  sx={{ mb: 2 }}
                />
              </Box>
            </>
          )}
          {selectedTab === "events" && (
            <>
              <TextField
                required
                size="small"
                fullWidth
                label="Event Name"
                value={modalData.eventName || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, eventName: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Image Url"
                value={modalData.image || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, image: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                required
                size="small"
                fullWidth
                label="Event Date"
                type="date"
                value={modalData.eventDate || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, eventDate: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Event Time"
                type="time"
                value={modalData.eventTime || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, eventTime: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Event Location"
                value={modalData.eventLocation || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, eventLocation: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Event Description"
                value={modalData.description || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                required
                size="small"
                fullWidth
                label="Event Price"
                type="number"
                value={modalData.eventPrice || ""}
                onChange={(e) =>
                  setModalData({ ...modalData, eventPrice: e.target.value })
                }
                sx={{ mb: 2 }}
              />
            </>
          )}
          <Button variant="contained" onClick={handleModalSubmit}>
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default DashboardPage;
