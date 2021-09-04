var RoleUser = require("../models/roleUserModel");
var bcrypt = require("bcrypt");

// exports.SignUp = async (req, res, next) => {
//   const user = RoleUser({
//     username: "admin",
//     password: "admin",
//     role: "admin",
//   });
//   await user.save();
//   console.log(user);
//   return res.send(user);
// };

exports.Login = async (req, res) => {

    const user = await RoleUser.findOne({ username: req.body.username })
    if (!user) {
  
      res.send('unable to login')
      // const msg = "User Not Found !!!";
      // return res.redirect(`/users/login?msg=${msg}`);
  
    } 
    try {
      const isMatch = await bcrypt.compare(req.body.password, user.password)
      
      if (!isMatch) {
        res.send('unable to login')
        // const msg = "Username or Password is incorrect !!!";
        // return res.redirect(`/users/login?msg=${msg}`);
      } else {
  
        req.session.userId = user._id;
        req.session.isAdmin = user.role === "admin" ? true : false;
        req.session.isStaff = user.role === "staff" ? true : false;
        req.session.isManager = user.role === "manager" ? true : false;
  
        if (user.role === "admin") {
          return res.redirect('admin/home');
        } else if (user.role === "staff") {
          return res.redirect(`/staff/list_all_requests`);
        } else if (user.role === "manager") {
          return res.redirect(`/manager/home`);
        }
      }
    } catch (error) {
      res.send(error)
      return res.redirect(`/`)
    }
}



exports.Logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
};

