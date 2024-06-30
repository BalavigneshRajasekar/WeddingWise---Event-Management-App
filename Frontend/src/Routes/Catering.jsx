/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Container, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image } from "antd";
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Search } = Input;
function Catering() {
  const [catering, setCatering] = useState();

  useEffect(() => {
    fetchCatering();
    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/Catering");
    }
  }, []);
  const fetchCatering = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/catering/get"
      );
      setCatering(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const navigate = useNavigate();
  const onSearch = (values) => {
    console.log(values);
  };

  const singleCatering = (catering) => {
    console.log(catering);
    navigate(`/catering/${catering._id}`);
  };

  return (
    <div>
      <Nav></Nav>
      <Container maxWidth="lg" className="mt-5">
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/home")}
        >
          Go Back
        </Button>

        <Search
          className="mt-5"
          style={{ width: "100%" }}
          placeholder="Search decorations..."
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
        <div className="d-flex justify-content-end mt-5">
          <Segmented
            options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
            onChange={(value) => {
              console.log(value); // string
            }}
          />
        </div>
        <div className="row mt-5 gap-1">
          {catering &&
            catering.map((cater, index) => (
              <>
                <div
                  className="card col-md-3"
                  key={index}
                  onClick={() => {
                    singleCatering(cater);
                  }}
                >
                  <div className="card-border-top"></div>
                  <div className="img">
                    <Image
                      src={cater.cateringImages[0]}
                      width="100%"
                      height="150px"
                    ></Image>
                  </div>
                  <span>{cater.cateringName}</span>
                  <ul>
                    {cater.cateringMenu.map((offers, index1) => (
                      <li key={index1}> {offers}</li>
                    ))}
                  </ul>
                  <p>
                    <PlaceIcon />
                    {cater.cateringAddress + "," + cater.cateringCity}
                  </p>
                  <p className="job">Price: {cater.price}</p>
                  <Button color="success" variant="contained">
                    Book
                  </Button>
                </div>
              </>
            ))}
        </div>
      </Container>
    </div>
  );
}

export default Catering;
