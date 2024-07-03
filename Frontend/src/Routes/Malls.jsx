/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Image, Segmented, Empty } from "antd";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";

import { Form, Input, message } from "antd";
import { FormControl } from "@mui/material";
const { Search } = Input;

function Malls() {
  const [malls, setMalls] = useState([]);
  const [filterMalls, setFilterMalls] = useState([]);
  const [modal, setModal] = useState(false);
  const [mallId, setMallId] = useState();
  const { fetchUserData, setRender } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls();
  }, []);
  //handle Initial mall fetching on component load
  const fetchMalls = async () => {
    const response = await axios.get("http://localhost:3000/api/malls/get");
    setMalls(response.data);
    setFilterMalls(response.data);
  };

  //This will view the particular Malls
  const singleMall = (mall, e) => {
    if (e.target.tagName == "BUTTON") {
      return;
    }
    navigate(`/mall/${mall._id}`);
  };

  //Handle the event date Pop up
  const handleBook = (mall) => {
    setModal(true);
    setMallId(mall._id);
  };

  const handleClose = () => {
    setModal(false);
  };

  //Handling the mall booking after the popup
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
  //Handle Searching filters
  const onSearch = (value) => {
    const filtermall = malls.filter((mall) => {
      return mall.mallName
        .toLowerCase()
        .includes(value.target.value.toLowerCase());
    });
    setFilterMalls(filtermall);
  };
  //Handle Sorting filters
  const handleFilters = (values) => {
    switch (values) {
      case "All":
        setFilterMalls(malls);

        break;

      case "A-Z":
        setFilterMalls(
          malls.sort((a, b) => a.mallName.localeCompare(b.mallName))
        );
        setRender(values);
        break;
      case "Z-A":
        setFilterMalls(
          malls.sort((a, b) => b.mallName.localeCompare(a.mallName))
        );
        setRender(values);
        break;
      case "price-low-high":
        setFilterMalls(malls.sort((a, b) => a.Price - b.Price));
        setRender(values);
        break;

      case "price-hight-low":
        setFilterMalls(malls.sort((a, b) => b.Price - a.Price));
        setRender(values);
        break;
      default:
        setFilterMalls(malls);
    }
  };

  return (
    <div>
      <Search
        className="mt-5"
        style={{ width: "100%" }}
        placeholder="Search Malls..."
        allowClear
        enterButton="Search"
        size="large"
        onChange={onSearch}
      />
      <div className="d-flex justify-content-end mt-5">
        <Segmented
          options={["All", "A-Z", "Z-A", "price-low-high", "price-hight-low"]}
          onChange={handleFilters}
        />
      </div>
      <div className="row mt-5 gap-1">
        {filterMalls.length > 0 ? (
          filterMalls.map((mall, index) => (
            <>
              <Slide direction="right" in={filterMalls.length > 0}>
                <div
                  className="card col-md-3"
                  key={mall.Name}
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
              </Slide>
            </>
          ))
        ) : (
          <Empty description="No malls" />
        )}
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
