var express = require("express");
var route = express.Router();

var loginController = require("../controllers/loginController");



// Get login page
route.get("/",  async (req, res, next) => {
  const { msg } = req.query;

  res.render("login", { err: msg, title: "Leave management system", layout: "loginLayout.hbs"});
});

// Get login / logout request
route.post("/login", loginController.Login);
route.get("/logout", loginController.Logout);
// route.get("/signup", loginController.SignUp);

module.exports = route;
