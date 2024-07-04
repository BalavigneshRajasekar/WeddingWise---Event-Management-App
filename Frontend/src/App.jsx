/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import ProviderHandler from "./context/AppContext";
import Dj from "./Routes/Dj";
import Catering from "./Routes/Catering";
import PhotoGraphy from "./Routes/PhotoGraphy";
import Decoration from "./Routes/Decoration";
import SingleMall from "./components/SingleMall";
import SingleCatering from "./components/SingleCatering";
import SingleDecoration from "./components/SingleDecoration";
import SingleDj from "./components/SingleDj";
import Dashboard from "./Routes/Dashboard";
import SinglePhoto from "./components/SinglePhoto";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <>
      <div>
        <ProviderHandler>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="forgotPassword" element={<ForgotPassword />}></Route>

              <Route path="/home" element={<Home />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>

              <Route path="/Dj" element={<Dj />}></Route>
              <Route path="/Catering" element={<Catering />}></Route>
              <Route path="/Photography" element={<PhotoGraphy />}></Route>
              <Route path="/Decoration" element={<Decoration />}></Route>
              <Route path="/mall/:id" element={<SingleMall />}></Route>
              <Route path="/catering/:id" element={<SingleCatering />}></Route>
              <Route path="/Dj/:id" element={<SingleDj />}></Route>
              <Route
                path="/decoration/:id"
                element={<SingleDecoration />}
              ></Route>
              <Route path="/photo/:id" element={<SinglePhoto />}></Route>
            </Routes>
          </BrowserRouter>
        </ProviderHandler>
      </div>
    </>
  );
}

export default App;
