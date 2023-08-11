const mongoose = require('mongoose')
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
const ReserveModel = mongoose.model("Reserve", reserveSchema, "reserve");
module.exports = ReserveModel