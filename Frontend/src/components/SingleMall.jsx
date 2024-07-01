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

function SingleMall() {
  const [modal, setModal] = useState(false);
  const { singleMall, setSingleMall } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchMall();
  }, []);
  const fetchMall = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/malls/get/${id}`
      );
      setSingleMall(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setModal(false);
  };

  const onFinish = (values) => {
    console.log(values);
    console.log(id);
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
          onClick={() => navigate("/home")}
        >
          Go Back
        </Button>
        {singleMall && (
          <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
            <Image
              src={singleMall.mallImages[0]}
              width="100%"
              height="300px"
            ></Image>
            <Typography variant="h3" sx={{ marginTop: 3 }}>
              {singleMall.mallName}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              <PlaceIcon />
              {singleMall.mallAddress},{singleMall.mallCity}
            </Typography>
            <h5 className="mt-5 text-success">
              <SettingsIcon /> Amenities:
              <ul className="mt-3">
                {singleMall.amenities.map((offers, index) => (
                  <li key={index}>{offers}</li>
                ))}
              </ul>
            </h5>
            <Typography
              variant="h6"
              sx={{
                marginTop: 3,
                fontWeight: 700,
                backgroundColor: "purple",
                color: "white",
                padding: 3,
              }}
            >
              Spacing : {singleMall.spacing}{" "}
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
              className="bg-secondary p-3"
            >
              <MailIcon /> Contact : {singleMall.mallContact}
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
              className="bg-success p-3"
            >
              Price :<CurrencyRupeeIcon /> {singleMall.Price}
            </Typography>
            {singleMall.bookedBy.includes(localStorage.getItem("userId")) ? (
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

export default SingleMall;
