const express = require('express')
const route = express.Router()
const managerController = require('../controllers/managerController')

  // Get Homepage
  route.get("/home",managerController.managerHomePage);


//! Manage Request 
//* List request Type of Staff in their own Business Unit
route.get('/list_all_requests', managerController.list_all_requests)



  //! Information
//* Get information
route.get('/get_all_information', managerController.get_all_information)
//* Update information
route.get('/update_information/:id', managerController.update_information)
route.put('/updateInformation', managerController.updateInformation)

  module.exports = route