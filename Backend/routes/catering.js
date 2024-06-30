const express = require("express");
const Catering = require("../models/catering");
const Users = require("../models/users");
const loginAuth = require("../middlewares/loginAuth");
const roleAuth = require("../middlewares/roleAuth");
const upload = require("../middlewares/multerMiddleware");

const cateringRouter = express.Router();

// endpoint to add catering to the DB(Admin)

cateringRouter.post(
  "/add",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const {
      cateringName,
      cateringDescription,
      cateringAddress,
      cateringCity,
      cateringMenu,
      cateringContact,
      price,
    } = req.body;

    try {
      const verifyCatering = await Catering.findOne({
        cateringContact: cateringContact,
      });
      if (verifyCatering) {
        return res.status(400).json({ message: "Catering already exists" });
      }
      const newCatering = new Catering({
        cateringName,
        cateringDescription,
        cateringAddress,
        cateringCity,
        cateringContact,
        cateringMenu: cateringMenu.split(","),
        cateringImages: `http://localhost:3000/mallImages/${req.file.filename}`,
        price,
      });

      await newCatering.save();
      res.status(200).json({ message: "Catering added successfully" });
    } catch (errors) {
      res.status(500).send({ message: "server error", error: errors });
    }
  }
);

// endpoint to get all the catering

cateringRouter.get("/get", async (req, res) => {
  try {
    const allCaterings = await Catering.find({});
    res.status(200).send(allCaterings);
  } catch (err) {
    res.status(500).send({ message: "server error", error: err });
  }
});

// endpoint to book an catering handlers

cateringRouter.post("/book/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;

  try {
    //To verify the date must not be an past date
    if (eventDate < new Date().toLocaleDateString()) {
      return res.status(400).send({ message: "Date must not be a past date" });
    }

    // Find the user selected catering
    const selectedCater = await Catering.findById({ _id: id });
    const user = await Users.findById(req.user.id);
    const verifyDate = selectedCater.bookedOn.filter((dates) => {
      return dates.date == eventDate;
    });
    //verifying the catering is booked on that date r not
    if (verifyDate.length > 0) {
      return res
        .status(400)
        .send({ message: "catering already booked on that day" });
    }
    //if user has booked a catering then he cannot book the same catering to other date until that day overs
    const verifyUser = selectedCater.bookedOn.filter((user) => {
      return user.user == req.user.id;
    });
    console.log(verifyUser);
    if (verifyUser.length > 0) {
      return res.status(400).send({
        message: "once previous booking is done then only you can book another",
      });
    }

    selectedCater.bookedOn.push({ date: eventDate, user: req.user.id });
    await selectedCater.save();
    // calculate budget
    user.budgetSpent = selectedCater.price + user.budgetSpent;
    user.budgetLeft = user.budgetLeft - selectedCater.price;
    await user.save();
    res.status(200).send({ message: "Catering booked successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to remove Booking for a particular user
cateringRouter.post("/remove/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;
  try {
    const selectedCater = await Catering.findById({ _id: id });
    const user = await Users.findById(req.user.id);

    const verifyDate = selectedCater.bookedOn.filter((dates) => {
      if (dates.user == req.user.id) {
        return dates.date !== eventDate;
      } else {
        return dates;
      }
    });
    console.log(verifyDate);
    selectedCater.$set({ bookedOn: verifyDate });
    await selectedCater.save();

    // calculate budget
    user.budgetSpent = user.budgetSpent - selectedCater.price;
    user.budgetLeft = user.budgetLeft + selectedCater.price;
    await user.save();

    res.status(200).send({ message: "remove booking successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

// endpoint to show particular user bookings for dashboard

cateringRouter.get("/dashboard", loginAuth, async (req, res) => {
  try {
    const userBookings = await Catering.find({
      "bookedOn.user": req.user.id,
    });
    res.status(200).send(userBookings);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to get particular Catering by ID
cateringRouter.get("/get/:id", async (req, res) => {
  try {
    const catering = await Catering.findById(req.params.id);
    if (!catering) {
      return res.status(404).send({ message: "Catering not found" });
    }
    res.status(200).send(catering);
  } catch (err) {
    res.status(500).send({ message: "Server error: " + err.message });
  }
});

module.exports = cateringRouter;
