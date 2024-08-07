/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { Container, Button } from "@mui/material";
import { Image } from "antd";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Malls from "../Routes/Malls";
import { AppContext } from "../context/AppContext";

function Home() {
  const { budget, budgetLeft, fetchUserData, setOpenModel } =
    useContext(AppContext);

  const navigate = useNavigate();
  // const [userToken, setUserToken] = useState(localStorage.getItem("logToken"));
  //Checking user has token r not
  useEffect(() => {
    fetchUserData();

    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/home");
    }
    if (budgetLeft <= 0) {
      setTimeout(() => {
        setOpenModel(true);
      }, 5000);
    }
  }, []);

  // Banners

  const fadeImages = [
    {
      url: "dj.jpg",
      caption: "First Slide",
    },
    {
      url: "catering.jpg",
      caption: "Second Slide",
    },
    {
      url: "photo.webp",
      caption: "Third Slide",
    },
  ];
  return (
    <div>
      <div className="position-sticky top-0 z-3">
        <Nav></Nav>
      </div>
      <Container maxWidth>
        <div className="d-flex justify-content-between mt-3">
          <p className="bg-success p-2 text-light rounded-3">
            Budget Spent : {budget}
          </p>
          <p className="bg-success p-2 text-light rounded-3">
            Budget Left : {budgetLeft}
          </p>
        </div>

        {/* Sliders */}
        <div
          className="slide-container mt-3 w-100 "
          style={{ maxWidth: "1000px" }}
        >
          <Slide canSwipe arrows={false} indicators duration={1000}>
            {fadeImages.map((fadeImage, index) => (
              <div key={index}>
                <Image width="100%" height="400px" src={fadeImage.url} />
              </div>
            ))}
          </Slide>
        </div>

        <div className="mt-5">
          <h4>Vendors :</h4>
          <div className=" p-md-5 mt-3 bg-md-dark">
            <div className="row gap-3 justify-content-around ">
              <Button
                variant="contained"
                color="secondary"
                className="col-5 "
                onClick={() => navigate("/Decoration")}
              >
                Decoration
                <img
                  src="Decoration.png"
                  style={{
                    width: "40px",
                    marginLeft: "20px",
                    borderRadius: "20px",
                  }}
                ></img>
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className="col-5"
                onClick={() => navigate("/Photography")}
              >
                PhotoGraphy
                <img
                  src="PhotoIcon.webp"
                  style={{
                    width: "40px",
                    marginLeft: "20px",
                    borderRadius: "20px",
                  }}
                ></img>
              </Button>

              <Button
                variant="contained"
                color="secondary"
                className="col-5 "
                onClick={() => navigate("/Dj")}
              >
                DJ Players
                <img
                  src="DjIcon.png"
                  style={{
                    width: "40px",
                    marginLeft: "20px",
                    borderRadius: "20px",
                  }}
                ></img>
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className="col-5 "
                onClick={() => navigate("/Catering")}
              >
                Catering
                <img
                  src="cateringIcon.webp"
                  style={{
                    width: "40px",
                    marginLeft: "20px",
                    borderRadius: "20px",
                  }}
                ></img>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Malls></Malls>
        </div>
      </Container>
    </div>
  );
}

export default Home;
