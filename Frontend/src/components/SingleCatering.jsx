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

function SingleCatering() {
  const [modal, setModal] = useState();
  const { singleCatering, setSingleCatering } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCatering();
    console.log(id);
  }, []);
  const fetchCatering = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/catering/get/${id}`
      );
      setSingleCatering(response.data);
    } catch (e) {
      console.log("Error fetching catering", e);
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
          onClick={() => navigate("/Catering")}
        >
          Go Back
        </Button>
        {singleCatering && (
          <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
            <Image
              src={singleCatering.cateringImages[0]}
              width="100%"
              height="300px"
            ></Image>

            <Typography variant="h3" sx={{ marginTop: 3 }}>
              {singleCatering.cateringName}
            </Typography>

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              <PlaceIcon />
              {singleCatering.cateringAddress},{singleCatering.cateringCity}
            </Typography>
            <Typography
              variant="h5"
              sx={{ marginTop: 3, fontStyle: "oblique" }}
              className="shadow-lg p-3"
            >
              Description :<span>{singleCatering.cateringDescription}</span>
            </Typography>

            <h5 className="mt-5 text-success">
              <SettingsIcon /> Menu:
              <ul className="mt-3">
                {singleCatering.cateringMenu.map((offers, index) => (
                  <li key={index}>{offers}</li>
                ))}
              </ul>
            </h5>

            <Typography
              variant="h6"
              sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
              className="bg-secondary p-3"
            >
              <MailIcon /> Contact : {singleCatering.cateringContact}
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginTop: 3, fontWeight: 700, color: "white" }}
              className="bg-success p-3"
            >
              Price :<CurrencyRupeeIcon /> {singleCatering.price}
            </Typography>
            {singleCatering.bookedBy.includes(
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
                color="success"
                fullWidth
                sx={{ marginTop: 3, padding: 2 }}
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

export default SingleCatering;
