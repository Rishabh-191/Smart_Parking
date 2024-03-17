const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const bookingschema = mongoose.Schema({
        registration: {
            type: String
        },
        parkingid: {
            type: String
        },
        slot: {
            type: String
        },
        status: {
            type: String
        },
        reservetime: {
            type: Date
        },
        userid: {
            type: String
        }
    }, {
        timestamps: true
    }
);

const booking = mongoose.model('booking', bookingschema);
module.exports = booking;