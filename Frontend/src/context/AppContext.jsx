/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState } from "react";
import { message } from "antd";
import axios from "axios";

export const AppContext = createContext();

const ProviderHandler = ({ children }) => {
  const [budget, setBudget] = useState();
  const [budgetLeft, setBudgetLeft] = useState();

  // state for all particular product details
  const [singleMall, setSingleMall] = useState();
  const [singleCatering, setSingleCatering] = useState();
  const [singleDecoration, setSingleDecoration] = useState();
  const [singleDj, setSingleDj] = useState();

  //State for product Booking ID

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/budget/get", {
        headers: {
          Authorization: localStorage.getItem("logToken"),
        },
      });
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
