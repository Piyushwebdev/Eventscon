import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

const DashboardCourseCard = ({ course, onCourseEdit, onCourseDelete }) => {
  return (
    <Card sx={{ height: "570px", margin: "8px", position: "relative" }}>
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
        <Typography variant="body2" color="text.secondary">
          Posted: {new Date(course.lastUpdated).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
        Description: {course.description}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Language: {course.language}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Duration: {course.duration}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Exercises: {course.exercises}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Articles: {course.articles}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Certification: {course.certification ? 'Yes' : 'No'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Access on Mobile & TV: {course.accessOnMobileAndTV ? 'Yes' : 'No'}
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
        <Box>
          <Button
            onClick={() => onCourseEdit(course._id)}
            variant="outlined"
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          <Button
            onClick={() => onCourseDelete(course._id)}
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

export default DashboardCourseCard;
