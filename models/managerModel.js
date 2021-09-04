var mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
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
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoleUser",
  },
  businessUnit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessUnit",
  },
});

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
