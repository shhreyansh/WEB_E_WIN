const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    //1
    userId: {
        type: String
    },
    //2
    userName: {
        type: String
    },
    //3
    userEmail: {
        type: String
    },
    //4
    userPhoneNumber: {
        type: Number
    },
    //5
    userSpecialization: {
        type: String
    },
    //5
    userQuery: {
        type: String
    },
    //6
    userQueryDate: {
        type: Date
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;