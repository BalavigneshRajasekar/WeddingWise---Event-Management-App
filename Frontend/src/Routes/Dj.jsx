/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { Container, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image } from "antd";
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Search } = Input;
function Dj() {
  const [dj, setDj] = useState();

  useEffect(() => {
    fetchDj();
    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/Dj");
    }
  }, []);
  const fetchDj = async () => {
    const response = await axios.get("http://localhost:3000/api/dj/get");
    setDj(response.data);
  };
  const navigate = useNavigate();
  const onSearch = (values) => {
    console.log(values);
  };
  const singleDj = (djs) => {
    console.log(djs);
    navigate(`/Dj/${djs._id}`);
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
          {dj &&
            dj.map((djs, index) => (
              <>
                <div
                  className="card col-md-3"
                  key={index}
                  onClick={() => {
                    singleDj(djs);
                  }}
                >
                  <div className="card-border-top"></div>
                  <div className="img">
                    <Image
                      src={djs.djImages[0]}
                      width="100%"
                      height="150px"
                    ></Image>
                  </div>
                  <span>{djs.djName}</span>
                  <ul>
                    {djs.musicType.map((offers, index1) => (
                      <li key={index1}> {offers}</li>
                    ))}
                  </ul>
                  <p>
                    <PlaceIcon />
                    {djs.djAddress + "," + djs.djCity}
                  </p>
                  <p className="job">Price: {djs.price}</p>
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

export default Dj;
