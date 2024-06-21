const express = require("express");
const malls = require("../models/malls");
const loginAuth = require("../middlewares/loginAuth");
const roleAuth = require("../middlewares/roleAuth");
const upload = require("../middlewares/multerMiddleware");

const mallsRouter = express.Router();

// endpoint to add mall to the DB
mallsRouter.post(
  "/add",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const {
      mallName,
      mallAddress,
      mallCity,
      mallContact,
      spacing,
      amenities,
      Price,
    } = req.body;

    try {
      const verify = await malls.findOne({ mallContact: mallContact });
      if (verify) {
        return res.status(400).send({ message: "Mall already exists" });
      }
      console.log(req.file);
      const newMall = new malls({
        mallName,
        mallAddress,
        mallCity,
        mallImages: `http://localhost:3000/mallImages/${req.file.filename}`,
        mallContact,
        spacing,
        amenities: amenities.split(","),
        Price,
      });

      await newMall.save();

      res.status(200).send({ message: "Mall registered successfully" });
    } catch (err) {
      res.status(500).send({ message: "server error: ", err: err.message });
    }
  }
);

//Endpoint to get the mall

mallsRouter.get("/get", async (req, res) => {
  try {
    const allMalls = await malls.find({});
    res.status(200).send(allMalls);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to book the mall

mallsRouter.post("/book/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;

  try {
    //To verify the date must not be an past date
    if (eventDate < new Date().toLocaleDateString()) {
      return res.status(400).send({ message: "Date must not be a past date" });
    }

    // Find the user selected mall
    const selectedMall = await malls.findById({ _id: id });
    const verifyDate = selectedMall.bookedOn.filter((dates) => {
      return dates.date == eventDate;
    });
    //verifying the mall is booked on that date r not
    if (verifyDate.length > 0) {
      return res
        .status(400)
        .send({ message: "Mall already booked on that day" });
    }

    selectedMall.bookedOn.push({ date: eventDate, user: req.user.id });
    await selectedMall.save();
    res.status(200).send({ message: "Mall booked successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to remove Booking for a particular user
mallsRouter.post("/remove/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;
  try {
    const selectedMall = await malls.findById({ _id: id });

    const verifyDate = selectedMall.bookedOn.filter((dates) => {
      if (dates.user == req.user.id) {
        return dates.date !== eventDate;
      } else {
        return dates;
      }
    });
    console.log(verifyDate);
    selectedMall.$set({ bookedOn: verifyDate });
    await selectedMall.save();
    res.status(200).send({ message: "remove booking successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

// endpoint to show particular user bookings for dashboard

mallsRouter.get("/dashboard", loginAuth, async (req, res) => {
  try {
    const userBookings = await malls.find({
      "bookedOn.user": req.user.id,
    });
    res.status(200).send(userBookings);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

module.exports = mallsRouter;
