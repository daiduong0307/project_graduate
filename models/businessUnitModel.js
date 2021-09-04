var mongoose = require("mongoose");

const businessUnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    request_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request",
        },
    ],
    staff_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
        },
    ],
    manager_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Manager",
        },
    ]

},
    {
        timestamps: true
    });

const BusinessUnit = mongoose.model("BusinessUnit", businessUnitSchema);

module.exports = BusinessUnit;
