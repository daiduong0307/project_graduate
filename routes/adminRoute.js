
const adminController = require('../controllers/adminController')
const express = require('express')
const route = express.Router()

// Get homepage
route.get("/home", (req, res, next) => {
  res.render("adminViews/admin_home");
});

// route.get("/listuser", adminController.listuser )

//! Display list of users accounts, Request Types and business Units
route.get('/list_all_staffs', adminController.list_all_staffs)
route.get('/list_all_managers', adminController.list_all_managers)
route.get('/list_all_request_types', adminController.list_all_request_types)
route.get('/list_all_business_units', adminController.list_all_business_units)

//! add accounts, topics and business units 
//* Staff
route.get("/add_staff", adminController.add_staff);
route.post('/addStaff', adminController.addStaff)

//*Manager
route.get('/add_manager', adminController.add_manager)
route.post('/addManager', adminController.addManager)

//*Business Unit
route.get('/add_business_unit', adminController.add_business_unit)
route.post('/addBusinessUnit', adminController.addBusinessUnit)

//* Request Type
route.get('/add_request_type', adminController.add_request_type)
route.post('/addRequestType', adminController.addRequestType)

//!Update accounts, topics and business units 
//*Staff
route.get('/update_staff/:id', adminController.update_staff)
route.put('/updateStaff', adminController.updateStaff)

//*Manager
route.get('/update_manager/:id', adminController.update_manager)
route.put('/updateManager', adminController.updateManager)

//*Business Unit 
route.get('/update_business_unit/:id', adminController.update_business_unit)
route.put('/updateBusinessUnit', adminController.updateBusinessUnit)

//*Request Type
route.get('/update_request_type/:id', adminController.update_request_type)
route.put('/updateRequestType', adminController.updateRequestType)

//! Delete accounts, topics and business units
//*Staff
route.delete('/deleteStaff', adminController.deleteStaff)
//*Manager
route.delete('/deleteManager', adminController.deleteManager)
//*Business Unit
route.delete('/deleteBusinessUnit', adminController.deleteBusinessUnit)
//*Request Type
route.delete('/deleteRequestType', adminController.deleteRequestType)

//assign Business unit for manager 
// route.get('/update_manager/:id', adminController.update_manager)
// route.put('/assign_bu_for_manager', adminController.assign_bu_for_manager)


module.exports = route
