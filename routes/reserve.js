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
    reserveDate: {
      type: Date,
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
const startOfDay = require("date-fns/startOfDay");
const endOfDay = require("date-fns/endOfDay");

const ReserveModel = mongoose.model("Reserve", reserveSchema, "reserve");
const express = require("express");
const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reserveDate } = req.body;
    const player = await ReserveModel.findOne({ userId: id });
    if (player) {
      res.status(401).send("this is player is exist!!");
    }
    const one = await ReserveModel.create({
      userId: id,
      reserveDate: reserveDate,
    });
    res.status(201).send(one);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const { reserveDate } = req.query;
    let query;
    let all;
    if (reserveDate) {
      all = await ReserveModel.find({
        reserveDate: {
          $gte: startOfDay(new Date(reserveDate)),
          $lte: endOfDay(new Date(reserveDate)),
        },
      })
        .populate({
          path: "userId",
          select: "_id name level",
        })
        .lean();
    } else {
      all = await ReserveModel.find({})
        .populate({
          path: "userId",
          select: "_id name level",
        })
        .lean();
    }

    res.send(all);
  } catch (error) {
    console.log(error);
  }
});

router.get("/today", async (req, res) => {
  try {
    const all = await ReserveModel.find({
      reserveDate: {
        $gte: startOfDay(new Date()),
        $lte: endOfDay(new Date()),
      },
    })
      .populate({
        path: "userId",
        select: "_id name level",
      })
      .lean();
    res.status(200).send(all);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/bkdr", async (req, res) => {
  await ReserveModel.updateMany(
    {},
    {
      $set: {
        status: 0,
        times: 0,
      },
    }
  );
  res.sendStatus(200);
});

router.patch("/addTimes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ReserveModel.updateOne({ userId: id }, { $inc: { times: 1 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/decreaseTimes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const one = await ReserveModel.findById(id);
    one.times -= 1;
    await one.save();
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

router.delete("/clearall", async (req, res) => {
  await ReserveModel.deleteMany({
    $or: [{ status: 0 }, { status: 1 }],
  });
  res.sendStatus(200);
});

module.exports = router;
