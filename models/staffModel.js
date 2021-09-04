var mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: Number
  },
  age: {
    type: Number
  },
  dayOfBirth: {
    type: Date
  },
  avatar : {
    type: Buffer
  },
  request_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
  ],
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoleUser",
  },
  businessUnit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessUnit"
  },
}, {
  timestamps: true
});

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
