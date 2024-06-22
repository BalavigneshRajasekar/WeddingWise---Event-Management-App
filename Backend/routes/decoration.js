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

module.exports = decorRouter;
