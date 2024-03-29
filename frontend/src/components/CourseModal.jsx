import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const CourseModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    teacherName: "",
    price: "",
    description: "",
    // Add more fields here
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        {/* Add other fields as needed */}
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
};

export default CourseModal;
