const { request } = require('express');
const user = require('../schema/userSchema');
const booking = require('../schema/bookingSchema')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
//const notification = require('../notification/email');

exports.login = async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password, role } = req.body;

        // Check if all required fields are provided
        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user by email
        const userData = await user.findOne({ email });
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Verify the role
        if (role !== userData.role) {
            return res.status(403).json({ message: "Unauthorized role" });
        }

        // Generate JWT token
        const apptoken = jwt.sign(
            { userId: userData.id, role: userData.role },
            process.env.JWT_SECRET || 'defaultSecretKey', // Use environment variables for security
            { expiresIn: '1h' }
        );

        // Respond with success message and token
        res.status(200).json({
            message: "Login successful",
            token: apptoken,
            user: {
                id: userData.id,
                email: userData.email,
                role: userData.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized or invalid token" });
        }

        // Attach decoded user info to request object
        req.user = decoded;
        next();
    });
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

exports.getByName = async (req, res) => {
    try {
        const userData = await user.findOne({ name: req.params.name }).populate('booking');
        if (userData) {
            res.json({ message: "success", data: userData });
        } else {
            res.json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAll = async (req, res) => {
    try {
        const users = await user.find().populate('booking');
        res.json({ message: "success", data: users });
    } catch (err) {
        res.status(500).json(err);
    }
};

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