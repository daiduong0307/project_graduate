const Manager = require('../models/managerModel')
const RoleUser = require('../models/roleUserModel')


exports.managerHomePage = async (req, res) => {
    // res.render("staffdashboard/staff_home");
    res.send("i'm manager")
}

//! Manage Request 
//* List request Type of Staff in their own Business Unit -
exports.list_all_requests = async (req, res) => {

    // const businessUnit = await BusinessUnit.find({}).populate({
    //     path: "staff_id",
    //     populate: 'request_id'
    // })
    // const request = await Request.find({}).populate({
    //     path: "owner_id",
    //     populate: ({
    //         path: 'amountRequest_id',
    //         populate: ({
    //             path: 'request_type_id',
    //             populate: ''
    //         })
    //     })
    // })

    // try {
    //     res.render("managerViews/manager_list_all_requests", {
    //         Request: request
    //     })
    // } catch (e) {
    //     res.status(400).send(e)
    // }

}








//! Manager information
//* get information 
exports.get_all_information = async (req, res) => {
    const getManager = await Manager.findOne({ account_id: req.session.userId }).populate("businessUnit_id").populate("account_id")
    if (!getManager) {
        res.status(401).send("unable to get information")
    }

    try {
        res.render("managerViews/manager_get_information", {
            Manager: getManager
        })

    } catch (e) {
        res.status(400).send(e)
    }

}

//* Update information
//GET
exports.update_information = async (req, res) => {
    const _id = req.params.id
    const managerAcc = await Manager.findOne({ _id: _id }).populate("businessUnit_id").populate("account_id")
    try {
        res.render("managerViews/manager_update_information", {
            Manager: managerAcc
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateInformation = async (req, res) => {
    const {
        manager_id,
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

    const newValueManager = {}
    if (name) newValueManager.name = name
    if (email) newValueManager.email = email
    if (fullName) newValueManager.fullName = fullName
    if (phoneNumber) newValueManager.phoneNumber = phoneNumber
    if (age) newValueManager.age = age
    if (dayOfBirth) newValueManager.dayOfBirth = dayOfBirth


    try {
        const manager = await Manager.findOne({ _id: manager_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: manager.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )

        const managerUpdate = await Manager.findOneAndUpdate(
            { _id: manager_id },
            { $set: newValueManager },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/manager/get_all_information`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//* Avatar 