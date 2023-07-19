const mongoose = require("mongoose");
const reserveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    times: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
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
const current = new Date();
const dd = String(current.getDate()).padStart(2, "0");
const tomorrowdd = String(current.getDate() + 1).padStart(2, "0");
const mm = String(current.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = current.getFullYear();
const today = yyyy + "-" + mm + "-" + dd;
const tomorrow = yyyy + "-" + mm + "-" + tomorrowdd;

const ReserveModel = mongoose.model("Reserve", reserveSchema, "reserve");
const express = require("express");
const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const player = await ReserveModel.findOne({ userId: id });
    if (player) {
      res.status(401).send("this is player is exist!!");
    }
    const one = await ReserveModel.create({ userId: id });
    res.status(201).send(one);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const all = await ReserveModel.find({});
    res.send(all);
  } catch (error) {
    console.log(error);
  }
});

// router.get("/isToday", async (req, res) => {
//   const list = await ReserveModel.find({ isToday: 1 })
//     .populate({
//       path: "userId",
//       select: "_id name level",
//     })
//     .lean();
//   res.send(list);
// });

router.get("/isReady", async (req, res) => {
  try {
    const list = await ReserveModel.find({
      status: 0,
      createdAt: {
        $gte: today,
        $lte: tomorrow,
      },
    })
      .populate({
        path: "userId",
        select: "_id name level",
      })
      .lean();
    res.status(200).send(list);
  } catch (error) {
    console.log(error);
  }
});

// router.patch("/isToday/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await ReserveModel.updateOne({ userId: id }, { $set: { isToday: 1 } });
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.patch("/clearToday/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await ReserveModel.updateOne({ userId: id }, { $set: { isToday: 0 } });
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//   }
// });

router.patch("/addTimes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ReserveModel.updateOne({ userId: id }, { $inc: { times: 1 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/action/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ReserveModel.updateOne({ userId: id }, { $set: { status: 1 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/clearStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ReserveModel.updateOne({ userId: id }, { $set: { status: 0 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/backdoor/clearStatus", async (req, res) => {
  try {
    await ReserveModel.updateMany({}, { $set: { status: 0 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/clearTimes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ReserveModel.updateOne({ userId: id }, { $set: { times: 0 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
