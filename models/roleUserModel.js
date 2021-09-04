var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const { Timestamp } = require("mongodb");

const roleUserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 4,
    maxlength: 100,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    maxlength: 255,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "staff", "manager"],
    default: "staff",
  },
},{
  timestamps: true
});

roleUserSchema.path("password").set((inputString) => {
  return (inputString = bcrypt.hashSync(
    inputString,
    bcrypt.genSaltSync(10),
    null
  ));
});


const roleUser = mongoose.model("RoleUser", roleUserSchema);

module.exports = roleUser;
