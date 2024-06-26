import React, { useState } from "react";

// Material UI Imports
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Input,
  Checkbox,
  Alert,
  Stack,
} from "@mui/material";

// Material UI Icon Imports
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

import { useNavigate, Link } from 'react-router-dom';

// Validations
// Email Validation
const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function Register() {
  const [role, setRole] = useState('user');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  //Inputs
  const [usernameInput, setUsernameInput] = useState();
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();

  // Inputs Errors
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Overall Form Validity
  const [formValid, setFormValid] = useState();
  const [success, setSuccess] = useState();

  // Handles Display and Hide Password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Validation for onBlur Username
  const handleUsername = () => {
    if (!usernameInput) {
      setUsernameError(true);
      return;
    }

    setUsernameError(false);
  };

  // Validation for onBlur Email
  const handleEmail = () => {
    if (!isEmail(emailInput)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
  };

  // Validation for onBlur Password
  const handlePassword =  () => {
    if (
      !passwordInput ||
      passwordInput.length < 5 ||
      passwordInput.length > 20
    ) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
  };

  //handle Submittion
const handleSubmit = async () => {
  setSuccess(null);
  //First of all Check for Errors

  // IF username error is true
  if (usernameError || !usernameInput) {
    setFormValid(
      "Username is set between 5 - 15 characters long. Please Re-Enter"
    );
    return;
  }

  // If Email error is true
  if (emailError || !emailInput) {
    setFormValid("Email is Invalid. Please Re-Enter");
    return;
  }

  // If Password error is true
  if (passwordError || !passwordInput) {
    setFormValid(
      "Password is set between 5 - 20 characters long. Please Re-Enter"
    );
    return;
  }
  try {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name:usernameInput, email:emailInput, password:passwordInput, isAdmin:role==="user"?false:true }),
      });
      const data = await response.json();
      if (response.ok) {
          setFormValid(null);
          setSuccess("Form Submitted Successfully");
          setTimeout(() => {
            navigate('/');
          }, 3000); // Navigate after 3 seconds
      } else {
          if (data.msg) {
            setErrorMessage(data.msg);
          } else {
            setErrorMessage(data.message || 'Registration failed.');
          }
      }
  } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('An error occurred. Please try again later.');
  }

  // Proceed to use the information passed
  console.log("Username : " + usernameInput);
  console.log("Email : " + emailInput);
  console.log("Password : " + passwordInput);
};


  return (
    <div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      <div style={{width:"320px",padding:"16px",boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
        <h2>Register</h2>
        <div>
          <label>
            <input
              type="radio"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            Admin
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <TextField
            error={usernameError}
            label="Username"
            id="standard-basic"
            variant="standard"
            sx={{ width: "100%" }}
            size="small"
            value={usernameInput}
            InputProps={{}}
            onChange={(event) => {
              setUsernameInput(event.target.value);
            }}
            onBlur={handleUsername}
          />
        </div>

        <div style={{ marginTop: "5px" }}>
          <TextField
            label="Email Address"
            fullWidth
            error={emailError}
            id="standard-basic"
            variant="standard"
            sx={{ width: "100%" }}
            value={emailInput}
            InputProps={{}}
            size="small"
            onBlur={handleEmail}
            onChange={(event) => {
              setEmailInput(event.target.value);
            }}
          />
        </div>
        <div style={{ marginTop: "5px" }}>
          <FormControl sx={{ width: "100%" }} variant="standard">
            <InputLabel
              error={passwordError}
              htmlFor="standard-adornment-password"
            >
              Password
            </InputLabel>
            <Input
              error={passwordError}
              onBlur={handlePassword}
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              onChange={(event) => {
                setPasswordInput(event.target.value);
              }}
              value={passwordInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>

        <div style={{ marginTop: "10px" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={handleSubmit}
          >
            REGISTER        
            </Button>
        </div>

        {/* Show Form Error if any */}
        {formValid && (
          <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
            <Alert severity="error" size="small">
              {formValid}
            </Alert>
          </Stack>
        )}

        {/* Show Success if no issues */}
        {success && (
          <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
            <Alert severity="success" size="small">
              {success}
            </Alert>
          </Stack>
        )}

        <div style={{ marginTop: "7px", fontSize: "10px" }} margin="left">
          <a>Forgot Password</a>
          <br />
          Do you have an account ?{" "}
          <small style={{ textDecoration: "underline", color: "blue" }}>
            <Link to="/">Login</Link>
          </small>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}
