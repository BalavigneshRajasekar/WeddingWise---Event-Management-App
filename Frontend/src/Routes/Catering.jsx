/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
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

function Catering() {
  const navigate = useNavigate();
  const [catering, setCatering] = useState([]);
  const [filteredCater, setFilteredCater] = useState([]);
  const [modal, setModal] = useState();
  const [formModel, setFormModel] = useState(false);
  const [caterImages, setCaterImages] = useState([]);
  const [cateringId, setCateringId] = useState();
  const { setRender } = useContext(AppContext);

  useEffect(() => {
    fetchCatering();
    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/Catering");
    }
  }, []);
  //handle Initial Catering fetching on component load
  const fetchCatering = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/catering/get"
      );
      setCatering(response.data);
      setFilteredCater(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  //This will view the particular Catering
  const singleCatering = (catering, e) => {
    if (e.target.tagName == "BUTTON") {
      return;
    }
    console.log(catering);
    navigate(`/catering/${catering._id}`);
  };

  const handleClose = () => {
    setModal(false);
  };
  //Handling the Catering booking after the popup
  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/catering/book/${cateringId}`,
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      handleClose();
      fetchCatering();
    } catch (e) {
      message.error(e.response.data.message);
      handleClose();
    }
  };
  const handleBook = (cater) => {
    setModal(true);
    setCateringId(cater._id);
  };
  const onFinishFailed = () => {};
  //Handle Searching filters
  const onSearch = (values) => {
    const filterCater = catering.filter((mall) => {
      return mall.cateringName
        .toLowerCase()
        .includes(values.target.value.toLowerCase());
    });
    setFilteredCater(filterCater);
  };
  //Handle Sorting filters
  const handleFilter = (values) => {
    switch (values) {
      case "All":
        setFilteredCater(catering);

        break;

      case "A-Z":
        setFilteredCater(
          catering.sort((a, b) => a.cateringName.localeCompare(b.cateringName))
        );
        setRender(values);
        break;
      case "Z-A":
        setFilteredCater(
          catering.sort((a, b) => b.cateringName.localeCompare(a.cateringName))
        );
        setRender(values);
        break;
      case "price-low-high":
        setFilteredCater(catering.sort((a, b) => a.price - b.price));
        setRender(values);
        break;

      case "price-hight-low":
        setFilteredCater(catering.sort((a, b) => b.price - a.price));
        setRender(values);
        break;
      default:
        setFilteredCater(catering);
    }
  };
  const handleAddMall = () => {
    setFormModel(true);
  };
  const handleFormModelClose = () => {
    setFormModel(false);
  };
  const handleImage = ({ fileList }) => {
    setCaterImages(fileList);
  };
  const onFormFinish = async (values) => {
    const formData = new FormData();
    //Add Form field values to formData
    for (const key in values) {
      formData.append(key, values[key]);
    }
    //Add Images to formData
    caterImages.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    try {
      const response = await axios.post(
        "http://localhost:3000/api/catering/add",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setFormModel(false);
      fetchCatering();
    } catch (e) {
      message.error(e.response.data.message);
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
          {filteredCater.length > 0 ? (
            filteredCater.map((cater, index) => (
              <>
                <Slide direction="right" in={filteredCater.length > 0}>
                  <div
                    className="card col-md-3"
                    key={index}
                    onClick={(e) => {
                      singleCatering(cater, e);
                    }}
                  >
                    <div className="card-border-top"></div>
                    <div className="img">
                      <Image
                        src={cater.cateringImages[0]}
                        width="100%"
                        height="150px"
                      ></Image>
                    </div>
                    <span>{cater.cateringName}</span>
                    <ul className="p-3">
                      {cater.cateringMenu.map((offers, index1) => (
                        <li key={index1}> {offers}</li>
                      ))}
                    </ul>
                    <p>
                      <PlaceIcon />
                      {cater.cateringAddress + "," + cater.cateringCity}
                    </p>
                    <p className="job">Price: {cater.price}</p>
                    {cater.bookedBy.includes(localStorage.getItem("userId")) ? (
                      <Button disabled variant="contained">
                        Booked
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleBook(cater)}
                      >
                        Book
                      </Button>
                    )}
                  </div>
                </Slide>
              </>
            ))
          ) : (
            <Empty description="No Catering Available" />
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
              New Catering Details :
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
                name="cateringName"
                rules={[
                  {
                    required: true,
                    message: "Please enter Catering Name",
                  },
                ]}
              >
                <Input placeholder="Catering Name" type="text" />
              </Form.Item>
              <Form.Item
                name="cateringDescription"
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
                name="cateringAddress"
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
                name="cateringCity"
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
                name="cateringContact"
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
                name="cateringMenu"
                rules={[
                  {
                    required: true,
                    message: "Please enter food menu by ,",
                  },
                ]}
              >
                <Input
                  placeholder="indian,chinese,western,italian,traditional"
                  type="text"
                />
              </Form.Item>
              <Form.Item
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please enter Catering Price",
                  },
                ]}
              >
                <Input placeholder="Price" type="text" />
              </Form.Item>
              <Upload
                fileList={caterImages}
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

export default Catering;
