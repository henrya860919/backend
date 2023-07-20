const mongoose = require("mongoose");
const scheduleSchema = new mongoose.Schema(
  {
    group1: {
      type: {
        players: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "User",
          required: true,
        },
      },
    },
    group2: {
      type: {
        players: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "User",
          required: true,
        },
      },
    },
    result1: {
      type: Number,
      default: 0,
    },
    result2: {
      type: Number,
      default: 0,
    },
    court: {
      type: Number,
      enum: [1, 2],
    },
    status: {
      type: Number,
      default: 1,
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

const ScheduleModel = mongoose.model("Schedule", scheduleSchema, "schedule");
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
    const scheduleList = await ScheduleModel.find({}).populate(
      "group1.players group2.players"
    );
    res.send(scheduleList);
  } catch (error) {
    console.log(error);
  }
});
router.get("/current", async (req, res) => {
  try {
    const scheduleList = await ScheduleModel.find({ status: 1 }).populate(
      "group1.players group2.players"
    );
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
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
