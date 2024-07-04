/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import "./forgotPassword.css";
import { message } from "antd";

function ForgotPassword() {
  const [userMail, setUserMail] = useState();
  const navigate = useNavigate();

  const [code, setCode] = useState(false);
  const [btnLoad, setBtnLoad] = useState(false);

  //This function handle when user enter the Email ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoad(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/password/resetLink",
        {
          userMail,
        }
      );

      localStorage.setItem("resetToken", response.data.data);
      setBtnLoad(false);
      message.success(response.data.message);

      setCode(true);
    } catch (error) {
      console.log(error);
      setBtnLoad(false);
      message.error(error.response.data.message);
    }
  };

  // This function handle when user enters the verification code
  const handleCode = async (e) => {
    let code = e.target.value;
    const token = localStorage.getItem("resetToken");
    if (code.length >= 5) {
      setBtnLoad(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/reset/password",
          { code },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        message.success(response.data.message);
        setBtnLoad(false);
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      } catch (err) {
        message.error(err.response.data.message);
        setBtnLoad(false);
        e.target.value = "";
      }
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap-reverse p-2 gap-5">
      <div className="form-container flex-grow-1">
        <form className="form1 " onSubmit={handleSubmit}>
          <div className="logo-container">Forgot Password</div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              required=""
              onChange={(e) => setUserMail(e.target.value)}
            ></input>
          </div>
          {code && (
            <div className="form-group">
              <label htmlFor="email">Verification code</label>
              <input
                type="text"
                id="email"
                name="code"
                placeholder="Enter your email"
                required=""
                onChange={handleCode}
              ></input>
            </div>
          )}

          <LoadingButton
            variant="contained"
            loading={btnLoad}
            className="form-submit-btn"
            type="submit"
          >
            Send Email
          </LoadingButton>
          <p className="signup-link">
            Don't have an account?
            <Link to={"/"} className="signup-link link">
              {" "}
              Sign up now
            </Link>
          </p>
        </form>
      </div>
      <div>
        <img className="img" src="../otp.jpg"></img>
      </div>
    </div>
  );
}

export default ForgotPassword;
