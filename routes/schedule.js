const ScheduleModel = require('../models/schedule')

const startOfDay = require("date-fns/startOfDay");
const endOfDay = require("date-fns/endOfDay");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const schedule = await ScheduleModel.create(req.body);
    schedule.set(req.body);
    schedule.save();
    res.status(201).send(schedule);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const scheduleList = await ScheduleModel.find({
      createdAt: {
        $gte: startOfDay(new Date(date)),
        $lte: endOfDay(new Date(date)),
      },
    }).populate(
      "group1.players group2.players"
    );
    res.send(scheduleList);
  } catch (error) {
    console.log(error);
  }
});
router.get("/current", async (req, res) => {
  try {

    const scheduleList = await ScheduleModel.find({
      status: 1
    }).populate(
      "group1.players group2.players"
    );
    console.log(scheduleList);
    res.send(scheduleList);
  } catch (error) {
    console.log(error);
  }
});

router.patch("/:id/finish", async (req, res) => {
  try {
    const { id } = req.params;
    const { result1, result2 } = req.body;
    const schedule = await ScheduleModel.findById(id);
    schedule.result1 = result1;
    await schedule.save();
    schedule.result2 = result2;
    await schedule.save();
    schedule.status = 0;
    await schedule.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/clearall", async (req, res) => {
  try {
    await ScheduleModel.deleteMany({});
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
