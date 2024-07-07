const express = require("express");
const loginAuth = require("../middlewares/loginAuth");
const roleAuth = require("../middlewares/roleAuth");
const upload = require("../middlewares/multerMiddleware");
const DJ = require("../models/dj");
const Users = require("../models/users");

const djRouter = express.Router();

// endpoint to add DJ to the DB(Admin)

djRouter.post(
  "/add",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const {
      djName,
      djDescription,
      djAddress,
      djCity,
      djContact,
      price,
      musicType,
    } = req.body;

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
        musicType: musicType.split(","),
        djImages: `https://eventapi-uk2d.onrender.com/mallImages/${req.file.filename}`,
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
    if (new Date(eventDate) <= Date.now()) {
      return res.status(400).send({ message: "Date must not be a past date" });
    }

    // Find the user selected catering
    const selectedDJ = await DJ.findById({ _id: id });
    const user = await Users.findById(req.user.id);
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
    selectedDJ.bookedBy.push(req.user.id);
    // calculate budget
    user.budgetSpent = selectedDJ.price + user.budgetSpent;
    user.budgetLeft = user.budgetLeft - selectedDJ.price;
    await user.save();
    await selectedDJ.save();

    res.status(200).send({
      message: "Booked successfully our Admin will contact you shortly",
    });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to remove Booking for a particular user
djRouter.delete("/remove/:id", loginAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const selectedDJ = await DJ.findById({ _id: id });
    const user = await Users.findById(req.user.id);

    const verifyDate = selectedDJ.bookedOn.filter((dates) => {
      return dates.user !== req.user.id;
    });
    const resetUser = selectedDJ.bookedBy.filter((user) => {
      return user !== req.user.id;
    });
    console.log(verifyDate);
    selectedDJ.$set({ bookedOn: verifyDate, bookedBy: resetUser });
    // calculate budget
    user.budgetSpent = user.budgetSpent - selectedDJ.price;
    user.budgetLeft = user.budgetLeft + selectedDJ.price;
    await user.save();

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

//endpoint to show particular dj by ID

djRouter.get("/get/:id", async (req, res) => {
  try {
    const dj = await DJ.findById(req.params.id);
    res.status(200).send(dj);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to edit DJ Admin
djRouter.put(
  "/edit/:id",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const { id } = req.params;
    const {
      djName,
      djDescription,
      djAddress,
      djCity,
      djContact,
      price,
      musicType,
    } = req.body;

    try {
      const verify = await DJ.findOne({
        djContact: djContact,
      });
      if (verify) {
        if (verify._id !== id) {
          return res
            .status(400)
            .send({ message: "contact already used in some vendors" });
        }
      }
      const updatedMall = await DJ.findByIdAndUpdate(
        id,
        {
          djName,
          djDescription,
          djAddress,
          djCity,
          djContact,
          price,
          musicType: musicType.split(","),
          djImages: `https://eventapi-uk2d.onrender.com/mallImages/${req.file.filename}`,
        },
        { new: true, runValidators: true }
      );

      return res
        .status(200)
        .send({ message: "update successfully", data: updatedMall });
    } catch (e) {
      return res
        .status(400)
        .send({ message: "Update failed", data: e.message });
    }
  }
);

// Endpoint to delete the Dj
djRouter.delete(
  "/delete/:id",
  loginAuth,
  roleAuth("Admin"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const mall = await DJ.findByIdAndDelete(id);
      console.log(mall);
      if (!mall) return res.status(404).send({ message: "DJ not found" });
      res.status(200).send({ message: "DJ deleted successfully" });
    } catch (e) {
      return res
        .status(500)
        .send({ message: "Delete failed", data: e.message });
    }
  }
);

module.exports = djRouter;
