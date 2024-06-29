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

function App() {
  const [userToken, SetUserToken] = useState(true);

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
              {userToken && (
                <>
                  <Route path="/Dj" element={<Dj />}></Route>
                  <Route path="/Catering" element={<Catering />}></Route>
                  <Route path="/Photography" element={<PhotoGraphy />}></Route>
                  <Route path="/Decoration" element={<Decoration />}></Route>
                </>
              )}
            </Routes>
          </BrowserRouter>
        </ProviderHandler>
      </div>
    </>
  );
}

export default App;
