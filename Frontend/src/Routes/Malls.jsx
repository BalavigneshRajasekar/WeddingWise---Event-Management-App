/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Image, Segmented, Empty, Upload } from "antd";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import { Form, Input, message } from "antd";
import { FormControl, IconButton } from "@mui/material";
import {
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
const { Search } = Input;

function Malls() {
  const [malls, setMalls] = useState([]);
  const [filterMalls, setFilterMalls] = useState([]);
  const [modal, setModal] = useState(false);
  const [formModel, setFormModel] = useState(false);
  const [mallImages, setMallImages] = useState([]);
  const [mallId, setMallId] = useState();
  const [editValues, setEditValues] = useState(null);
  const { fetchUserData, setRender } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls();
  }, []);
  //handle Initial mall fetching on component load
  const fetchMalls = async () => {
    const response = await axios.get(
      "https://event-management-api-ms52.onrender.com/api/malls/get"
    );
    setMalls(response.data);
    setFilterMalls(response.data);
  };

  //This will view the particular Malls
  const singleMall = (mall, e) => {
    console.log(e.target.tagName);
    if (e.target.tagName == "BUTTON" || e.target.tagName == "svg") {
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
        `https://event-management-api-ms52.onrender.com/api/malls/book/${mallId}`,
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

  //Below function used to handle All Admin feature Adding deleting Editing

  const handleAddMall = () => {
    setFormModel(true);
    setEditValues(null); //we using same form for add and edit to clear previous edit value
  };
  const handleFormModelClose = () => {
    setFormModel(false);
  };
  // Handle new mall adding
  const onFormFinish = async (values) => {
    const formData = new FormData();
    //adding form values to form data
    for (const key in values) {
      formData.append(key, values[key]);
    }
    //add media to form data
    mallImages.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    try {
      const response = await axios.post(
        "https://event-management-api-ms52.onrender.com/api/malls/add",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      handleFormModelClose();
      fetchMalls();
    } catch (e) {
      message.error(e.response.data.message);
      setFormModel(false);
    }
  };

  const handleImage = ({ fileList }) => {
    setMallImages(fileList);
    console.log(mallImages);
  };

  // Handle adding edit values to the state and open form

  const handleEdit = (mall) => {
    setFormModel(true);
    setEditValues(mall);

    console.log(editValues);
  };

  // Handle deleting the mall ADMIN Login
  const handleDelete = async (mall) => {
    try {
      const response = await axios.delete(
        `https://event-management-api-ms52.onrender.com/api/malls/delete/${mall._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchMalls();
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
    mallImages.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    try {
      const response = await axios.put(
        `https://event-management-api-ms52.onrender.com/api/malls/edit/${editValues._id}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      handleFormModelClose();
      fetchMalls();
    } catch (e) {
      message.error(e.response.data.message);
      setFormModel(false);
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
                      onClick={() => handleEdit(mall)}
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(mall)}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </div>
                  <div className="img ">
                    <Image
                      src={mall.mallImages[0]}
                      width="100%"
                      height="150px"
                    ></Image>
                  </div>
                  <span>{mall.mallName}</span>
                  <ul className="p-3">
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
              New Mall Details :
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
                name="mallName"
                initialValue={editValues ? editValues.mallName : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter mall Name",
                  },
                ]}
              >
                <Input placeholder="Mall Name" type="text" />
              </Form.Item>
              <Form.Item
                name="mallAddress"
                initialValue={editValues ? editValues.mallAddress : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter mallAddress",
                  },
                ]}
              >
                <Input placeholder="mallAddress" type="text" />
              </Form.Item>
              <Form.Item
                name="mallCity"
                initialValue={editValues ? editValues.mallCity : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter mallCity",
                  },
                ]}
              >
                <Input placeholder="mallCity" type="text" />
              </Form.Item>
              <Form.Item
                name="mallContact"
                initialValue={editValues ? editValues.mallContact : ""}
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
                name="spacing"
                initialValue={editValues ? editValues.spacing : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter Mall spacing capacity",
                  },
                ]}
              >
                <Input placeholder="spacing 100-200" type="text" />
              </Form.Item>
              <Form.Item
                name="amenities"
                initialValue={editValues ? editValues.amenities.join() : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter amenities by ,",
                  },
                ]}
              >
                <Input
                  placeholder="corporate event,marriage event,birthday event"
                  type="text"
                />
              </Form.Item>
              <Form.Item
                name="Price"
                initialValue={editValues ? editValues.Price : ""}
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
                fileList={mallImages}
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
                    name="eventName"
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

export default Malls;
