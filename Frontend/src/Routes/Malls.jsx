/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Image, Segmented } from "antd";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { Form, Input, message } from "antd";
import { FormControl } from "@mui/material";

function Malls() {
  const [malls, setMalls] = useState(null);
  const [modal, setModal] = useState(false);
  const [mallId, setMallId] = useState();
  const { fetchUserData } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls();
  }, []);

  const fetchMalls = async () => {
    const response = await axios.get("http://localhost:3000/api/malls/get");
    setMalls(response.data);
  };

  //This will view the particular Malls
  const singleMall = (mall, e) => {
    if (e.target.tagName == "BUTTON") {
      return;
    }
    navigate(`/mall/${mall._id}`);
  };

  const handleBook = (mall) => {
    setModal(true);
    setMallId(mall._id);
  };
  const handleClose = () => {
    setModal(false);
  };

  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/malls/book/${mallId}`,
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      handleClose();
      fetchMalls();
      fetchUserData();
    } catch (e) {
      message.error(e.response.data.message);
      handleClose();
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
                onClick={(e) => {
                  singleMall(mall, e);
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
                {mall.bookedBy.includes(localStorage.getItem("userId")) ? (
                  <Button disabled variant="contained">
                    Booked
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleBook(mall)}
                  >
                    Book
                  </Button>
                )}
              </div>
            </>
          ))}
      </div>
      <div>
        <Modal
          open={modal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="style">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Event Date :
            </Typography>

            <Form
              style={{ marginTop: 40, minWidth: 300 }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="eventDate"
                rules={[
                  {
                    required: true,
                    message: "Please enter Event date",
                    type: "date",
                  },
                ]}
              >
                <Input placeholder="date" type="date" />
              </Form.Item>

              <FormControl className="d-flex">
                <Form.Item>
                  <Input
                    type="Submit"
                    placeholder="Book"
                    name="eventName"
                    value="Book"
                    className="bg-success"
                  />
                </Form.Item>
                <Form.Item>
                  <Input
                    type="button"
                    value="Close"
                    className="bg-danger"
                    onClick={handleClose}
                  />
                </Form.Item>
              </FormControl>
            </Form>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Malls;
