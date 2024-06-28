/* eslint-disable no-unused-vars */
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar
            sx={{
              backgroundColor: "black",
              display: "flex",
              justifyContent: "end",
              gap: "20px",
            }}
          >
            <Button
              color="error"
              variant="contained"
              onClick={() => navigate("/register")}
            >
              SignUp
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="div">
        <img src="event.avif" style={{ backgroundSize: "cover" }}></img>
      </div>
    </div>
  );
}

export default Landing;
