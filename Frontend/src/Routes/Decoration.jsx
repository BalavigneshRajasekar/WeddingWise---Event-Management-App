/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image } from "antd";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import { AppContext } from "../context/AppContext";
const { Search } = Input;

function Decoration() {
  const navigate = useNavigate();

  const [decorations, setDecorations] = useState();

  useEffect(() => {
    fetchDecorations();

    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/Decoration");
    }
  }, []);
  const fetchDecorations = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/decorations/get"
    );
    setDecorations(response.data);
  };
  const singleDecor = (decor) => {
    console.log(decor);
    navigate(`/decoration/${decor._id}`);
  };

  const onSearch = (value, _e, info) => console.log(value);
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
          {decorations &&
            decorations.map((decor, index) => (
              <>
                <div
                  className="card col-md-3"
                  key={index}
                  onClick={() => {
                    singleDecor(decor);
                  }}
                >
                  <div className="card-border-top"></div>
                  <div className="img">
                    <Image
                      src={decor.decorImages[0]}
                      width="100%"
                      height="150px"
                    ></Image>
                  </div>
                  <span>{decor.decorName}</span>
                  <ul>
                    {decor.decorType.map((offers, index1) => (
                      <li key={index1}> {offers}</li>
                    ))}
                  </ul>
                  <p>
                    <PlaceIcon />
                    {decor.decorAddress + "," + decor.decorCity}
                  </p>
                  <p className="job">Price: {decor.Price}</p>
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

export default Decoration;
