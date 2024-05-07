const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    //1
    doctorId: {
        type: String
    },
    //2
    doctorName: {
        type: String
    },
    //3
    doctorEmail: {
        type: String
    },
    //4
    doctorPhoneNumber: {
        type: Number
    },
    //5
    doctorSpecialization: {
        type: String
    },
    //6
    docAdded:{
        type:Date
    }
});

const Doctor = mongoose.model("doctor", DoctorSchema);

module.exports = Doctor;