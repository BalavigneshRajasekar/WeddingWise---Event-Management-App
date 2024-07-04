/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Container, Button, Slide, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image, message, Empty } from "antd";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import Nav from "../components/Nav";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Form } from "antd";
import { AppContext } from "../context/AppContext";

const { Search } = Input;
function PhotoGraphy() {
  const navigate = useNavigate();
  const [photoGraphy, setPhotoGraphy] = useState([]);
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [id, setId] = useState();
  const [modal, setModal] = useState(false);
  const { setRender } = useContext(AppContext);

  useEffect(() => {
    fetchPhotoGraphy();
  }, []);
  //handle Initial Photo fetching on component load
  const fetchPhotoGraphy = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/photography/get"
      );
      setPhotoGraphy(response.data);
      setFilteredPhoto(response.data);
    } catch (e) {
      message.error(e.response.data.message);
    }
  };
  //This will view the particular Photo
  const singlePhoto = (photo, e) => {
    if (e.target.tagName == "BUTTON") {
      return;
    }

    navigate(`/photo/${photo._id}`);
  };

  // Close the event date pop up
  const handleClose = () => {
    setModal(false);
  };
  //Handle the event date Pop up
  const handleBook = (photo) => {
    setModal(true);
    setId(photo._id);
  };
  //Handling the Photo booking after the popup
  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/photography/book/${id}`,
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );

      message.success(response.data.message);
      fetchPhotoGraphy();
      setModal(false);
    } catch (e) {
      message.error(e.response.data.message);
      setModal(false);
    }
  };
  const onFinishFailed = () => {};
  //Handle Searching filters
  const onSearch = (value) => {
    const filterPhoto = photoGraphy.filter((photo) => {
      return photo.photographyName
        .toLowerCase()
        .includes(value.target.value.toLowerCase());
    });
    setFilteredPhoto(filterPhoto);
  };
  //Handle Sorting filters
  const handleFilter = (values) => {
    switch (values) {
      case "All":
        setFilteredPhoto(photoGraphy);

        break;

      case "A-Z":
        setFilteredPhoto(
          photoGraphy.sort((a, b) =>
            a.photographyName.localeCompare(b.photographyName)
          )
        );
        setRender(values);
        break;
      case "Z-A":
        setFilteredPhoto(
          photoGraphy.sort((a, b) =>
            b.photographyName.localeCompare(a.photographyName)
          )
        );
        setRender(values);
        break;
      case "price-low-high":
        setFilteredPhoto(photoGraphy.sort((a, b) => a.Price - b.Price));
        setRender(values);
        break;

      case "price-hight-low":
        setFilteredPhoto(photoGraphy.sort((a, b) => b.Price - a.Price));
        setRender(values);
        break;
      default:
        setFilteredPhoto(photoGraphy);
    }
  };
  return (
    <div>
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
          placeholder="Search Photography..."
          allowClear
          enterButton="Search"
          size="large"
          onChange={onSearch}
        />
        <div className="d-flex justify-content-end mt-5">
          <Segmented
            options={["All", "A-Z", "Z-A", "price-low-high", "price-hight-low"]}
            onChange={handleFilter}
          />
        </div>
        <div className="row mt-5 gap-1">
          {filteredPhoto.length > 0 ? (
            filteredPhoto.map((photo, index) => (
              <>
                <Slide direction="right" in={filteredPhoto.length > 0}>
                  <div
                    className="card col-md-3"
                    key={index}
                    onClick={(e) => {
                      singlePhoto(photo, e);
                    }}
                  >
                    <div className="card-border-top"></div>
                    <div className="img">
                      <Image
                        src={photo.photographyImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
                    </div>
                    <span>{photo.photographyName}</span>
                    <ul>
                      {photo.photographyType.map((offers, index1) => (
                        <li key={index1}> {offers}</li>
                      ))}
                    </ul>
                    <p>
                      <PlaceIcon />
                      {photo.photographyAddress + "," + photo.photographyCity}
                    </p>
                    <p className="job">Price: {photo.Price}</p>
                    {photo.bookedBy.includes(localStorage.getItem("userId")) ? (
                      <Button disabled variant="contained">
                        Booked
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleBook(photo)}
                      >
                        Book
                      </Button>
                    )}
                  </div>
                </Slide>
              </>
            ))
          ) : (
            <Empty description="No photo Available" />
          )}
        </div>
      </Container>
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

export default PhotoGraphy;
