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
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Form, message, Input } from "antd";
import LoadingButton from "@mui/lab/LoadingButton";
import { SaveFilled } from "@ant-design/icons";
import { Zoom } from "react-slideshow-image";

function SingleDecoration() {
  const [modal, setModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const { singleDecoration, setSingleDecoration } = useContext(AppContext);
  const { id } = useParams();

  useEffect(() => {
    fetchDecor();
  }, []);

  const fetchDecor = async () => {
    try {
      const response = await axios.get(
        `https://eventapi-uk2d.onrender.com/api/decorations/get/${id}`
      );
      setSingleDecoration(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setModal(false);
  };

  const onFinish = async (values) => {
    setBtnLoading(true);
    try {
      const response = await axios.post(
        `https://eventapi-uk2d.onrender.com/api/decorations/book/${id}`,
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading(false);
      handleClose();
      fetchDecor();
    } catch (e) {
      message.error(e.response.data.message);
      setBtnLoading(false);
    }
  };

  const handleBook = (djs) => {
    setModal(true);

    console.log(id);
  };
  const onFinishFailed = () => {};
  return (
    <div>
      <Container>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ marginTop: 3 }}
          onClick={() => navigate("/Decoration")}
        >
          Go Back
        </Button>
        {singleDecoration && (
          <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
            <Zoom canSwipe arrows={false} indicators>
              {singleDecoration.decorImages.map((image, imgIndex) => (
                <Image
                  key={imgIndex}
                  src={image}
                  width="100%"
                  height="300px"
                ></Image>
              ))}
            </Zoom>

            <Typography variant="h3" sx={{ marginTop: 3 }}>
              {singleDecoration.decorName}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              <PlaceIcon />
              {singleDecoration.decorAddress},{singleDecoration.decorCity}
            </Typography>
            <Typography
              variant="h5"
              sx={{ marginTop: 3, fontStyle: "oblique" }}
              className="shadow-lg p-3"
            >
              Description : <span>{singleDecoration.DecorDescription}</span>
            </Typography>
            <h5 className="mt-5 text-success">
              <SettingsIcon /> Menu:
              <ul className="mt-3">
                {singleDecoration.decorType.map((offers, index) => (
                  <li key={index}>{offers}</li>
                ))}
              </ul>
            </h5>

            <Typography
              variant="h6"
              sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
              className="bg-secondary p-3"
            >
              <MailIcon /> Contact : {singleDecoration.decorContact}
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
              className="bg-success p-3"
            >
              Price :<CurrencyRupeeIcon /> {singleDecoration.Price}
            </Typography>
            {singleDecoration.bookedBy.includes(
              localStorage.getItem("userId")
            ) ? (
              <Button
                disabled
                variant="contained"
                fullWidth
                sx={{ marginTop: 3, padding: 2 }}
              >
                Booked
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                sx={{ marginTop: 3, padding: 2 }}
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
    </div>
  );
}

export default SingleDecoration;
