/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Button,
  Slide,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image, message, Empty, Upload } from "antd";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import Nav from "../components/Nav";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Form } from "antd";
import { AppContext } from "../context/AppContext";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import AddIcon from "@mui/icons-material/Add";

const { Search } = Input;
function PhotoGraphy() {
  const navigate = useNavigate();
  const [photoGraphy, setPhotoGraphy] = useState([]);
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [formModel, setFormModel] = useState(false);
  const [photoImages, setPhotoImages] = useState([]);
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
    if (e.target.tagName == "BUTTON" || e.target.tagName == "svg") {
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
  const handleAddMall = () => {
    setFormModel(true);
  };
  const handleFormModelClose = () => {
    setFormModel(false);
  };
  const handleImage = ({ fileList }) => {
    setPhotoImages(fileList);
  };
  const onFormFinish = async (values) => {
    const formData = new FormData();
    //Add Form field values to formData
    for (const key in values) {
      formData.append(key, values[key]);
    }
    //Add Images to formData
    photoImages.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    try {
      const response = await axios.post(
        "http://localhost:3000/api/photography/add",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setFormModel(false);
      fetchPhotoGraphy();
    } catch (e) {
      message.error(e.response.data.message);
    }
  };
  return (
    <div>
      <div className="position-sticky top-0 z-1">
        <Nav></Nav>
      </div>
      <Container maxWidth className="mt-5">
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
        <div
          className={
            localStorage.getItem("role") == "User"
              ? "d-flex justify-content-end mt-5"
              : "d-flex justify-content-between mt-5 flex-md-row flex-column-reverse gap-5 "
          }
        >
          <Button
            variant="contained"
            className={
              localStorage.getItem("role") == "Admin" ? "d-block" : "d-none"
            }
            onClick={handleAddMall}
          >
            Add <AddIcon />
          </Button>
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
                    <div
                      className={
                        localStorage.getItem("role") == "Admin"
                          ? "d-flex justify-content-end"
                          : "d-none"
                      }
                    >
                      <IconButton color="success" size="small">
                        <EditOutlined />
                      </IconButton>
                      <IconButton color="error" size="small">
                        <DeleteOutlined />
                      </IconButton>
                    </div>
                    <div className="img">
                      <Image
                        src={photo.photographyImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
                    </div>
                    <span>{photo.photographyName}</span>
                    <ul className="p-3">
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
      {/* Form model for adding a mall in admin login */}
      <div>
        <Modal
          open={formModel}
          onClose={handleFormModelClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="style">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="p-2 border border-1 shadow-sm rounded-2"
            >
              New Photography Details :
            </Typography>

            <Form
              style={{ marginTop: 40, minWidth: 300 }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFormFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="photographyName"
                rules={[
                  {
                    required: true,
                    message: "Please enter Photography Name",
                  },
                ]}
              >
                <Input placeholder="Photography Name" type="text" />
              </Form.Item>
              <Form.Item
                name="photographyDescription"
                rules={[
                  {
                    required: true,
                    message: "Please enter Description",
                  },
                ]}
              >
                <Input placeholder="Description" type="text" />
              </Form.Item>
              <Form.Item
                name="photographyAddress"
                rules={[
                  {
                    required: true,
                    message: "Please enter Address",
                  },
                ]}
              >
                <Input placeholder="Address" type="text" />
              </Form.Item>
              <Form.Item
                name="photographyCity"
                rules={[
                  {
                    required: true,
                    message: "Please enter City",
                  },
                ]}
              >
                <Input placeholder="City" type="text" />
              </Form.Item>
              <Form.Item
                name="photographyContact"
                rules={[
                  {
                    required: true,
                    message: "Please enter Contact email",
                  },
                ]}
              >
                <Input placeholder="Email" type="email" />
              </Form.Item>

              <Form.Item
                name="photographyType"
                rules={[
                  {
                    required: true,
                    message: "Please enter Types of photoGraphy by ,",
                  },
                ]}
              >
                <Input
                  placeholder="pre wedding,post wedding,baby shower"
                  type="text"
                />
              </Form.Item>
              <Form.Item
                name="Price"
                rules={[
                  {
                    required: true,
                    message: "Please enter mall Price",
                  },
                ]}
              >
                <Input placeholder="Price" type="text" />
              </Form.Item>
              <Upload
                fileList={photoImages}
                beforeUpload={() => false}
                onChange={handleImage}
              >
                <Button>
                  <UploadOutlined /> Upload Images
                </Button>
              </Upload>

              <FormControl className="d-flex mt-3">
                <Form.Item>
                  <Input
                    type="Submit"
                    placeholder="Book"
                    name="button"
                    value="Book"
                    className="bg-success"
                  />
                </Form.Item>
                <Form.Item>
                  <Input
                    type="button"
                    value="Close"
                    className="bg-danger"
                    onClick={handleFormModelClose}
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
