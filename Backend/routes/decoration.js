const express = require("express");
const Decor = require("../models/decorations");
const loginAuth = require("../middlewares/loginAuth");
const roleAuth = require("../middlewares/roleAuth");
const upload = require("../middlewares/multerMiddleware");

const decorRouter = express.Router();

// endpoint to add decoration to the DB(Admin)

decorRouter.post(
  "/add",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const {
      decorName,
      DecorDescription,
      decorAddress,
      decorCity,
      decorType,
      decorContact,

      Price,
    } = req.body;

    try {
      const verifyDecor = await Decor.findOne({ decorContact: decorContact });
      if (verifyDecor) {
        return res.status(400).json({ message: "Decoration already exists" });
      }
      const newDecor = new Decor({
        decorName,
        DecorDescription,
        decorAddress,
        decorCity,
        decorContact,
        decorType: decorType.split(","),
        decorImages: `http://localhost:3000/mallImages/${req.file.filename}`,
        Price,
      });

      await newDecor.save();
      res.status(200).json({ message: "Decoration added successfully" });
    } catch (errors) {
      res.status(500).send({ message: "server error", error: errors });
    }
  }
);

// endpoint to get all the decorations

decorRouter.get("/get", async (req, res) => {
  try {
    const allDecorations = await Decor.find({});
    res.status(200).send(allDecorations);
  } catch (err) {
    res.status(500).send({ message: "server error", error: err });
  }
});

// endpoint to book an Decoration handlers

decorRouter.post("/book/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;

  try {
    //To verify the date must not be an past date
    if (eventDate < new Date().toLocaleDateString()) {
      return res.status(400).send({ message: "Date must not be a past date" });
    }

    // Find the user selected Decor
    const selectedMall = await Decor.findById({ _id: id });
    const verifyDate = selectedMall.bookedOn.filter((dates) => {
      return dates.date == eventDate;
    });
    //verifying the mall is booked on that date r not
    if (verifyDate.length > 0) {
      return res
        .status(400)
        .send({ message: "Decor already booked on that day" });
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

    selectedMall.bookedOn.push({ date: eventDate, user: req.user.id });
    await selectedMall.save();
    res.status(200).send({ message: "Decor booked successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to remove Booking for a particular user
decorRouter.post("/remove/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;
  try {
    const selectedMall = await Decor.findById({ _id: id });

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

decorRouter.get("/dashboard", loginAuth, async (req, res) => {
  try {
    const userBookings = await Decor.find({
      "bookedOn.user": req.user.id,
    });
    res.status(200).send(userBookings);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

module.exports = decorRouter;
