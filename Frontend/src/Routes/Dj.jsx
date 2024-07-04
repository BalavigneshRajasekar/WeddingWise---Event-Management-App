/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/Nav";
import { Container, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image, Empty, Upload } from "antd";
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
import { UploadOutlined } from "@ant-design/icons";
import AddIcon from "@mui/icons-material/Add";
const { Search } = Input;

function Dj() {
  const navigate = useNavigate();
  const [dj, setDj] = useState([]);
  const [filteredDj, setFilteredDj] = useState([]);
  const [formModel, setFormModel] = useState(false);
  const [DjImages, setDjImages] = useState([]);
  const [id, setId] = useState();
  const [modal, setModal] = useState();
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
    const response = await axios.get("http://localhost:3000/api/dj/get");
    setDj(response.data);
    setFilteredDj(response.data);
  };
  //This will view the particular DJ
  const singleDj = (djs, e) => {
    if (e.target.tagName == "BUTTON") {
      return;
    }

    navigate(`/Dj/${djs._id}`);
  };

  const handleClose = () => {
    setModal(false);
  };
  //Handling the DJ booking after the popup
  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/dj/book/${id}`,
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      fetchDj();
      setModal(false);
    } catch (e) {
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
  //Below function used to handle Add mall action
  const handleAddMall = () => {
    setFormModel(true);
  };
  const handleFormModelClose = () => {
    setFormModel(false);
  };
  const handleImage = ({ fileList }) => {
    setDjImages(fileList);
  };
  //Add Data to DB
  const onFormFinish = async (values) => {
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
        "http://localhost:3000/api/dj/add",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setFormModel(false);
      fetchDj();
    } catch (e) {
      message.error(e.response.data.message);
    }
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
                    <div className="img">
                      <Image
                        src={djs.djImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
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
              New DJ Details :
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
                name="djName"
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

export default Dj;
