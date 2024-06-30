/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import Paper from "@mui/material/Paper";
import { Button, Container, Typography } from "@mui/material";
import { Image } from "antd";
import PlaceIcon from "@mui/icons-material/Place";
import SettingsIcon from "@mui/icons-material/Settings";
import MailIcon from "@mui/icons-material/Mail";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function SingleDj() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { singleDj, setSingleDj } = useContext(AppContext);

  useEffect(() => {
    fetchDj();
  }, []);
  const fetchDj = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/dj/get/${id}`
      );
      setSingleDj(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ marginTop: 3 }}
        onClick={() => navigate("/Dj")}
      >
        Go Back
      </Button>
      {singleDj && (
        <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
          <Image src={singleDj.djImages[0]} width="100%" height="300px"></Image>

          <Typography variant="h3" sx={{ marginTop: 3 }}>
            {singleDj.djName}
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            <PlaceIcon />
            {singleDj.djAddress},{singleDj.djCity}
          </Typography>
          <Typography
            variant="h5"
            sx={{ marginTop: 3, fontStyle: "oblique" }}
            className="shadow-lg p-3"
          >
            Description : <span>{singleDj.djDescription}</span>
          </Typography>
          <h5 className="mt-5 text-success">
            <SettingsIcon /> MUsic Types:
            <ul className="mt-3">
              {singleDj.musicType.map((offers, index) => (
                <li key={index}>{offers}</li>
              ))}
            </ul>
          </h5>

          <Typography
            variant="h6"
            sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
            className="bg-secondary p-3"
          >
            <MailIcon /> Contact : {singleDj.djContact}
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
            className="bg-success p-3"
          >
            Price :<CurrencyRupeeIcon /> {singleDj.price}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: 3, padding: 2 }}
          >
            Book
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default SingleDj;
