/* eslint-disable no-unused-vars */
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Button, Container, FormControl, Typography } from "@mui/material";
import { Image, message, Empty } from "antd";
import React, { useEffect, useRef, useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DeleteOutlined } from "@ant-design/icons";
import CancelIcon from "@mui/icons-material/Cancel";

function Dashboard() {
  const navigate = useNavigate();
  const [bookedMall, setBookedMall] = useState([]);
  const [bookedDj, setBookedDj] = useState([]);
  const [bookedDecor, setBookedDecor] = useState([]);
  const [bookedCater, setBookedCater] = useState([]);
  const [bookedPhoto, setBookedPhoto] = useState([]);
  const [btnLoading, setBtnLoading] = useState({
    mall: false,
    dj: false,
    decor: false,
    cater: false,
    photo: false,
  });

  useEffect(() => {
    fetchBookedMall();
    fetchBookedDj();
    fetchBookedDecor();
    fetchCatering();
    fetchPhoto();
  }, []);

  //Handle Fetching booked Mall while component load
  const fetchBookedMall = async () => {
    try {
      const response = await axios.get(
        "https://eventapi-uk2d.onrender.com/api/malls/dashboard",
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedMall(response.data);
    } catch (e) {
      message.error(e.response.data.message);
    }
  };
  //Handle the Canceling of the Booked mall
  const handleMallCanceling = async (mall) => {
    setBtnLoading({ ...btnLoading, mall: true });
    try {
      const response = await axios.delete(
        `https://eventapi-uk2d.onrender.com/api/malls/remove/${mall._id}`,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading({ ...btnLoading, [mall]: false });
      fetchBookedMall();
    } catch (e) {
      message.error(e.response.data.message);
      setBtnLoading({ ...btnLoading, [mall]: false });
    }
  };
  //Handle Fetching booked Dj while component load
  const fetchBookedDj = async () => {
    try {
      const response = await axios.get(
        "https://eventapi-uk2d.onrender.com/api/dj/dashboard",
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedDj(response.data);
    } catch (e) {
      message.error(e.response.data.message);
    }
  };
  //Handle the Canceling of the Booked DJ
  const handleDjCanceling = async (dj) => {
    setBtnLoading({ ...btnLoading, dj: true });
    try {
      const response = await axios.delete(
        `https://eventapi-uk2d.onrender.com/api/dj/remove/${dj._id}`,

        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading({ ...btnLoading, dj: false });
      fetchBookedDj();
    } catch (e) {
      message.error(e.response.data.message);
      setBtnLoading({ ...btnLoading, dj: false });
    }
  };
  //Handle Fetching booked Decor while component load
  const fetchBookedDecor = async (mall) => {
    try {
      const response = await axios.get(
        "https://eventapi-uk2d.onrender.com/api/decorations/dashboard",
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedDecor(response.data);
    } catch (e) {
      message.error(e.response.data.message);
    }
  };
  //Handle the Canceling of the Booked Decor
  const handleDecorCanceling = async (decor) => {
    setBtnLoading({ ...btnLoading, decor: true });
    console.log(bookedDecor);
    try {
      const response = await axios.delete(
        `https://eventapi-uk2d.onrender.com/api/decorations/remove/${decor._id}`,

        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading({ ...btnLoading, decor: false });
      fetchBookedDecor();
    } catch (e) {
      message.error(e.response.data.message);
      setBtnLoading({ ...btnLoading, decor: false });
    }
  };
  //Handle Fetching booked catering while component load
  const fetchCatering = async () => {
    try {
      const response = await axios.get(
        `https://eventapi-uk2d.onrender.com/api/catering/dashboard`,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedCater(response.data);
    } catch (e) {
      message.error(e.response.data.message);
    }
  };
  //Handle the Canceling of the Booked catering
  const handleCaterCanceling = async (mall) => {
    setBtnLoading({ ...btnLoading, cater: true });
    try {
      const response = await axios.delete(
        `https://eventapi-uk2d.onrender.com/api/catering/remove/${mall._id}`,

        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading({ ...btnLoading, cater: false });
      fetchCatering();
    } catch (e) {
      message.error(e.response.data.message);
      setBtnLoading({ ...btnLoading, cater: false });
    }
  };

  //Handle Fetching booked PhotoGraphy while component load
  const fetchPhoto = async () => {
    try {
      const response = await axios.get(
        `https://eventapi-uk2d.onrender.com/api/photography/dashboard`,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      setBookedPhoto(response.data);
    } catch (e) {
      message.error(e.response.data.message);
    }
  };
  //Handle the Canceling of the Booked Photo
  const handlePhotoCanceling = async (photo) => {
    setBtnLoading({ ...btnLoading, photo: true });
    try {
      const response = await axios.delete(
        `https://eventapi-uk2d.onrender.com/api/photography/remove/${photo._id}`,

        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setBtnLoading({ ...btnLoading, photo: false });
      fetchPhoto();
    } catch (e) {
      message.error(e.response.data.message);
      setBtnLoading({ ...btnLoading, photo: false });
    }
  };
  return (
    <div>
      <Container>
        <Typography
          variant="h4"
          sx={{ marginTop: 5, backgroundColor: "blueviolet", fontWeight: 700 }}
          className="p-3 text-light"
        >
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{ marginTop: 5 }}
          onClick={() => navigate("/home")}
        >
          Go Back
        </Button>
        {(bookedMall.length > 0) |
        (bookedDj.length > 0) |
        (bookedDecor.length > 0) |
        (bookedPhoto.length > 0) |
        (bookedCater.length > 0) ? (
          <div>
            <div className="mt-5 ">
              {bookedMall.length > 0 && (
                <>
                  <Typography variant="h6">Booked Mall :</Typography>
                  <div className="d-flex">
                    {bookedMall.map((mall, index) => (
                      <div
                        key={index}
                        className="card"
                        style={{ width: "300px", minHeight: "200px" }}
                      >
                        <div className="card-border-top"></div>
                        <div className="img">
                          <Image
                            src={mall.mallImages[0]}
                            width="100%"
                            height="150px"
                          ></Image>
                        </div>
                        <span>{mall.mallName}</span>

                        <p>
                          <PlaceIcon />
                          {mall.mallAddress + "," + mall.mallCity}
                        </p>
                        <p className="job">Price: {mall.Price}</p>
                        <div>
                          <Button
                            color="success"
                            variant="outlined"
                            disabled
                            fullWidth
                          >
                            Scheduled ON :{" "}
                            {mall.bookedOn.map((user) => {
                              if (user.user == localStorage.getItem("userId")) {
                                return user.date;
                              }
                            })}
                          </Button>
                          <FormControl className="mt-3 d-flex">
                            <LoadingButton
                              fullWidth
                              loading={btnLoading.mall}
                              size="large"
                              variant="contained"
                              color="error"
                              type="Submit"
                              placeholder="Book"
                              name="eventName"
                              onClick={() => handleMallCanceling(mall)}
                            >
                              Cancel Booking
                            </LoadingButton>
                          </FormControl>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 ">
              {bookedDj.length > 0 && (
                <>
                  <Typography variant="h6">Booked Dj :</Typography>
                  <div className="d-flex">
                    {bookedDj.map((mall, index) => (
                      <div
                        key={index}
                        className="card"
                        style={{ width: "300px" }}
                      >
                        <div className="card-border-top"></div>
                        <div className="img">
                          <Image
                            src={mall.djImages[0]}
                            width="100%"
                            height="150px"
                          ></Image>
                        </div>
                        <span>{mall.djName}</span>

                        <p>
                          <PlaceIcon />
                          {mall.djAddress + "," + mall.djCity}
                        </p>
                        <p className="job">Price: {mall.price}</p>
                        <div>
                          <Button
                            color="success"
                            variant="outlined"
                            disabled
                            fullWidth
                          >
                            Scheduled ON :{" "}
                            {mall.bookedOn.map((user) => {
                              if (user.user == localStorage.getItem("userId")) {
                                return user.date;
                              }
                            })}
                          </Button>
                          <FormControl className="mt-3 d-flex">
                            <LoadingButton
                              fullWidth
                              loading={btnLoading.dj}
                              size="large"
                              variant="contained"
                              color="error"
                              type="Submit"
                              placeholder="Book"
                              name="eventName"
                              onClick={() => handleDjCanceling(mall)}
                            >
                              Cancel Booking
                            </LoadingButton>
                          </FormControl>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 ">
              {bookedDecor.length > 0 && (
                <>
                  <Typography variant="h6">Booked Decor :</Typography>
                  <div className="d-flex">
                    {bookedDecor.map((mall, index) => (
                      <div
                        key={index}
                        className="card"
                        style={{ width: "300px" }}
                      >
                        <div className="card-border-top"></div>
                        <div className="img">
                          <Image
                            src={mall.decorImages[0]}
                            width="100%"
                            height="150px"
                          ></Image>
                        </div>
                        <span>{mall.decorName}</span>

                        <p>
                          <PlaceIcon />
                          {mall.decorAddress + "," + mall.decorCity}
                        </p>
                        <p className="job">Price: {mall.Price}</p>
                        <div>
                          <Button
                            color="success"
                            variant="outlined"
                            disabled
                            fullWidth
                          >
                            Scheduled ON :{" "}
                            {mall.bookedOn.map((user) => {
                              if (user.user == localStorage.getItem("userId")) {
                                return user.date;
                              }
                            })}
                          </Button>
                          <LoadingButton
                            className="mt-3"
                            fullWidth
                            loading={btnLoading.decor}
                            size="large"
                            variant="contained"
                            color="error"
                            type="Submit"
                            placeholder="Book"
                            name="eventName"
                            onClick={() => handleDecorCanceling(mall)}
                          >
                            Cancel Booking
                          </LoadingButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 ">
              {bookedCater.length > 0 && (
                <>
                  <Typography variant="h6">Booked Catering :</Typography>
                  <div className="d-flex">
                    {bookedCater.map((mall, index) => (
                      <div
                        key={index}
                        className="card"
                        style={{ width: "300px" }}
                      >
                        <div className="card-border-top"></div>
                        <div className="img">
                          <Image
                            src={mall.cateringImages[0]}
                            width="100%"
                            height="150px"
                          ></Image>
                        </div>
                        <span>{mall.cateringName}</span>

                        <p>
                          <PlaceIcon />
                          {mall.cateringAddress + "," + mall.cateringCity}
                        </p>
                        <p className="job">Price: {mall.price}</p>
                        <div>
                          <Button
                            color="success"
                            variant="outlined"
                            disabled
                            fullWidth
                          >
                            Scheduled ON :{" "}
                            {mall.bookedOn.map((user) => {
                              if (user.user == localStorage.getItem("userId")) {
                                return user.date;
                              }
                            })}
                          </Button>
                          <LoadingButton
                            className="mt-3"
                            fullWidth
                            loading={btnLoading.cater}
                            size="large"
                            variant="contained"
                            color="error"
                            type="Submit"
                            placeholder="Book"
                            name="eventName"
                            onClick={() => handleCaterCanceling(mall)}
                          >
                            Cancel Booking
                          </LoadingButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 ">
              {bookedPhoto.length > 0 && (
                <>
                  <Typography variant="h6">Booked PhotoGraphy :</Typography>
                  <div className="d-flex">
                    {bookedPhoto.map((photo, index) => (
                      <div
                        key={index}
                        className="card"
                        style={{ width: "300px" }}
                      >
                        <div className="card-border-top"></div>
                        <div className="img">
                          <Image
                            src={photo.photographyImages[0]}
                            width="100%"
                            height="150px"
                          ></Image>
                        </div>
                        <span>{photo.photographyName}</span>

                        <p>
                          <PlaceIcon />
                          {photo.photographyAddress +
                            "," +
                            photo.photographyCity}
                        </p>
                        <p className="job">Price: {photo.Price}</p>
                        <div>
                          <Button
                            color="success"
                            variant="outlined"
                            disabled
                            fullWidth
                          >
                            Scheduled ON :{" "}
                            {photo.bookedOn.map((user) => {
                              if (user.user == localStorage.getItem("userId")) {
                                return user.date;
                              }
                            })}
                          </Button>
                          <LoadingButton
                            className="mt-3"
                            fullWidth
                            loading={btnLoading.photo}
                            size="large"
                            variant="contained"
                            color="error"
                            type="Submit"
                            placeholder="Book"
                            name="eventName"
                            onClick={() => handlePhotoCanceling(photo)}
                          >
                            Cancel Booking
                          </LoadingButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
