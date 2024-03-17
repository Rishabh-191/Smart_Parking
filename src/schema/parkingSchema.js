const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

// const SlotSchema = new mongoose.Schema({
//     slot: { type: String },
//     status: { type: String, enum: ['available', 'occupied', 'booked']}  
//   },
//   { _id: false });
  
const parkingschema = mongoose.Schema({
        parkingname: { type: String},
        p1: {type: String},
        p2: {type: String},
        p3: {type: String},
        p4: {type: String},
        p5: {type: String},
        p6: {type: String},
        p7: {type: String},
        p8: {type: String},
        p9: {type: String},
        p10: {type: String},
        p11: {type: String},
        p12: {type: String},
        p13: {type: String},
        p14: {type: String},
    }, {
        timestamps: true
    }
);

const parking = mongoose.model('parking', parkingschema);
module.exports = parking;