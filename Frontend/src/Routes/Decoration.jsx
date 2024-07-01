/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image } from "antd";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import { AppContext } from "../context/AppContext";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Form, message } from "antd";
const { Search } = Input;

function Decoration() {
  const navigate = useNavigate();

  const [decorations, setDecorations] = useState();
  const [modal, setModal] = useState();
  const [decorId, setDecorId] = useState();

  useEffect(() => {
    fetchDecorations();

    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/Decoration");
    }
  }, []);
  const fetchDecorations = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/decorations/get"
    );
    setDecorations(response.data);
  };
  const singleDecor = (decor, e) => {
    if (e.target.tagName == "BUTTON") {
      return;
    }
    console.log(decor);
    navigate(`/decoration/${decor._id}`);
  };

  const onSearch = (value, _e, info) => console.log(value);

  const handleClose = () => {
    setModal(false);
  };
  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/decorations/book/${decorId}`,
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
          onSearch={onSearch}
        />
        <div className="d-flex justify-content-end mt-5">
          <Segmented
            options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
            onChange={(value) => {
              console.log(value); // string
            }}
          />
        </div>
        <div className="row mt-5 gap-1">
          {decorations &&
            decorations.map((decor, index) => (
              <>
                <div
                  className="card col-md-3"
                  key={index}
                  onClick={(e) => {
                    singleDecor(decor, e);
                  }}
                >
                  <div className="card-border-top"></div>
                  <div className="img">
                    <Image
                      src={decor.decorImages[0]}
                      width="100%"
                      height="150px"
                    ></Image>
                  </div>
                  <span>{decor.decorName}</span>
                  <ul>
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
              </>
            ))}
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

export default Decoration;
