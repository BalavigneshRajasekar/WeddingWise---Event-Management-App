const express = require("express");
const Catering = require("../models/catering");
const Users = require("../models/users");
const loginAuth = require("../middlewares/loginAuth");
const roleAuth = require("../middlewares/roleAuth");
const multer = require("multer");
const cloudinary = require("../cloudinary");

const cateringRouter = express.Router();

// Multer setup for handling image uploads
const memory = multer.memoryStorage();
const upload = multer({ storage: memory });

// endpoint to add catering to the DB(Admin)

cateringRouter.post(
  "/add",
  loginAuth,
  roleAuth("Admin"),
  upload.array("media"),
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
      //Upload image to cloudinary
      const mediaUrls = await Promise.all(
        req.files.map(async (file) => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto",
                upload_preset: "Unsigned",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          });
        })
      );

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
        cateringImages: mediaUrls.filter(
          (url) => url.endsWith(".jpg") || url.endsWith(".png")
        ),
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
    if (new Date(eventDate) <= Date.now()) {
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
    selectedCater.bookedBy.push(req.user.id);
    await selectedCater.save();
    // calculate budget
    user.budgetSpent = selectedCater.price + user.budgetSpent;
    user.budgetLeft = user.budgetLeft - selectedCater.price;
    await user.save();
    res.status(200).send({
      message: "Booked successfully our Admin will contact you shortly",
    });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

//endpoint to remove Booking for a particular user
cateringRouter.delete("/remove/:id", loginAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const selectedCater = await Catering.findById({ _id: id });
    const user = await Users.findById(req.user.id);

    const verifyDate = selectedCater.bookedOn.filter((dates) => {
      return dates.user !== req.user.id;
    });
    const resetUser = selectedCater.bookedBy.filter((id) => {
      return id !== req.user.id;
    });
    console.log(verifyDate);
    selectedCater.$set({ bookedOn: verifyDate, bookedBy: resetUser });
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

//endpoint to edit catering Admin
cateringRouter.put(
  "/edit/:id",
  loginAuth,
  roleAuth("Admin"),
  upload.array("media"),
  async (req, res) => {
    const { id } = req.params;
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
      //Upload image to cloudinary
      const mediaUrls = await Promise.all(
        req.files.map(async (file) => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto",
                upload_preset: "Unsigned",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          });
        })
      );

      const verify = await Catering.findOne({
        cateringContact: cateringContact,
      });
      if (verify) {
        if (verify._id.toString() !== id) {
          return res
            .status(400)
            .send({ message: "contact already used in some vendors" });
        }
      }
      const updatedMall = await Catering.findByIdAndUpdate(
        id,
        {
          cateringName,
          cateringDescription,
          cateringAddress,
          cateringCity,
          cateringMenu: cateringMenu.split(","),
          cateringContact,
          price,
          decorImages: mediaUrls.filter(
            (url) => url.endsWith(".jpg") || url.endsWith(".png")
          ),
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

// Endpoint to delete the catering
cateringRouter.delete(
  "/delete/:id",
  loginAuth,
  roleAuth("Admin"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const mall = await Catering.findByIdAndDelete(id);
      console.log(mall);
      if (!mall) return res.status(404).send({ message: "Catering not found" });
      res.status(200).send({ message: "Catering deleted successfully" });
    } catch (e) {
      return res
        .status(500)
        .send({ message: "Delete failed", data: e.message });
    }
  }
);

module.exports = cateringRouter;
