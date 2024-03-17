const { request } = require('express');
const booking = require('../schema/bookingSchema');


exports.add = async(req, res) => {
    try {
        const bookingData = new booking(req.body);
        await bookingData.save();
        res.json({ message: "success", data: bookingData });
    } catch (err) {
        res.status(500).json(err)
    }
};


exports.getById = async(req, res) => {
    try {
        const data = await booking.findById(req.params.id)
        if(data){res.json({ message: "success", data: data })}else{
            res.json({ message: "no booking", data: data })
        }
        
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.delete = async(req, res) => {

    console.log("goind to delete booking:",req.params.id )

    const userData = await booking.findByIdAndDelete(req.params.id);
    try {
        if (userData) {
            res.status(200).json({ message: 'success', data: userData });
            
        }else{
            res.status(400).json({ message: "booking not found." }); 
        }
        
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.update = async (req, res) => {
    try {
        const bookingData = await booking.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.json({ message: 'success', data: bookingData });
    } catch (err) {
        res.status(500).json(err)
    }
}