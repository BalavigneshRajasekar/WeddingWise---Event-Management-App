/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Image, Segmented } from "antd";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function Malls() {
  const [malls, setMalls] = useState(null);
  const { setSingleMall } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls();
  }, []);

  const fetchMalls = async () => {
    const response = await axios.get("http://localhost:3000/api/malls/get");
    setMalls(response.data);
  };
  const singleMall = (mall) => {
    navigate(`/mall/${mall._id}`);
  };
  return (
    <div>
      <div className="d-flex justify-content-end mt-5">
        <Segmented
          options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
          onChange={(value) => {
            console.log(value); // string
          }}
        />
      </div>
      <div className="row mt-5 gap-1">
        {malls &&
          malls.map((mall, index) => (
            <>
              <div
                className="card col-md-3"
                key={index}
                onClick={() => {
                  singleMall(mall);
                }}
              >
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
                <Button color="success" variant="contained">
                  Book
                </Button>
              </div>
            </>
          ))}
      </div>
    </div>
  );
}

export default Malls;
