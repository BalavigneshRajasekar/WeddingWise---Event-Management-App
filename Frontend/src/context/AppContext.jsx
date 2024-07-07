/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState } from "react";
import { message } from "antd";
import axios from "axios";

export const AppContext = createContext();

const ProviderHandler = ({ children }) => {
  const [budget, setBudget] = useState();
  const [budgetLeft, setBudgetLeft] = useState();
  const [openModel, setOpenModel] = useState(false);

  // state for all particular or user selected product details
  const [singleMall, setSingleMall] = useState();
  const [singleCatering, setSingleCatering] = useState();
  const [singleDecoration, setSingleDecoration] = useState();
  const [singleDj, setSingleDj] = useState();
  const [singlePhoto, setSinglePhoto] = useState();

  //State for re render purpose when there is any issue with creating virtual dom we use this
  const [render, setRender] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "https://eventapi-uk2d.onrender.com/api/budget/get",
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success("Budget Fetched");
      setBudget(response.data.budgetSpend);
      setBudgetLeft(response.data.budgetLeft);
    } catch (e) {
      message.error(e.response.data.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        budget,
        budgetLeft,
        singleMall,
        singleCatering,
        singleDecoration,
        singleDj,
        render,
        openModel,
        singlePhoto,
        setSinglePhoto,
        setOpenModel,
        setRender,

        setSingleDj,
        setSingleDecoration,
        setSingleCatering,
        setSingleMall,
        fetchUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ProviderHandler;
