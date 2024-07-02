/* eslint-disable no-unused-vars */
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Button, Container, Typography } from "@mui/material";
import { Image, message } from "antd";
import React, { useEffect, useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [bookedMall, setBookedMall] = useState([]);
  const [bookedDj, setBookedDj] = useState([]);
  const [bookedDecor, setBookedDecor] = useState([]);
  const [bookedCater, setBookedCater] = useState([]);

  useEffect(() => {
    fetchBookedMall();
    fetchBookedDj();
    fetchBookedDecor();
    fetchCatering();
  }, []);
  const fetchBookedMall = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/malls/dashboard",
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedMall(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleMallCanceling = async (mall) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/malls/remove/${mall._id}`,
        { eventDate: mall.bookedOn[0].date },
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchBookedMall();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchBookedDj = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/dj/dashboard",
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedDj(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleDjCanceling = async (dj) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/dj/remove/${dj._id}`,
        { eventDate: dj.bookedOn[0].date },
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchBookedDj();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchBookedDecor = async (mall) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/decorations/dashboard",
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedDecor(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleDecorCanceling = async (decor) => {
    console.log(bookedDecor);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/decorations/remove/${decor._id}`,
        { eventDate: decor.bookedOn[0].date },
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchBookedDecor();
    } catch (e) {
      console.log(e);
    }
  };
  const fetchCatering = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/catering/dashboard`,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedCater(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleCaterCanceling = async (mall) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/catering/remove/${mall._id}`,
        { eventDate: mall.bookedOn[0].date },
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchCatering();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <Container>
        <Typography variant="h4" sx={{ marginTop: 5 }}>
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{ marginTop: 5 }}
          onClick={() => navigate("/home")}
        >
          Go Back
        </Button>
        <div className="mt-5 ">
          {bookedMall.length > 0 && (
            <>
              <Typography variant="h4">Booked Mall :</Typography>
              <div className="d-flex">
                {bookedMall.map((mall, index) => (
                  <div key={index} className="card" style={{ width: "300px" }}>
                    <div className="card-border-top"></div>
                    <div className="img">
                      <Image
                        src={mall.mallImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
                    </div>
                    <span>{mall.mallName}</span>
                    <ul>
                      {mall.amenities.map((offers, index1) => (
                        <li key={index1}> {offers}</li>
                      ))}
                    </ul>
                    <p>
                      <PlaceIcon />
                      {mall.mallAddress + "," + mall.mallCity}
                    </p>
                    <p className="job">Price: {mall.Price}</p>
                    <div>
                      <Button
                        color="success"
                        variant="contained"
                        disabled
                        fullWidth
                      >
                        Scheduled ON : {mall.bookedOn[0].date}
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        fullWidth
                        onClick={() => handleMallCanceling(mall)}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mt-5 ">
          {bookedDj.length > 0 && (
            <>
              <Typography variant="h4">Booked Dj :</Typography>
              <div className="d-flex">
                {bookedDj.map((mall, index) => (
                  <div key={index} className="card" style={{ width: "300px" }}>
                    <div className="card-border-top"></div>
                    <div className="img">
                      <Image
                        src={mall.djImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
                    </div>
                    <span>{mall.djName}</span>
                    <ul>
                      {mall.musicType.map((offers, index1) => (
                        <li key={index1}> {offers}</li>
                      ))}
                    </ul>
                    <p>
                      <PlaceIcon />
                      {mall.djAddress + "," + mall.djCity}
                    </p>
                    <p className="job">Price: {mall.price}</p>
                    <div>
                      <Button
                        color="success"
                        variant="contained"
                        disabled
                        fullWidth
                      >
                        Scheduled ON : {mall.bookedOn[0].date}
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        fullWidth
                        onClick={() => handleDjCanceling(mall)}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mt-5 ">
          {bookedDecor.length > 0 && (
            <>
              <Typography variant="h4">Booked Decor :</Typography>
              <div className="d-flex">
                {bookedDecor.map((mall, index) => (
                  <div key={index} className="card" style={{ width: "300px" }}>
                    <div className="card-border-top"></div>
                    <div className="img">
                      <Image
                        src={mall.decorImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
                    </div>
                    <span>{mall.decorName}</span>
                    <ul>
                      {mall.decorType.map((offers, index1) => (
                        <li key={index1}> {offers}</li>
                      ))}
                    </ul>
                    <p>
                      <PlaceIcon />
                      {mall.decorAddress + "," + mall.decorCity}
                    </p>
                    <p className="job">Price: {mall.Price}</p>
                    <div>
                      <Button
                        color="success"
                        variant="contained"
                        disabled
                        fullWidth
                      >
                        Scheduled ON : {mall.bookedOn[0].date}
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        fullWidth
                        onClick={() => handleDecorCanceling(mall)}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mt-5 ">
          {bookedCater.length > 0 && (
            <>
              <Typography variant="h4">Booked Decor :</Typography>
              <div className="d-flex">
                {bookedCater.map((mall, index) => (
                  <div key={index} className="card" style={{ width: "300px" }}>
                    <div className="card-border-top"></div>
                    <div className="img">
                      <Image
                        src={mall.cateringImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
                    </div>
                    <span>{mall.cateringName}</span>
                    <ul>
                      {mall.cateringMenu.map((offers, index1) => (
                        <li key={index1}> {offers}</li>
                      ))}
                    </ul>
                    <p>
                      <PlaceIcon />
                      {mall.cateringAddress + "," + mall.cateringCity}
                    </p>
                    <p className="job">Price: {mall.price}</p>
                    <div>
                      <Button
                        color="success"
                        variant="contained"
                        disabled
                        fullWidth
                      >
                        Scheduled ON : {mall.bookedOn[0].date}
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        fullWidth
                        onClick={() => handleCaterCanceling(mall)}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
