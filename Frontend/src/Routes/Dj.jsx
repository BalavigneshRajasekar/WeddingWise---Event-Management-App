/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { Container, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input, Segmented, Image } from "antd";
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FormControl } from "@mui/material";
import { Form, message } from "antd";
const { Search } = Input;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function Dj() {
  const [dj, setDj] = useState();
  const [id, setId] = useState();
  const [modal, setModal] = useState();

  useEffect(() => {
    fetchDj();
    if (!localStorage.getItem("logToken")) {
      navigate("/");
    } else {
      navigate("/Dj");
    }
  }, []);
  const fetchDj = async () => {
    const response = await axios.get("http://localhost:3000/api/dj/get");
    setDj(response.data);
  };
  const navigate = useNavigate();
  const onSearch = (values) => {
    console.log(values);
  };
  const singleDj = (djs, e) => {
    if (e.target.tagName == "BUTTON") {
      return;
    }
    navigate(`/Dj/${djs._id}`);
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
    setId(djs._id);
    console.log(id);
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
          {dj &&
            dj.map((djs, index) => (
              <>
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
                  <ul>
                    {djs.musicType.map((offers, index1) => (
                      <li key={index1}> {offers}</li>
                    ))}
                  </ul>
                  <p>
                    <PlaceIcon />
                    {djs.djAddress + "," + djs.djCity}
                  </p>
                  <p className="job">Price: {djs.price}</p>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={() => handleBook(djs)}
                  >
                    Book
                  </Button>
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
          <Box sx={style}>
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

export default Dj;
