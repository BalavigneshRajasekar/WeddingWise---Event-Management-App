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

function SingleDecoration() {
  const navigate = useNavigate();
  const { singleDecoration, setSingleDecoration } = useContext(AppContext);
  const { id } = useParams();

  useEffect(() => {
    fetchDecor();
  }, []);

  const fetchDecor = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/decorations/get/${id}`
      );
      setSingleDecoration(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ marginTop: 3 }}
        onClick={() => navigate("/Decoration")}
      >
        Go Back
      </Button>
      {singleDecoration && (
        <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
          <Image
            src={singleDecoration.decorImages[0]}
            width="100%"
            height="300px"
          ></Image>

          <Typography variant="h3" sx={{ marginTop: 3 }}>
            {singleDecoration.decorName}
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            <PlaceIcon />
            {singleDecoration.decorAddress},{singleDecoration.decorCity}
          </Typography>
          <Typography
            variant="h5"
            sx={{ marginTop: 3, fontStyle: "oblique" }}
            className="shadow-lg p-3"
          >
            Description : <span>{singleDecoration.DecorDescription}</span>
          </Typography>
          <h5 className="mt-5 text-success">
            <SettingsIcon /> Menu:
            <ul className="mt-3">
              {singleDecoration.decorType.map((offers, index) => (
                <li key={index}>{offers}</li>
              ))}
            </ul>
          </h5>

          <Typography
            variant="h6"
            sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
            className="bg-secondary p-3"
          >
            <MailIcon /> Contact : {singleDecoration.decorContact}
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
            className="bg-success p-3"
          >
            Price :<CurrencyRupeeIcon /> {singleDecoration.Price}
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

export default SingleDecoration;
