const express = require("express");
const malls = require("../models/malls");
const Users = require("../models/users");
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
  console.log(eventDate);
  try {
    //To verify the date must not be an past date
    if (new Date(eventDate) <= Date.now()) {
      return res.status(400).send({ message: "Date must not be a past date" });
    }

    // Find the user selected mall
    const selectedMall = await malls.findById({ _id: id });
    const user = await Users.findById(req.user.id);

    const verifyDate = selectedMall.bookedOn.filter((dates) => {
      return dates.date == eventDate;
    });
    //verifying the mall is booked on that date r not
    if (verifyDate.length > 0) {
      return res
        .status(400)
        .send({ message: "Mall already booked on that day" });
    }
    //if user has booked a mall then he cannot book the same mall to other date until that day overs
    const verifyUser = selectedMall.bookedOn.filter((user) => {
      return user.user == req.user.id;
    });
    console.log(verifyUser);
    if (verifyUser.length > 0) {
      return res.status(400).send({
        message: "once previous booking is done then only you can book another",
      });
    }

    // calculate budget
    user.budgetSpent = selectedMall.Price + user.budgetSpent;
    user.budgetLeft = user.budgetLeft - selectedMall.Price;
    await user.save();
    selectedMall.bookedOn.push({ date: eventDate, user: req.user.id });
    selectedMall.bookedBy.push(req.user.id);
    await selectedMall.save();

    res
      .status(200)
      .send({ message: "Mall booked successfully", mallId: selectedMall._id });
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
    const user = await Users.findById(req.user.id);

    const verifyDate = selectedMall.bookedOn.filter((dates) => {
      if (dates.user == req.user.id) {
        return dates.date !== eventDate;
      } else {
        return dates;
      }
    });
    const resetUsers = selectedMall.bookedBy.filter((id) => {
      return id !== req.user.id;
    });
    console.log(verifyDate);
    selectedMall.$set({ bookedOn: verifyDate, bookedBy: resetUsers });
    await selectedMall.save();

    // calculate budget
    user.budgetSpent = user.budgetSpent - selectedMall.Price;
    user.budgetLeft = user.budgetLeft + selectedMall.Price;
    await user.save();
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

// endpoint to get particular Mall by ID

mallsRouter.get("/get/:id", async (req, res) => {
  try {
    const mall = await malls.findById(req.params.id);
    if (!mall) return res.status(404).send({ message: "Mall not found" });

    res.status(200).send(mall);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

module.exports = mallsRouter;
