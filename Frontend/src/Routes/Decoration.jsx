/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Container, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image, Empty, Upload } from "antd";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import { AppContext } from "../context/AppContext";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Form, message } from "antd";
import Slide from "@mui/material/Slide";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import AddIcon from "@mui/icons-material/Add";
const { Search } = Input;

function Decoration() {
  const navigate = useNavigate();
  const [decorations, setDecorations] = useState();
  const [filterDecor, setFilterDecor] = useState([]);
  const [modal, setModal] = useState();
  const [formModel, setFormModel] = useState(false);
  const [decorImages, setDecorImages] = useState([]);
  const [decorId, setDecorId] = useState();
  const [editValues, setEditValues] = useState(null);
  const { setRender } = useContext(AppContext);

  useEffect(() => {
    fetchDecorations();

    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/Decoration");
    }
  }, []);
  //handle Initial DJ fetching on component load
  const fetchDecorations = async () => {
    const response = await axios.get(
      "https://event-management-api-ms52.onrender.com/api/decorations/get"
    );
    setDecorations(response.data);
    setFilterDecor(response.data);
  };
  //This will view the particular Decoration
  const singleDecor = (decor, e) => {
    if (e.target.tagName == "BUTTON" || e.target.tagName == "svg") {
      return;
    }
    console.log(decor);
    navigate(`/decoration/${decor._id}`);
  };

  const handleClose = () => {
    setModal(false);
  };
  //Handling the Decoration booking after the popup
  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `https://event-management-api-ms52.onrender.com/api/decorations/book/${decorId}`,
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchDecorations();
      setModal(false);
    } catch (e) {
      message.error(e.response.data.message);
      setModal(false);
    }
  };
  const handleBook = (decor) => {
    setModal(true);
    setDecorId(decor._id);
  };
  const onFinishFailed = () => {};

  //Handle Searching filters
  const onSearch = (value) => {
    const filterdecor = decorations.filter((decor) => {
      return decor.decorName
        .toLowerCase()
        .includes(value.target.value.toLowerCase());
    });
    setFilterDecor(filterdecor);
  };
  //Handle Sorting filters
  const handleFilter = (values) => {
    switch (values) {
      case "All":
        setFilterDecor(decorations);

        break;

      case "A-Z":
        setFilterDecor(
          decorations.sort((a, b) => a.decorName.localeCompare(b.decorName))
        );
        setRender(values);
        break;
      case "Z-A":
        setFilterDecor(
          decorations.sort((a, b) => b.decorName.localeCompare(a.mallName))
        );
        setRender(values);
        break;
      case "price-low-high":
        setFilterDecor(decorations.sort((a, b) => a.Price - b.Price));
        setRender(values);
        break;

      case "price-hight-low":
        setFilterDecor(decorations.sort((a, b) => b.Price - a.Price));
        setRender(values);
        break;
      default:
        setFilterDecor(decorations);
    }
  };
  const handleAddMall = () => {
    setFormModel(true);
    setEditValues(null);
  };
  const handleFormModelClose = () => {
    setFormModel(false);
  };
  const handleImage = ({ fileList }) => {
    setDecorImages(fileList);
  };
  const onFormFinish = async (values) => {
    const formData = new FormData();
    //Add Form field values to formData
    for (const key in values) {
      formData.append(key, values[key]);
    }
    //Add Images to formData
    decorImages.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    try {
      const response = await axios.post(
        "https://event-management-api-ms52.onrender.com/api/decorations/add",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setFormModel(false);
      fetchDecorations();
    } catch (e) {
      message.error(e.response.data.message);
    }
  };
  // Handle adding edit values to the state and open form

  const handleEdit = (decor) => {
    setFormModel(true);
    setEditValues(decor);

    console.log(editValues);
  };

  // Handle deleting the mall ADMIN Login
  const handleDelete = async (decor) => {
    try {
      const response = await axios.delete(
        `https://event-management-api-ms52.onrender.com/api/decorations/delete/${decor._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchDecorations();
    } catch (e) {
      message.error(e.response.data.message);
    }
  };

  //Handle editing the mall details in Admin login
  const onEditFormFinish = async (values) => {
    const formData = new FormData();
    // add the form values to form data object
    for (const key in values) {
      formData.append(key, values[key]);
    }
    // add the images to form data object
    decorImages.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    try {
      const response = await axios.put(
        `https://event-management-api-ms52.onrender.com/api/decorations/edit/${editValues._id}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      handleFormModelClose();
      fetchDecorations();
    } catch (e) {
      message.error(e.response.data.message);
      setFormModel(false);
    }
  };
  return (
    <div>
      <div className="position-sticky top-0 z-1">
        <Nav></Nav>
      </div>
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
          {filterDecor.length > 0 ? (
            filterDecor.map((decor, index) => (
              <>
                <Slide direction="right" in={filterDecor.length > 0}>
                  <div
                    className="card col-md-3"
                    key={index}
                    onClick={(e) => {
                      singleDecor(decor, e);
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
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => handleEdit(decor)}
                      >
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(decor)}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </div>
                    <div className="img">
                      <Image
                        src={decor.decorImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
                    </div>
                    <span>{decor.decorName}</span>
                    <ul className="p-3">
                      {decor.decorType.map((offers, index1) => (
                        <li key={index1}> {offers}</li>
                      ))}
                    </ul>
                    <p>
                      <PlaceIcon />
                      {decor.decorAddress + "," + decor.decorCity}
                    </p>
                    <p className="job">Price: {decor.Price}</p>
                    {decor.bookedBy.includes(localStorage.getItem("userId")) ? (
                      <Button disabled variant="contained">
                        Booked
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleBook(decor)}
                      >
                        Book
                      </Button>
                    )}
                  </div>
                </Slide>
              </>
            ))
          ) : (
            <Empty description="No Decors Available" />
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
          <Box className="style overflow-scroll">
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
              New Decoration Details :
            </Typography>

            <Form
              style={{ marginTop: 40, minWidth: 300 }}
              initialValues={{
                remember: true,
              }}
              onFinish={editValues ? onEditFormFinish : onFormFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="decorName"
                initialValue={editValues ? editValues.decorName : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter Decor Name",
                  },
                ]}
              >
                <Input placeholder="Decor Name" type="text" />
              </Form.Item>
              <Form.Item
                name="DecorDescription"
                initialValue={editValues ? editValues.DecorDescription : ""}
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
                name="decorAddress"
                initialValue={editValues ? editValues.decorAddress : ""}
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
                name="decorCity"
                initialValue={editValues ? editValues.decorCity : ""}
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
                name="decorContact"
                initialValue={editValues ? editValues.decorContact : ""}
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
                name="decorType"
                initialValue={editValues ? editValues.decorType.join() : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter Decoration type by ,",
                  },
                ]}
              >
                <Input
                  placeholder="room decor, flower decor, floral decor"
                  type="text"
                />
              </Form.Item>
              <Form.Item
                name="Price"
                initialValue={editValues ? editValues.Price : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter Decoration Price",
                  },
                ]}
              >
                <Input placeholder="Price" type="text" />
              </Form.Item>
              <Upload
                fileList={decorImages}
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
                    value={editValues ? "Update" : "Add"}
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

export default Decoration;
