var mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    reason: {
        type: String,
        require: true
    },
    startDateOff: {
        type: Date,
        require: true
    },
    endDateOff: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        require : true,
        default: "submitted"
    },
    businessUnit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessUnit",
    },
    requestType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RequestType",
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
    }
},{
    timestamps: true
});

RequestSchema.virtual("staff", {
    ref: "Staff",
    localField: "_id",
    foreignField: "posts",
});

RequestSchema.virtual("amount_requests", {
    ref: "BusinessUnit",
    localField: "_id",
    foreignField: "amountRequest",
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
