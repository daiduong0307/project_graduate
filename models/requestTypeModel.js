var mongoose = require("mongoose");

const requestTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const Topic = mongoose.model("RequestType", requestTypeSchema);

module.exports = Topic;
