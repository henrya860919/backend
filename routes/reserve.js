const ReserveModel = require('../models/reserve')
const startOfDay = require("date-fns/startOfDay");
const endOfDay = require("date-fns/endOfDay");

const express = require("express");
const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reserveDate } = req.body;
    const player = await ReserveModel.findOne({
      userId: id,
      reserveDate: {
        $gte: startOfDay(new Date(reserveDate)),
        $lte: endOfDay(new Date(reserveDate)),
      },
    })
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
    await ReserveModel.findByIdAndUpdate(id, { $inc: { times: 1 } })
    // await ReserveModel.updateOne({ userId: id }, { $inc: { times: 1 } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/decreaseTimes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const one = await ReserveModel.findById(id)
    // const one = await ReserveModel.findOne({ userId: id });
    one.times -= 1;
    if (one.times < 0) {
      return res.status(401).send("times can not less 0 !!");
    }
    await one.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/action/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // await ReserveModel.updateOne({ userId: id }, { $set: { status: 1 } });
    // const aaa = await ReserveModel.findOneAndUpdate({ userId: id }, { $set: { status: 1 } }, { new: true })
    await ReserveModel.findByIdAndUpdate(id, { $set: { status: 1 } })
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/clearStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // await ReserveModel.updateOne({ userId: id, status: 1 }, { $set: { status: 0 } });
    await ReserveModel.findByIdAndUpdate(id, { $set: { status: 0 } })
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
    // await ReserveModel.updateOne({ userId: id }, { $set: { times: 0 } });
    await ReserveModel.findByIdAndUpdate(id, { $set: { times: 0 } })
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
