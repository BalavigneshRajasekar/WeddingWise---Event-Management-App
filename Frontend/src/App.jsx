/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import ProviderHandler from "./context/AppContext";

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
              <Route path="/home" element={<Home />}></Route>
            </Routes>
          </BrowserRouter>
        </ProviderHandler>
      </div>
    </>
  );
}

export default App;
