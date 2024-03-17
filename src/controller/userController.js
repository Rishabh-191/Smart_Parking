const { request } = require('express');
const user = require('../schema/userSchema');
const booking = require('../schema/bookingSchema')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
//const notification = require('../notification/email');

exports.login = async (req, res) => {
    try {

        console.log(req.body);
        const salt = await bcrypt.genSalt(10);
        //req.body.password = await bcrypt.hash(req.body.password, salt);
        const userData = await user.findOne({ email: req.body.email });


        if (!userData) {
            res.json({ message: "User not found" });
            return;
        }

        const passwordMatch = await bcrypt.compare(req.body.password, userData.password);

        if (passwordMatch && req.body.role == userData.role) {

            const apptoken = jwt.sign({ userId: userData.id }, 'xxxxxxxxxxxxxxx', { expiresIn: '1h' });

            res.json({ message: "success", data: userData, token: apptoken });
        } else {
            res.json({ message: "Wrong credentials" });
        }
    } catch (err) {
        res.status(500).json(err)

    }
};

exports.add = async (req, res) => {
    try {
        console.log(req.body)
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)
        const userData = new user(req.body);
        await userData.save();

        res.json({ message: "success", data: userData });
    } catch (err) {
        res.status(500).json(err)
    }
};
// exports.add = async(req, res) => {
//     try {
//         const userData = new lease(req.body);
//         await userData.save();       
//         res.json({ message: "lease added successfully", data: userData });
//     } catch (err) {
//         res.status(500).json(err)
//     }
// };

// exports.addMany = async(req, res) => {
//     try {
//         await lease.insertMany(req.body);     
//         res.json({ message: "leases added successfully" });
//     } catch (err) {
//         res.status(500).json(err)
//     }
// };
// exports.getAll = async(req, res) => {
//     try {
//         let data = await lease.find()    
//         res.json(data);
//     } catch (err) {
//         res.status(500).json(err)
//     }
// };
// exports.get = async(req, res) => {

//     try {

//         let userData = {name: "rajveer"}

//         res.json(userData);
//     } catch (error) {
//         console.log(error);
//         if (!error.status) {
//             error.status = 500;
//         }

//         res.status(error.status).json({ message: error.message });
//     }

// }

// exports.search = async (req, res) => {
//     const filters = req.query;
//     if (filters.startDate) {
//         filters.validity = { $gte: new Date(filters.startDate) };
//         delete filters.startDate;
//       }

//       if (filters.endDate) {
//         filters.validity = { ...filters.validity, $lte: new Date(filters.endDate) };
//         delete filters.endDate;
//       }
//   try {
//     console.log(filters)
//     //const leases = await lease.find(filters);
//     const leases = await lease.find(filters);

//     res.json(leases);
//   } catch (err) {
//     console.error('Error searching leases:', err.message);
//     res.status(500).send('Server Error');
//   }
// }

exports.getById = async (req, res) => {
    try {
        const data = await user.findById(req.params.id).populate('booking')
        if (data) {
            res.json({ message: "success", data: data })
        } else {
            res.json({ message: "error"})
        }

        /////////////////////////////////////////////////////
        // if (data.booking === null) {
        //     res.json({ message: "success", data: data })
        // } else {
        //     const storedDateTime = data?.booking?.reservetime;
        //     const currentDateTime = new Date();
        //     if (storedDateTime < currentDateTime && data?.booking?.status === 'booked') {
        //         const bookingupdate=await booking.findByIdAndUpdate(data.booking._id, { $set: { status: 'expired'} }, { new: true })
        //         console.log(bookingupdate,"booking update")
        //         console.log(data, "users id")
        //         const data1=await user.findByIdAndUpdate(data._id, { $set: {booking: null}}, { new: true }).populate('booking');
        //         console.log(data1,"user update")
        //         res.json({ message: "success", data: data1 })

        //     }else{
        //         res.json({ message: "success", data: data })
        //     }
        // }


        /////////////////////////////////////////////////////
    } catch (err) {
        res.status(500).json(err)
    }
}
exports.update = async (req, res) => {
    try {
        const userData = await user.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).populate('booking');
        res.json({ message: 'success', data: userData });
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.updateBalance = async (req, res) => {
    try {

        const data = await user.findById(req.params.id).populate('booking')
        const newBalance = data.balance - req.body.balanceCut 
        const userData = await user.findByIdAndUpdate(req.params.id, { balance: newBalance }, { new: true }).populate('booking');
        res.json({ message: 'success', data: userData });
    } catch (err) {
        res.status(500).json(err)
    }
}
// exports.delete = async(req, res) => {

//     const userData = await user.findByIdAndDelete(req.params.id);
//     try {
//         if (!userData) {
//             res.status(400).json({ message: "user not found." });
//         }
//         res.status(200).json({ message: 'user deleted successfully' });
//     } catch (err) {
//         res.status(500).json(err)
//     }


// }