const mongoose = require('mongoose')
// mongoose.connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })

mongoose.connect('MONGODB_URL=mongodb://127.0.0.1:27017/leave-management-system', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("Connection to DB ...."))
    .catch((err) => console.log(`Connect to Db failed. Error: ${err}`));

module.exports = mongoose