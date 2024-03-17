const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const userschema = mongoose.Schema({
        username: {
            type: String
        },
        password: {
            type: String
        },
        email: {
            type: String
        },
        role: {
            type: String
        },
        balance: {
            type: Number
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'booking'
        }
    }, {
        timestamps: true
    }
);

const user = mongoose.model('user', userschema);
module.exports = user;