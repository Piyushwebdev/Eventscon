import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ButtonAppBar() {
const [isloggedIn,setIsLoggedIn]=useState("");
const [isAdmin,setIsAdmin]=useState("");
const navigate = useNavigate()
useEffect(()=>{
    if(localStorage.getItem !== ""){
        setIsLoggedIn(true)
    }else{
        setIsLoggedIn("")
    }
},[])
const handleClick=()=>{
    if(isloggedIn){
        localStorage.clear()
        setIsLoggedIn("");
        setIsAdmin("");
        navigate("/")
    }else{
        navigate("/")
    }
}
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar> 
          <Typography variant="h6" component="div" sx={{ flexGrow: 30 }}>
             <Link style={{textDecoration:"none",color:"white"}} to="/home">EventCon</Link> 
          </Typography>
          <Typography variant="BODY2" component="div" sx={{ flexGrow: 1 }}>
           <Link style={{textDecoration:"none",color:"white"}} to="/profile">PROFILE</Link> 
          </Typography>
         
          <Button color="inherit" onClick={handleClick}>{isloggedIn?"Logout":"Login"}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
