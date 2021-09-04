const RoleUser = require("../models/roleUserModel");
const Staff = require("../models/staffModel");
const Manager = require("../models/managerModel");
const BusinessUnit = require("../models/businessUnitModel");
const RequestType = require("../models/requestTypeModel");
const Request = require("../models/requestModel");



//! This field for Staff
//* list of Staff 
exports.list_all_staffs = async (req, res) => {
    const staff = await Staff.find({}).populate("account_id").populate("businessUnit_id")

    try {
        res.render("adminViews/admin_list_staffs", {
            Staff: staff
        })
    } catch (error) {
        res.status(400).send(error)
    }
}


//* Adding new staff account
//GET
exports.add_staff = async (req, res) => {
    const businessUnit = await BusinessUnit.find({})
    try {
        res.render("adminViews/admin_add_staff", {
            businessUnit: businessUnit
        })
    } catch (e) {
        res.status(400).send(e)
    }

}
//POST
exports.addStaff = async (req, res, next) => {
    const {
        username,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth,
        BU_Id } = req.body;


    const userExist = await RoleUser.findOne({ username: username, role: "staff" })
    if (userExist) {
        // const existUsername = "Username has already exist !!!";
        // return res.redirect(`/admin/add_staff?msg=${existUsername}`);
        res.send("username exist")
    }
    try {
        const newUser = await new RoleUser({
            username: username,
            password: password,
            role: "staff"
        })
        await newUser.save()

        const userAcc = await RoleUser.findOne({ username: username })
        const newStaff = await new Staff({
            name: name,
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
            age: age,
            dayOfBirth: dayOfBirth,
            businessUnit_id: BU_Id,
            account_id: userAcc._id
        })

        const saveStaff = await newStaff.save()
        //push into BU
        const businessUnit = await BusinessUnit.findOne({ _id: saveStaff.businessUnit_id })
        await businessUnit.staff_id.push(saveStaff)
        await businessUnit.save()

        // res.status(201).send( saveStaff)
        return res.redirect(`/admin/list_all_staffs`);

    } catch (error) {
        res.status(400).send(error)
    }


};

//* Update Staff account
//GET
exports.update_staff = async (req, res) => {
    const _id = req.params.id
    const staffAcc = await Staff.findOne({ _id: _id }).populate("businessUnit_id").populate("account_id")
    const businessUnit = await BusinessUnit.find({})
    try {
        res.render("adminViews/admin_update_staff", {
            Staff: staffAcc,
            businessUnit: businessUnit
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

//PUT
exports.updateStaff = async (req, res) => {
    const {
        staff_id,
        username,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth,
        BU_Id } = req.body;

    const newValueRole = {}
    if (username) newValueRole.username = username

    const newValueStaff = {}
    if (name) newValueStaff.name = name
    if (email) newValueStaff.email = email
    if (fullName) newValueStaff.fullName = fullName
    if (phoneNumber) newValueStaff.phoneNumber = phoneNumber
    if (age) newValueStaff.age = age
    if (dayOfBirth) newValueStaff.dayOfBirth = dayOfBirth
    if (BU_Id) newValueStaff.businessUnit_id = BU_Id

    try {
        const staff = await Staff.findOne({ _id: staff_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: staff.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )
        //pop out of old BU 
        const oldBusinessUnit = await BusinessUnit.findOneAndUpdate(
            { staff_id: staff._id, },
            { $pull: { staff_id: staff._id } },
            { safe: true, upsert: true }
        )

        const staffUpdate = await Staff.findOneAndUpdate(
            { _id: staff_id },
            { $set: newValueStaff },
            { new: true, useFindAndModify: false }
        )
        //push into new BU
        const newBusinessUnit = await BusinessUnit.findOne({ _id: staffUpdate.businessUnit_id })
        await newBusinessUnit.staff_id.push(staffUpdate)
        await newBusinessUnit.save()

        res.redirect(`/admin/update_staff/${staff_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}


//*Delete Staff
exports.deleteStaff = async (req, res) => {
    const { _id } = req.body

    const staff = await Staff.findOne({ _id: _id })
    const roleUser = await RoleUser.findOne({ _id: staff.account_id })
    const request = await Request.findOne({ _id: staff.request_id })

    if (request !== null) {
        await request.remove()
    }

    try {
        //pop out of old BU 
        const businessUnit = await BusinessUnit.findOneAndUpdate(
            { staff_id: staff._id, },
            { $pull: { staff_id: staff._id } },
            { safe: true, upsert: true }
        )
        await staff.remove()
        await roleUser.remove()

        res.redirect(`/admin/list_all_staffs`)
    } catch (e) {
        res.status(400).send(e)
    }

}







//! this field for manager
//* List all manager 

exports.list_all_managers = async (req, res) => {
    const manager = await Manager.find({}).populate("account_id").populate("businessUnit_id")
    // const businessUnit = await BusinessUnit.find({}).populate({
    //     path: "amountRequest_id",
    //     populate: {path: "topic_id"}
    // })

    try {
        res.render("adminViews/admin_list_managers", {
            Manager: manager
        })
    } catch (error) {
        res.status(400).send(error)
    }
}


//* Add manager
//GET
exports.add_manager = async (req, res) => {
    const businessUnit = await BusinessUnit.find({})
    try {
        res.render("adminViews/admin_add_manager", {
            businessUnit: businessUnit
        })
    } catch (e) {
        res.status(400).send(e)
    }

}
//POST
exports.addManager = async (req, res, next) => {
    const {
        username,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth,
        BU_Id } = req.body;

    const existUser = await RoleUser.findOne({ username: username, role: "manager" })
    if (existUser) {
        // const existUsername = "Username has already exist !!!";
        // return res.redirect(`/admin/add_manager?msg=${existUsername}`);
        res.send("username exist")
    }
    try {
        const newUser = await new RoleUser({
            username: username,
            password: password,
            role: "manager"
        })
        await newUser.save()

        const userAcc = await RoleUser.findOne({ username: username })
        const newManger = await new Manager({
            name: name,
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
            age: age,
            dayOfBirth: dayOfBirth,
            businessUnit_id: BU_Id,
            account_id: userAcc._id
        })
        const saveManager = await newManger.save()
        //push into BU
        const businessUnit = await BusinessUnit.findOne({ _id: saveManager.businessUnit_id })
        await businessUnit.manager_id.push(saveManager)
        await businessUnit.save()

        return res.redirect(`/admin/list_all_managers`);

    } catch (error) {
        res.status(400).send(error)
    }

}

//*Update Manager account
//GET
exports.update_manager = async (req, res) => {
    const _id = req.params.id
    const managerAcc = await Manager.findOne({ _id: _id }).populate("businessUnit_id").populate("account_id")
    const businessUnit = await BusinessUnit.find({})
    try {
        res.render("adminViews/admin_update_manager", {
            Manager: managerAcc,
            businessUnit: businessUnit
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateManager = async (req, res) => {
    const {
        manager_id,
        username,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth,
        BU_Id } = req.body;

    const newValueRole = {}
    if (username) newValueRole.username = username

    const newValueManager = {}
    if (name) newValueManager.name = name
    if (email) newValueManager.email = email
    if (fullName) newValueManager.fullName = fullName
    if (phoneNumber) newValueManager.phoneNumber = phoneNumber
    if (age) newValueManager.age = age
    if (dayOfBirth) newValueManager.dayOfBirth = dayOfBirth
    if (BU_Id) newValueManager.businessUnit_id = BU_Id

    try {
        const manager = await Manager.findOne({ _id: manager_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: manager.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )
        //pop out of old BU 
        const oldBusinessUnit = await BusinessUnit.findOneAndUpdate(
            { manager_id: manager._id, },
            { $pull: { manager_id: manager._id } },
            { safe: true, upsert: true }
        )

        const managerUpdate = await Manager.findOneAndUpdate(
            { _id: manager_id },
            { $set: newValueManager },
            { new: true, useFindAndModify: false }
        )
        //push into new BU
        const newBusinessUnit = await BusinessUnit.findOne({ _id: managerUpdate.businessUnit_id })
        await newBusinessUnit.manager_id.push(managerUpdate)
        await newBusinessUnit.save()

        res.redirect(`/admin/update_manager/${manager_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//* Delete manager account
exports.deleteManager = async (req, res) => {
    const { _id } = req.body

    const manager = await Manager.findOne({ _id: _id })
    const roleUser = await RoleUser.findOne({ _id: manager.account_id })

    try {
        //pop out of old BU 
        const businessUnit = await BusinessUnit.findOneAndUpdate(
            { manager_id: manager._id, },
            { $pull: { manager_id: manager._id } },
            { safe: true, upsert: true }
        )
        await manager.remove()
        await roleUser.remove()
        res.redirect(`/admin/list_all_managers`)
    } catch (e) {
        res.status(400).send(e)
    }

}
// //* assign Business Unit for manager
// exports.assign_bu_for_manager = async (req, res, next) => {
//     const { BU_Id, manager_id } = req.body
//     const newValue = {}
//     if (BU_Id) newValue.businessUnit_id = BU_Id
//     console.log(newValue)
//     try {
//         const managerUpdate = await Manager.findOneAndUpdate(
//             { _id: manager_id },
//             { $set: newValue },
//             { new: true, useFindAndModify: false }
//         )
//         res.redirect(`/admin/update_manager/${manager_id}`)
//     } catch (e) {
//         console.log(e)
//         res.status(400).send(e)
//     }

// }
// exports.update_manager = async (req, res) => {
//     const _id = req.params.id
//     const managerAcc = await Manager.findOne({ _id: _id }).populate("businessUnit_id")
//     const businessUnit = await BusinessUnit.find({})
//     try {
//         res.render("adminViews/test", {
//             title: "deoo hieu sao k hien",
//             manager: managerAcc,
//             businessUnit: businessUnit
//         })
//     } catch (e) {
//         res.status(400).send(e)
//     }
// }




//!this field for business unit 
//* list all business unit 
exports.list_all_business_units = async (req, res) => {
    const businessUnit = await BusinessUnit.find({}).populate("amountRequests_id")

    try {
        res.render("adminViews/admin_list_business_units", {
            businessUnit: businessUnit
        })
    } catch (error) {
        res.status(400).send(error)
    }

}
//* Add more business unit 
//GET
exports.add_business_unit = async (req, res) => {
    const businessUnit = await BusinessUnit.find({}).populate("amountRequests_id")
    try {
        res.render("adminViews/admin_add_business_unit", {
            businessUnit: businessUnit
        })
    } catch (error) {
        res.status(400).send(error)
    }

}
//POST
exports.addBusinessUnit = async (req, res) => {
    const existBusinessUnit = await BusinessUnit.findOne({ name: req.body.name })
    if (existBusinessUnit) {
        res.send("business unit exist")
    }
    try {
        const newBusinessUnit = await new BusinessUnit({
            name: req.body.name,
            description: req.body.description
        })
        newBusinessUnit.save()
        res.status(201).send(newBusinessUnit)
    } catch (e) {
        res.status(400).send(e)
    }
}

//* Update Business Unit 
//GET
exports.update_business_unit = async (req, res) => {
    const _id = req.params.id
    const businessUnit = await BusinessUnit.findOne({ _id: _id }).populate("amountRequests_id").populate("staff_id")
    try {
        res.render("adminViews/admin_update_business_unit", {
            businessUnit: businessUnit
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateBusinessUnit = async (req, res) => {

    const {
        businessUnit_id,
        name,
        description
    } = req.body

    const newValue = {}
    if (name) newValue.name = name
    if (description) newValue.description = description

    try {
        const businessUnit = await BusinessUnit.findOne({ _id: businessUnit_id })
        const businessUnitUpdate = await BusinessUnit.findOneAndUpdate(
            { _id: businessUnit._id },
            { $set: newValue },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/admin/update_business_unit/${businessUnit_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//* Delete Business Unit 
exports.deleteBusinessUnit = async (req, res) => {
    const { _id } = req.body

    const businessUnit = await BusinessUnit.findOne({ _id: _id })
    const request = await Request.find({businessUnit_id: _id})
    console.log(request)
    // const staff = await Staff.findOneAndUpdate(
    //     { businessUnit_id: businessUnit._id, },
    //     { $pull: { businessUnit_id: businessUnit._id } },
    //     { safe: true, upsert: true }
    // )
    // const manager = await Manager.findOneAndUpdate(
    //     { businessUnit_id: businessUnit._id, },
    //     { $pull: { businessUnit_id: businessUnit._id } },
    //     { safe: true, upsert: true }
    // )

    
    try {
        // await businessUnit.remove()
        // await request.remove()
        // await staff.remove()
        // await manager.remove()
        res.redirect(`/admin/list_all_business_units`)
    } catch (e) {
        res.status(400).send(e)
    }

}




//!this field for Request Type
//* List all Request Types
exports.list_all_request_types = async (req, res) => {
    const requestType = await RequestType.find({})

    try {
        res.render("adminViews/admin_list_request_types", {
            requestType: requestType
        })
    } catch (error) {
        res.status(400).send(error)
    }
}

//* Add more Request Type
//GET
exports.add_request_type = async (req, res) => {
    const requestType = await RequestType.find({})
    try {
        res.render("adminViews/admin_add_request_type", {
            requestType: requestType
        })
    } catch (error) {
        res.status(400).send(error)
    }
}
//POST
exports.addRequestType = async (req, res) => {
    const existRequestType = await RequestType.findOne({ name: req.body.name })
    if (existRequestType) {
        res.send("Request Type exist")
    }
    try {
        const newRequestType = await new RequestType({
            name: req.body.name,
            description: req.body.description
        })
        newRequestType.save()
        res.status(201).send(newRequestType)
    } catch (e) {
        res.status(400).send(e)
    }
}

//*Update Request Type
//GET
exports.update_request_type = async (req, res) => {
    const _id = req.params.id
    const requestType = await RequestType.findOne({ _id: _id })
    try {
        res.render("adminViews/admin_update_request_type", {
            requestType: requestType
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateRequestType = async (req, res) => {

    const {
        requestType_id,
        name,
        description
    } = req.body

    const newValue = {}
    if (name) newValue.name = name
    if (description) newValue.description = description

    try {
        const requestType = await RequestType.findOne({ _id: requestType_id })
        const requestTypeUpdate = await RequestType.findOneAndUpdate(
            { _id: requestType._id },
            { $set: newValue },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/admin/update_request_type/${requestType_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//*Delete Request Type
exports.deleteRequestType = async (req, res) => {
    const { _id } = req.body

    const requestType = await RequestType.findOne({ _id: _id })
    const request = await Request.find({requestType_id: requestType._id})
    // console.log(businessUnit)
    // console.log(request)
    // console.log(staff)
    // console.log(manager)

    try {
        await requestType.remove()
        await request.remove()
        // await staff.remove()
        // await manager.remove()
        res.redirect(`/admin/list_all_request_types`)
    } catch (e) {
        res.status(400).send(e)
    }

}









