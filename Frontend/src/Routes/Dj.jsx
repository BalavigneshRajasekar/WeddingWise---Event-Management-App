/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/Nav";
import { Container, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image, Empty, Upload, Popconfirm } from "antd";
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Form, message } from "antd";
import { AppContext } from "../context/AppContext";
import Slide from "@mui/material/Slide";
import {
  DeleteOutlined,
  EditOutlined,
  SaveFilled,
  UploadOutlined,
} from "@ant-design/icons";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import { Zoom } from "react-slideshow-image";
const { Search } = Input;

function Dj() {
  const navigate = useNavigate();
  const [dj, setDj] = useState([]); //All DJ data goes here
  const [filteredDj, setFilteredDj] = useState([]); // FIltered DJ details go here
  const [btnLoading, setBtnLoading] = useState(false); // Button loading control
  const [formModel, setFormModel] = useState(false); // Dj Add form control
  const [DjImages, setDjImages] = useState([]); // Dj images control
  const [id, setId] = useState(); // DJ ID to view Full screen
  const [modal, setModal] = useState(); // Booking model control
  const [editValues, setEditValues] = useState(null); // Editing DJ details go here
  const { setRender } = useContext(AppContext);

  useEffect(() => {
    fetchDj();
    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/Dj");
    }
  }, []);
  //handle Initial DJ fetching on component load
  const fetchDj = async () => {
    const response = await axios.get(
      "https://eventapi-uk2d.onrender.com/api/dj/get"
    );
    setDj(response.data);
    setFilteredDj(response.data);
  };
  //This will view the particular DJ
  const singleDj = (djs, e) => {
    if (
      e.target.tagName == "BUTTON" ||
      e.target.tagName == "svg" ||
      e.target.tagName == "SPAN"
    ) {
      return;
    }

    navigate(`/Dj/${djs._id}`);
  };

  const handleClose = () => {
    setModal(false);
    setFormModel(false);
  };
  //Handling the DJ booking after the popup
  const onFinish = async (values) => {
    setBtnLoading(true);
    try {
      const response = await axios.post(
        `https://eventapi-uk2d.onrender.com/api/dj/book/${id}`,
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading(false);
      fetchDj();
      setModal(false);
    } catch (e) {
      setBtnLoading(false);
      message.error(e.response.data.message);
      setModal(false);
    }
  };
  //Handle the event date Pop up
  const handleBook = (djs) => {
    setModal(true);
    setId(djs._id);
  };
  const onFinishFailed = () => {};
  //Handle Searching filters
  const onSearch = (values) => {
    const filterDj = dj.filter((djs) => {
      return djs.djName
        .toLowerCase()
        .includes(values.target.value.toLowerCase());
    });
    setFilteredDj(filterDj);
  };
  //Handle Sorting filters
  const handleFilter = (values) => {
    switch (values) {
      case "All":
        setFilteredDj(dj);

        break;

      case "A-Z":
        setFilteredDj(dj.sort((a, b) => a.djName.localeCompare(b.djName)));
        setRender(values);
        break;
      case "Z-A":
        setFilteredDj(dj.sort((a, b) => b.djName.localeCompare(a.djName)));
        setRender(values);
        break;
      case "price-low-high":
        setFilteredDj(dj.sort((a, b) => a.price - b.price));
        setRender(values);
        break;

      case "price-hight-low":
        setFilteredDj(dj.sort((a, b) => b.price - a.price));
        setRender(values);
        break;
      default:
        setFilteredDj(dj);
    }
  };
  //Below function used to handle All Admin features ADD, delete, edit
  const handleAddMall = () => {
    setFormModel(true);
    setEditValues(null);
  };
  const handleFormModelClose = () => {
    setFormModel(false);
  };
  const handleImage = ({ fileList }) => {
    setDjImages(fileList);
  };
  //Add Data to DB
  const onFormFinish = async (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    //Add Form field values to formData
    for (const key in values) {
      formData.append(key, values[key]);
    }
    //Add Images to formData
    DjImages.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    try {
      const response = await axios.post(
        "https://eventapi-uk2d.onrender.com/api/dj/add",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading(false);
      setFormModel(false);
      fetchDj();
    } catch (e) {
      setBtnLoading(false);
      message.error(e.response.data.message);
    }
  };
  // Handle adding edit values to the state and open form

  const handleEdit = (djs) => {
    setFormModel(true);
    setEditValues(djs);

    console.log(editValues);
  };

  // Handle deleting the mall ADMIN Login
  const handleDelete = async (djs) => {
    try {
      const response = await axios.delete(
        `https://eventapi-uk2d.onrender.com/api/dj/delete/${djs._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchDj();
    } catch (e) {
      message.error(e.response.data.message);
    }
  };

  //Handle editing the mall details in Admin login
  const onEditFormFinish = async (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    // add the form values to form data object
    for (const key in values) {
      formData.append(key, values[key]);
    }
    // add the images to form data object
    DjImages.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    try {
      const response = await axios.put(
        `https://eventapi-uk2d.onrender.com/api/dj/edit/${editValues._id}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading(false);
      handleFormModelClose();
      fetchDj();
    } catch (e) {
      setBtnLoading(false);
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
          {filteredDj.length > 0 ? (
            filteredDj.map((djs, index) => (
              <>
                <Slide direction="right" in={filteredDj.length > 0}>
                  <div
                    className="card col-md-3"
                    key={index}
                    onClick={(e) => {
                      singleDj(djs, e);
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
                        onClick={() => handleEdit(djs)}
                      >
                        <EditOutlined />
                      </IconButton>
                      <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(djs)}
                        onCancel={onFinishFailed}
                      >
                        <IconButton color="error" size="small">
                          <DeleteOutlined />
                        </IconButton>
                      </Popconfirm>
                    </div>
                    <div className="img">
                      <Zoom canSwipe arrows={false} indicators>
                        {djs.djImages.map((image, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={image}
                            width="100%"
                            height="150px"
                          ></Image>
                        ))}
                      </Zoom>
                    </div>
                    <span>{djs.djName}</span>
                    <ul className="p-3">
                      {djs.musicType.map((offers, index1) => (
                        <li key={index1}> {offers}</li>
                      ))}
                    </ul>
                    <p>
                      <PlaceIcon />
                      {djs.djAddress + "," + djs.djCity}
                    </p>
                    <p className="job">Price: {djs.price}</p>
                    {djs.bookedBy.includes(localStorage.getItem("userId")) ? (
                      <Button disabled variant="contained">
                        Booked
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleBook(djs)}
                      >
                        Book
                      </Button>
                    )}
                  </div>
                </Slide>
              </>
            ))
          ) : (
            <Empty description="No DJ Available" />
          )}
        </div>
      </Container>
      {/* Booking model form */}
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
                  <LoadingButton
                    fullWidth
                    loading={btnLoading}
                    loadingPosition="start"
                    size="large"
                    startIcon={<SaveFilled />}
                    variant="contained"
                    color="success"
                    type="Submit"
                    placeholder="Book"
                    name="eventName"
                  >
                    <span>Book</span>
                  </LoadingButton>
                </Form.Item>
                <Form.Item>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="button"
                    value="Close"
                    variant="outlined"
                    color="error"
                    onClick={handleClose}
                  >
                    CLose
                  </LoadingButton>
                </Form.Item>
              </FormControl>
            </Form>
          </Box>
        </Modal>
      </div>
      {/* Form model for adding a DJ in admin login */}
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
              New DJ Details :
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
                name="djName"
                initialValue={editValues ? editValues.djName : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter DJ Name",
                  },
                ]}
              >
                <Input placeholder="DJ Name" type="text" />
              </Form.Item>
              <Form.Item
                name="djDescription"
                initialValue={editValues ? editValues.djDescription : ""}
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
                name="djAddress"
                initialValue={editValues ? editValues.djAddress : ""}
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
                name="djCity"
                initialValue={editValues ? editValues.djCity : ""}
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
                name="djContact"
                initialValue={editValues ? editValues.djContact : ""}
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
                name="musicType"
                initialValue={editValues ? editValues.musicType.join() : ""}
                rules={[
                  {
                    required: true,
                    message: "Please enter Music genre ,",
                  },
                ]}
              >
                <Input placeholder="Rock,pop,tradition,western" type="text" />
              </Form.Item>
              <Form.Item
                name="price"
                initialValue={editValues ? editValues.price : ""}
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
                fileList={DjImages}
                beforeUpload={() => false}
                onChange={handleImage}
              >
                <Button>
                  <UploadOutlined /> Upload Images
                </Button>
              </Upload>

              <FormControl className="d-flex mt-3">
                <Form.Item>
                  <LoadingButton
                    fullWidth
                    loading={btnLoading}
                    loadingPosition="start"
                    size="large"
                    startIcon={<SaveFilled />}
                    variant="contained"
                    color="success"
                    type="Submit"
                    placeholder="Book"
                    name="eventName"
                  >
                    <span>{editValues ? "Update" : "Add"}</span>
                  </LoadingButton>
                </Form.Item>
                <Form.Item>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="button"
                    value="Close"
                    variant="outlined"
                    color="error"
                    onClick={handleClose}
                  >
                    CLose
                  </LoadingButton>
                </Form.Item>
              </FormControl>
            </Form>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Dj;
