const express = require("express");

const Catering = require("../models/catering");
const loginAuth = require("../middlewares/loginAuth");
const roleAuth = require("../middlewares/roleAuth");
const upload = require("../middlewares/multerMiddleware");
const DJ = require("../models/dj");

const djRouter = express.Router();

// endpoint to add DJ to the DB(Admin)

djRouter.post(
  "/add",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const { djName, djDescription, djAddress, djCity, djContact, price } =
      req.body;

    try {
      const verifyDJ = await DJ.findOne({
        djContact: djContact,
      });
      if (verifyDJ) {
        return res.status(400).json({ message: "DJ already exists" });
      }
      const newDJ = new DJ({
        djName,
        djDescription,
        djAddress,
        djCity,
        djContact,
        djImages: `http://localhost:3000/mallImages/${req.file.filename}`,
        price,
      });

      await newDJ.save();
      res.status(200).json({ message: "DJ added successfully" });
    } catch (errors) {
      res.status(500).send({ message: "server error", error: errors });
    }
  }
);

// endpoint to get all the DJ

djRouter.get("/get", async (req, res) => {
  try {
    const allDJ = await DJ.find({});
    res.status(200).send(allDJ);
  } catch (err) {
    res.status(500).send({ message: "server error", error: err });
  }
});

// endpoint to book an DJ handlers

djRouter.post("/book/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;

  try {
    //To verify the date must not be an past date
    if (eventDate < new Date().toLocaleDateString()) {
      return res.status(400).send({ message: "Date must not be a past date" });
    }

    // Find the user selected catering
    const selectedDJ = await DJ.findById({ _id: id });
    const verifyDate = selectedDJ.bookedOn.filter((dates) => {
      return dates.date == eventDate;
    });
    //verifying the catering is booked on that date r not
    if (verifyDate.length > 0) {
      return res.status(400).send({ message: "DJ already booked on that day" });
    }
    //if user has booked a catering then he cannot book the same catering to other date until that day overs
    const verifyUser = selectedDJ.bookedOn.filter((user) => {
      return user.user == req.user.id;
    });
    console.log(verifyUser);
    if (verifyUser.length > 0) {
      return res.status(400).send({
        message: "once previous booking is done then only you can book another",
      });
    }

    selectedDJ.bookedOn.push({ date: eventDate, user: req.user.id });
    await selectedDJ.save();
    res.status(200).send({ message: "DJ booked successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to remove Booking for a particular user
djRouter.post("/remove/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;
  try {
    const selectedDJ = await DJ.findById({ _id: id });

    const verifyDate = selectedDJ.bookedOn.filter((dates) => {
      if (dates.user == req.user.id) {
        return dates.date !== eventDate;
      } else {
        return dates;
      }
    });
    console.log(verifyDate);
    selectedDJ.$set({ bookedOn: verifyDate });

    await selectedDJ.save();
    res.status(200).send({ message: "remove booking successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

// endpoint to show particular user bookings for dashboard

djRouter.get("/dashboard", loginAuth, async (req, res) => {
  try {
    const userBookings = await DJ.find({
      "bookedOn.user": req.user.id,
    });
    res.status(200).send(userBookings);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

module.exports = djRouter;
