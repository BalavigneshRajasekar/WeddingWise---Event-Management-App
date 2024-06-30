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

function SingleCatering() {
  const { singleCatering, setSingleCatering } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCatering();
    console.log(id);
  }, []);
  const fetchCatering = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/catering/get/${id}`
      );
      setSingleCatering(response.data);
    } catch (e) {
      console.log("Error fetching catering", e);
    }
  };
  return (
    <Container>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ marginTop: 3 }}
        onClick={() => navigate("/Catering")}
      >
        Go Back
      </Button>
      {singleCatering && (
        <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
          <Image
            src={singleCatering.cateringImages[0]}
            width="100%"
            height="300px"
          ></Image>

          <Typography variant="h3" sx={{ marginTop: 3 }}>
            {singleCatering.cateringName}
          </Typography>

          <Typography variant="h6" sx={{ marginTop: 2 }}>
            <PlaceIcon />
            {singleCatering.cateringAddress},{singleCatering.cateringCity}
          </Typography>
          <Typography
            variant="h5"
            sx={{ marginTop: 3, fontStyle: "oblique" }}
            className="shadow-lg p-3"
          >
            Description :<span>{singleCatering.cateringDescription}</span>
          </Typography>

          <h5 className="mt-5 text-success">
            <SettingsIcon /> Menu:
            <ul className="mt-3">
              {singleCatering.cateringMenu.map((offers, index) => (
                <li key={index}>{offers}</li>
              ))}
            </ul>
          </h5>

          <Typography
            variant="h6"
            sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
            className="bg-secondary p-3"
          >
            <MailIcon /> Contact : {singleCatering.cateringContact}
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
            className="bg-success p-3"
          >
            Price :<CurrencyRupeeIcon /> {singleCatering.price}
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

export default SingleCatering;
