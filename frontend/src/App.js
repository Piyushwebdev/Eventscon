import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import ProfilePage from "./components/ProfilePage";
import CourseDetails from "./components/CourseDetails";
import Success from './components/Success';
import Cancel from "./components/Cancel"

function App() {
  return (
    <Routes>
      <Route exact path="/home" element={<LandingPage/>} />
      <Route path="/" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/dashboard" element={<DashboardPage/>} />
      <Route path="/courses/:id" element={<CourseDetails/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/success" element={<Success/>} />
      <Route path="/cancel" element={<Cancel/>} />
    </Routes>
  );
}

export default App;
