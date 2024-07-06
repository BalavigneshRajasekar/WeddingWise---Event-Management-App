const express = require("express");
const Photography = require("../models/photoGraphy");
const Users = require("../models/users");
const loginAuth = require("../middlewares/loginAuth");
const roleAuth = require("../middlewares/roleAuth");
const upload = require("../middlewares/multerMiddleware");

const photographyRouter = express.Router();

// endpoint to add Photography to the DB
photographyRouter.post(
  "/add",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const {
      photographyName,
      photographyAddress,
      photographyCity,
      photographyContact,
      photographyType,
      photographyDescription,
      Price,
    } = req.body;

    try {
      const verify = await Photography.findOne({
        photographyContact: photographyContact,
      });
      if (verify) {
        return res.status(400).send({ message: "Mall already exists" });
      }

      const newPhotography = new Photography({
        photographyName,
        photographyAddress,
        photographyDescription,
        photographyCity,
        photographyImages: `https://event-management-api-ms52.onrender.com/mallImages/${req.file.filename}`,
        photographyContact,
        photographyType: photographyType.split(","),
        Price,
      });

      await newPhotography.save();

      res.status(200).send({ message: "PhotoGraphy  registered successfully" });
    } catch (err) {
      res.status(500).send({ message: "server error: ", err: err.message });
    }
  }
);

//Endpoint to get the All photoGraphy

photographyRouter.get("/get", async (req, res) => {
  try {
    const allPhoto = await Photography.find({});
    res.status(200).send(allPhoto);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to book the Photography

photographyRouter.post("/book/:id", loginAuth, async (req, res) => {
  const id = req.params.id;
  const { eventDate } = req.body;
  console.log(eventDate);
  try {
    //To verify the date must not be an past date
    if (new Date(eventDate) <= Date.now()) {
      return res.status(400).send({ message: "Date must not be a past date" });
    }

    // Find the user selected mall
    const selectedPhoto = await Photography.findById({ _id: id });
    const user = await Users.findById(req.user.id);

    const verifyDate = selectedPhoto.bookedOn.filter((dates) => {
      return dates.date == eventDate;
    });
    //verifying the mall is booked on that date r not
    if (verifyDate.length > 0) {
      return res
        .status(400)
        .send({ message: "Mall already booked on that day" });
    }
    //if user has booked a mall then he cannot book the same mall to other date until that day overs
    const verifyUser = selectedPhoto.bookedOn.filter((user) => {
      return user.user == req.user.id;
    });
    console.log(verifyUser);
    if (verifyUser.length > 0) {
      return res.status(400).send({
        message: "once previous booking is done then only you can book another",
      });
    }

    // calculate budget
    user.budgetSpent = selectedPhoto.Price + user.budgetSpent;
    user.budgetLeft = user.budgetLeft - selectedPhoto.Price;
    await user.save();
    selectedPhoto.bookedOn.push({ date: eventDate, user: req.user.id });
    selectedPhoto.bookedBy.push(req.user.id);
    await selectedPhoto.save();

    res.status(200).send({
      message: "Booked successfully our Admin will contact you shortly",
      mallId: selectedPhoto._id,
    });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to remove Booking for a particular user
photographyRouter.delete("/remove/:id", loginAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const selectedPhoto = await Photography.findById({ _id: id });
    const user = await Users.findById(req.user.id);

    const verifyDate = selectedPhoto.bookedOn.filter((dates) => {
      return dates.user !== req.user.id;
    });
    const resetUsers = selectedPhoto.bookedBy.filter((id) => {
      return id !== req.user.id;
    });
    console.log(verifyDate);
    selectedPhoto.$set({ bookedOn: verifyDate, bookedBy: resetUsers });
    await selectedPhoto.save();

    // calculate budget
    user.budgetSpent = user.budgetSpent - selectedPhoto.Price;
    user.budgetLeft = user.budgetLeft + selectedPhoto.Price;
    await user.save();
    res.status(200).send({ message: "remove booking successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

// endpoint to show particular user bookings for dashboard

photographyRouter.get("/dashboard", loginAuth, async (req, res) => {
  try {
    const userBookings = await Photography.find({
      "bookedOn.user": req.user.id,
    });
    res.status(200).send(userBookings);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

// endpoint to get particular Mall by ID

photographyRouter.get("/get/:id", async (req, res) => {
  try {
    const Photo = await Photography.findById(req.params.id);
    if (!Photo) return res.status(404).send({ message: "Mall not found" });

    res.status(200).send(Photo);
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to edit photography Admin
photographyRouter.put(
  "/edit/:id",
  loginAuth,
  roleAuth("Admin"),
  upload.single("media"),
  async (req, res) => {
    const { id } = req.params;
    const {
      photographyName,
      photographyAddress,
      photographyCity,
      photographyContact,
      photographyType,
      photographyDescription,
      Price,
    } = req.body;

    try {
      const verify = await Photography.findOne({
        photographyContact: photographyContact,
      });
      if (verify) {
        return res
          .status(400)
          .send({ message: "contact already used in some vendors" });
      }
      const updatedMall = await Photography.findByIdAndUpdate(
        id,
        {
          photographyName,
          photographyAddress,
          photographyCity,
          photographyContact,
          photographyType: photographyType.split(","),
          photographyDescription,
          photographyImages: `https://event-management-api-ms52.onrender.com/mallImages/${req.file.filename}`,
          Price,
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

// Endpoint to delete the photography
photographyRouter.delete(
  "/delete/:id",
  loginAuth,
  roleAuth("Admin"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const mall = await Photography.findByIdAndDelete(id);
      console.log(mall);
      if (!mall)
        return res.status(404).send({ message: "Photography not found" });
      res.status(200).send({ message: "Photography deleted successfully" });
    } catch (e) {
      return res
        .status(500)
        .send({ message: "Delete failed", data: e.message });
    }
  }
);

module.exports = photographyRouter;
