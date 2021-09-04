
const express = require('express')
const route = express.Router()
const staffController = require('../controllers/staffController')

  // Get Homepage
route.get("/home", staffController.staffHomePage);

//! Request
//*List request 
route.get('/list_all_requests', staffController.list_all_requests)

//* Add request 
route.get('/add_request', staffController.add_request)
route.post('/addRequest', staffController.addRequest)

//* Update request
route.get('/update_request/:id', staffController.update_request)
route.put('/updateRequest', staffController.updateRequest)

//* Delete request
route.delete('/deleteRequest', staffController.deleteRequest)

//! Information
//* Get information
route.get('/get_all_information', staffController.get_all_information)
//* Update information
route.get('/update_information/:id', staffController.update_information)
route.put('/updateInformation', staffController.updateInformation)

module.exports = route