const express = require("express");
const Decor = require("../models/decorations");
const Users = require("../models/users");
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
        decorImages: `https://apieventmanagement.onrender.com/mallImages/${req.file.filename}`,
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
    if (new Date(eventDate) <= Date.now()) {
      return res.status(400).send({ message: "Date must not be a past date" });
    }

    // Find the user selected Decor
    const selectedMall = await Decor.findById({ _id: id });
    const user = await Users.findById(req.user.id);
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
    selectedMall.bookedBy.push(req.user.id);
    // calculate budget
    user.budgetSpent = selectedMall.Price + user.budgetSpent;
    user.budgetLeft = user.budgetLeft - selectedMall.Price;
    await user.save();
    await selectedMall.save();
    res.status(200).send({
      message: "Booked successfully our Admin will contact you shortly",
    });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to remove Booking for a particular user
decorRouter.delete("/remove/:id", loginAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const selectedMall = await Decor.findById({ _id: id });
    const user = await Users.findById(req.user.id);

    const verifyDate = selectedMall.bookedOn.filter((dates) => {
      return dates.user !== req.user.id;
    });
    const resetUser = selectedMall.bookedBy.filter((id) => {
      return id != req.user.id;
    });
    console.log("hemmo" + "" + verifyDate);
    selectedMall.$set({ bookedOn: verifyDate, bookedBy: resetUser });
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

// endpoint to get particular decor by ID

decorRouter.get("/get/:id", async (req, res) => {
  try {
    const decor = await Decor.findById(req.params.id);
    if (!decor) {
      return res.status(404).send({ message: "Decor not found" });
    }
    res.status(200).send(decor);
  } catch (err) {
    res.status(500).send({ message: "server error", error: err });
  }
});

//endpoint to edit Decor Admin
decorRouter.put(
  "/edit/:id",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const { id } = req.params;
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
      const verify = await Decor.findOne({
        decorContact: decorContact,
      });
      if (verify) {
        return res
          .status(400)
          .send({ message: "contact already used in some vendors" });
      }
      const updatedMall = await Decor.findByIdAndUpdate(
        id,
        {
          decorName,
          DecorDescription,
          decorAddress,
          decorCity,
          decorContact,
          Price,
          decorType: decorType.split(","),
          decorImages: `https://apieventmanagement.onrender.com/mallImages/${req.file.filename}`,
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

// Endpoint to delete the Decor
decorRouter.delete(
  "/delete/:id",
  loginAuth,
  roleAuth("Admin"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const mall = await Decor.findByIdAndDelete(id);
      console.log(mall);
      if (!mall) return res.status(404).send({ message: "Decor not found" });
      res.status(200).send({ message: "Decor deleted successfully" });
    } catch (e) {
      return res
        .status(500)
        .send({ message: "Delete failed", data: e.message });
    }
  }
);

module.exports = decorRouter;
