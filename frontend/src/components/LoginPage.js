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
  CircularProgress // Added loader
} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
// Material UI Icon Imports
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

// Email Validation
const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function Login() {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  //Inputs
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const [rememberMe, setRememberMe] = useState();

  // Inputs Errors
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Overall Form Validity
  const [formValid, setFormValid] = useState();
  const [success, setSuccess] = useState();

  // Loader state
  const [loading, setLoading] = useState(false); // Added loader state

  // Handles Display and Hide Password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Label for Checkbox
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // Validation for onBlur Email
  const handleEmail = () => {
    console.log(isEmail(emailInput));
    if (!isEmail(emailInput)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
  };

  // Validation for onBlur Password
  const handlePassword = () => {
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
    setLoading(true); // Show loader

    //First of all Check for Errors

    // If Email error is true
    if (emailError || !emailInput) {
      setFormValid("Email is Invalid. Please Re-Enter");
      setLoading(false); // Hide loader
      return;
    }

    // If Password error is true
    if (passwordError || !passwordInput) {
      setFormValid(
        "Password is set btw 5 - 20 characters long. Please Re-Enter"
      );
      setLoading(false); // Hide loader
      return;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: emailInput, password:passwordInput })
        });
        if (response.ok) {
            setFormValid(null);
            const data = await response.json();
            console.log(data)
            localStorage.setItem("token",data.token)
            localStorage.setItem("userid",data.user.id)
            
            if (data.user?.isAdmin) {
                navigate('/dashboard');
            } else {
                navigate('/home');
            }
        } else {
            const data = await response.json();
            setErrorMessage(data.msg);
        }
    } catch (error) {
        console.error('Error during login:', error);
        setErrorMessage('An error occurred during login. Please try again later.');
    } finally {
      setLoading(false); // Hide loader
    }

    // Proceed to use the information passed
    console.log("Email : " + emailInput);
    console.log("Password : " + passwordInput);
    console.log("Remember : " + rememberMe);

    //Show Successfull Submittion
    setSuccess("Form Submitted Successfully");
  };

  return (
    <div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
    <div style={{width:"320px",padding:"16px",boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
     <h3>Login</h3>
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

      <div style={{ fontSize: "10px" }}>
        <Checkbox
          {...label}
          size="small"
          onChange={(event) => setRememberMe(event.target.checked)}
        />
        Remember Me
      </div>

      <div style={{ marginTop: "10px" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LoginIcon />}
          onClick={handleSubmit}
        >
          LOGIN
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

      {/* Show loader */}
      {loading && <CircularProgress sx={{ marginTop: "10px" }} />}
      
      <div style={{ marginTop: "7px", fontSize: "10px" }} margin="left">
        <a>Forgot Password</a>
        <br />
        Do you have an account ?{" "}
        <small style={{ textDecoration: "underline", color: "blue" }}>
        <Link to="/register">Sign Up</Link>
        </small>
      </div>
    </div>
    </div>
  );
}

