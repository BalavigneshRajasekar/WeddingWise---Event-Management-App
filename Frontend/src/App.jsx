/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [images, setImages] = useState();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const response = await axios.get("http://localhost:3000/api/malls/get");

    console.log(response.data[0].mallImages[0]);
    setImages(response.data[0].mallImages[0]);
  };

  return (
    <>
      <div>
        <h1>image</h1>
        <img src={images}></img>
      </div>
    </>
  );
}

export default App;
