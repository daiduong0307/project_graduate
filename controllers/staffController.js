const Staff = require('../models/staffModel')
const Request = require('../models/requestModel')
const BusinessUnit = require('../models/businessUnitModel')
const RequestType = require('../models/requestTypeModel')
const RoleUser = require('../models/roleUserModel')





exports.staffHomePage = async (req, res) => {
    // res.render("staffdashboard/staff_home");
    res.send("i'm staff")
}

//! Requests
//* List all request 
exports.list_all_requests = async (req, res) => {
    const checkStaff = await Staff.findOne({ account_id: req.session.userId })
        // .populate({
        //     path: 'request_id',
        //     populate: {
        //         path: 'owner_id',
        //         pupolate: 'businessUnit_id'
        //     }
        // })
        .populate('businessUnit_id')
        .populate({
            path: 'request_id',
            populate: 'requestType_id'
        })

    try {
        res.render("staffViews/staff_list_all_requests", {
            Staff: checkStaff
        })
    } catch (e) {
        res.status(400).send(e)
    }

}


//* Add Request 
//GET
exports.add_request = async (req, res) => {
    const requestType = await RequestType.find({})
    try {
        res.render("staffViews/staff_add_request", {
            requestType: requestType
        })
    } catch (e) {
        res.status(400).send(e)
    }
}


//POST
exports.addRequest = async (req, res) => {

    const {
        reason,
        startDateOff,
        endDateOff,
        requestType_id
    } = req.body

    const checkStaff = await Staff.findOne({ account_id: req.session.userId })
    if (!checkStaff) {
        res.status(401).send("unable to create request")
    }

    try {
        const newRequest = await new Request({
            reason: reason,
            startDateOff: startDateOff,
            endDateOff: endDateOff,
            requestType_id: requestType_id,
            owner_id: checkStaff._id,
            businessUnit_id: checkStaff.businessUnit_id
        })

        const saveRequest = await newRequest.save()
        await checkStaff.request_id.push(saveRequest)
        await checkStaff.save()

        //push into BU
        const businessUnit = await BusinessUnit.findOne({ _id: saveRequest.businessUnit_id })
        await businessUnit.request_id.push(saveRequest)
        await businessUnit.save()
        res.redirect(`/staff/list_all_requests`)
    } catch (e) {
        res.status(400).send(e)
    }

}

//*Update Request
//GET
exports.update_request = async (req, res) => {
    const _id = req.params.id
    const request = await Request.findOne({ _id: _id }).populate('requestType_id').populate({
        path: "owner_id",
        populate: 'businessUnit_id'
    })
    try {
        res.render("staffViews/staff_update_request", {
            Request: request
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateRequest = async (req, res) => {
    const {
        request_id,
        startDateOff,
        endDateOff,
        reason
    } = req.body

    const newValue = {}
    if (startDateOff) newValue.startDateOff = startDateOff
    if (endDateOff) newValue.endDateOff = endDateOff
    if (reason) newValue.reason = reason

    try {
        const request = await Request.findOne({ _id: request_id })
        const requestUpdate = await Request.findOneAndUpdate(
            { _id: request._id },
            { $set: newValue },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/staff/update_request/${request_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//*Delete Request
exports.deleteRequest = async (req, res) => {
    const { _id } = req.body

    const request = await Request.findOne({ _id: _id })

    //pop out of old BU 
    const businessUnit = await BusinessUnit.findOneAndUpdate(
        { request_id: request._id, },
        { $pull: { request_id: request._id } },
        { safe: true, upsert: true }
    )
    //pop out of Staff
    const staff = await Staff.findOneAndUpdate(
        { request_id: request._id, },
        { $pull: { request_id: request._id } },
        { safe: true, upsert: true }
    )
    try {

        await request.remove()
        res.redirect(`/staff/list_all_requests`)
    } catch (e) {
        res.status(400).send(e)
    }

}

//! Staff information
//* get information 
exports.get_all_information = async (req, res) => {
    const getStaff = await Staff.findOne({ account_id: req.session.userId }).populate("businessUnit_id").populate("account_id")
    if (!getStaff) {
        res.status(401).send("unable to get information")
    }

    try {
        res.render("staffViews/staff_get_information", {
            Staff: getStaff
        })

    } catch (e) {
        res.status(400).send(e)
    }

}

//* Update information
//GET
exports.update_information = async (req, res) => {
    const _id = req.params.id
    const staffAcc = await Staff.findOne({ _id: _id }).populate("businessUnit_id").populate("account_id")
    try {
        res.render("staffViews/staff_update_information", {
            Staff: staffAcc
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateInformation = async (req, res) => {
    const {
        staff_id,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth
    } = req.body;

    const newValueRole = {}
    if (password) newValueRole.password = password

    const newValueStaff = {}
    if (name) newValueStaff.name = name
    if (email) newValueStaff.email = email
    if (fullName) newValueStaff.fullName = fullName
    if (phoneNumber) newValueStaff.phoneNumber = phoneNumber
    if (age) newValueStaff.age = age
    if (dayOfBirth) newValueStaff.dayOfBirth = dayOfBirth


    try {
        const staff = await Staff.findOne({ _id: staff_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: staff.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )

        const staffUpdate = await Staff.findOneAndUpdate(
            { _id: staff_id },
            { $set: newValueStaff },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/staff/get_all_information`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//* Avatar 