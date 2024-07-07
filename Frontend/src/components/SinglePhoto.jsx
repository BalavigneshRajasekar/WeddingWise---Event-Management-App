/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Paper from "@mui/material/Paper";
import { Button, Container, Typography } from "@mui/material";
import { Image } from "antd";
import PlaceIcon from "@mui/icons-material/Place";
import SettingsIcon from "@mui/icons-material/Settings";
import MailIcon from "@mui/icons-material/Mail";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Form, message, Input } from "antd";
import axios from "axios";

function SinglePhoto() {
  const [modal, setModal] = useState(false);
  const { singlePhoto, setSinglePhoto } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhoto();
  }, []);

  const fetchPhoto = async () => {
    try {
      const response = await axios.get(
        `https://eventapi-uk2d.onrender.com/api/photography/get/${id}`
      );
      setSinglePhoto(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setModal(false);
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `https://eventapi-uk2d.onrender.com/api/photography/book/${id}`,
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      handleClose();
      fetchPhoto();
    } catch (e) {
      message.error(e.response.data.message);
    }
  };

  const handleBook = () => {
    setModal(true);
  };
  const onFinishFailed = () => {};
  return (
    <div>
      <Container>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ marginTop: 3 }}
          onClick={() => navigate("/Photography")}
        >
          Go Back
        </Button>
        {singlePhoto && (
          <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
            <Image
              src={singlePhoto.photographyImages[0]}
              width="100%"
              height="300px"
            ></Image>
            <Typography variant="h3" sx={{ marginTop: 3 }}>
              {singlePhoto.photographyName}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              <PlaceIcon />
              {singlePhoto.photographyAddress},{singlePhoto.photographyCity}
            </Typography>
            <Typography
              variant="h5"
              sx={{ marginTop: 3, fontStyle: "oblique" }}
              className="shadow-lg p-3"
            >
              Description : <span>{singlePhoto.photographyDescription}</span>
            </Typography>
            <h5 className="mt-5 text-success">
              <SettingsIcon /> Types:
              <ul className="mt-3">
                {singlePhoto.photographyType.map((offers, index) => (
                  <li key={index}>{offers}</li>
                ))}
              </ul>
            </h5>

            <Typography
              variant="h6"
              sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
              className="bg-secondary p-3"
            >
              <MailIcon /> Contact : {singlePhoto.photographyContact}
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
              className="bg-success p-3"
            >
              Price :<CurrencyRupeeIcon /> {singlePhoto.Price}
            </Typography>
            {singlePhoto.bookedBy.includes(localStorage.getItem("userId")) ? (
              <Button
                fullWidth
                sx={{ marginTop: 3 }}
                disabled
                variant="contained"
              >
                Booked
              </Button>
            ) : (
              <Button
                fullWidth
                sx={{ marginTop: 3 }}
                variant="contained"
                color="success"
                onClick={() => handleBook()}
              >
                Book
              </Button>
            )}
          </Paper>
        )}
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

export default SinglePhoto;
