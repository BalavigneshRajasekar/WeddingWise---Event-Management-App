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

function SingleMall() {
  const { singleMall, setSingleMall } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchMall();
  }, []);
  const fetchMall = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/malls/get/${id}`
      );
      setSingleMall(response.data);
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
        onClick={() => navigate("/home")}
      >
        Go Back
      </Button>
      {singleMall && (
        <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
          <Image
            src={singleMall.mallImages[0]}
            width="100%"
            height="300px"
          ></Image>
          <Typography variant="h3" sx={{ marginTop: 3 }}>
            {singleMall.mallName}
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            <PlaceIcon />
            {singleMall.mallAddress},{singleMall.mallCity}
          </Typography>
          <h5 className="mt-5 text-success">
            <SettingsIcon /> Amenities:
            <ul className="mt-3">
              {singleMall.amenities.map((offers, index) => (
                <li key={index}>{offers}</li>
              ))}
            </ul>
          </h5>
          <Typography
            variant="h6"
            sx={{
              marginTop: 3,
              fontWeight: 700,
              backgroundColor: "purple",
              color: "white",
              padding: 3,
            }}
          >
            Spacing : {singleMall.spacing}{" "}
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
            className="bg-secondary p-3"
          >
            <MailIcon /> Contact : {singleMall.mallContact}
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
            className="bg-success p-3"
          >
            Price :<CurrencyRupeeIcon /> {singleMall.Price}
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

export default SingleMall;
