const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    level: {
      type: Number,
    },
    sex: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    versionKey: false,
    minimize: false,
    id: false,
  }
);

const UserModel = mongoose.model("User", userSchema, "user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const all = await UserModel.find({}, { _id: 1, name: 1, level: 1 });
    res.status(200).send(all);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    user.set(req.body);
    user.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.deleteOne({ _id: id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/backdoor", async (req, res) => {
  try {
    const arr = [
      {
        _id: "64b7e9b19a381ec0d15e47ba",
      },
      {
        _id: "64b7e9d480092ec59b9200bb",
      },
      {
        _id: "64b7e9ea80092ec59b9200be",
      },
      {
        _id: "64b7e9f780092ec59b9200c0",
      },
      {
        _id: "64b7e9fe80092ec59b9200c2",
      },
      {
        _id: "64b7ea0680092ec59b9200c4",
      },
      {
        _id: "64b7ea0d80092ec59b9200c6",
      },
      {
        _id: "64b7ea1580092ec59b9200c8",
      },
      {
        _id: "64b7ea1d80092ec59b9200ca",
      },
      {
        _id: "64b7ea2580092ec59b9200cc",
      },
      {
        _id: "64b7ea2e80092ec59b9200ce",
      },
      {
        _id: "64b7ea3580092ec59b9200d0",
      },
      {
        _id: "64b7ea3d80092ec59b9200d2",
      },
      {
        _id: "64b7ea4480092ec59b9200d4",
      },
      {
        _id: "64b7ea4b80092ec59b9200d6",
      },
    ];
    arr.forEach((obj) => {
      UserModel.findById(obj._id);
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
