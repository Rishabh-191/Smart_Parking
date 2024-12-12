const e = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const userschema = mongoose.Schema({
        username: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlegth: 6
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'user'],
        },
        balance: {
            type: Number,
            default: 0
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