const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  level: {
    type: Number,
  },
  times: {
    type: Number,
    default: 0,
  },
  isToday: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    default: 0,
  },
});

const PlayerModel = mongoose.model("Player", playerSchema, "player");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const player = await PlayerModel.create(req.body);
    res.status(201).send(player);
  } catch (error) {
    console.log(error);
  }
});
router.get("/", async (req, res) => {
  try {
    console.log(123);
    const list = await PlayerModel.find({});
    res.status(200).send(list);
  } catch (error) {
    console.log(error);
  }
});

router.get("/isToday", async (req, res) => {
  const list = await PlayerModel.find({ isToday: 1 }).lean();
  res.send(list);
});

router.get("/isReady", async (req, res) => {
  try {
    const list = await PlayerModel.find({ status: 0, isToday: 1 });
    res.status(200).send(list);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const player = await PlayerModel.findById(id);
  player.set(req.body);
  player.save();
  res.sendStatus(200);
});

router.patch("/isToday/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await PlayerModel.updateOne({ _id: id }, { $set: { isToday: 1 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/clearToday/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PlayerModel.updateOne({ _id: id }, { $set: { isToday: 0 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/addTimes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PlayerModel.updateOne({ _id: id }, { $inc: { times: 1 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/action/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await PlayerModel.updateOne({ _id: id }, { $set: { status: 1 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/clearStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PlayerModel.updateOne({ _id: id }, { $set: { status: 0 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/backdoor/clearStatus", async (req, res) => {
  try {
    await PlayerModel.updateMany({}, { $set: { status: 0 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/clearTimes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PlayerModel.updateOne({ _id: id }, { $set: { times: 0 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await PlayerModel.deleteOne({ _id: id });
  res.sendStatus(200);
});

module.exports = router;
