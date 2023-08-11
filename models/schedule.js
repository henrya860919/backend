const mongoose = require('mongoose')
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

module.exports = ScheduleModel