/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

function Home() {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState(localStorage.getItem("logToken"));
  //Checking user has token r not
  useEffect(() => {
    if (!userToken) {
      navigate("/");
    } else {
      navigate("/home");
    }
    console.log(userToken);
  }, [userToken]);
  return (
    <div>
      <Nav></Nav>
      <h1>home</h1>
    </div>
  );
}

export default Home;
