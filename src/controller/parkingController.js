const parking = require('../schema/parkingSchema');

//const emitter = require('../../index');

exports.getAll = async(req, res) => {
    try {
        let data = await parking.find()    
        res.json(data[0]);
    } catch (err) {
        res.status(500).json(err)
    }
};

exports.updateParking = async(req, res) => {
    try {
        const slot = req.query.slot;
        const status = req.query.status;
        const userData = await parking.findByIdAndUpdate({ "_id": "65d738cb6f3620f15d6ccdc6" },{ $set: { [slot]: status } },{ new: true } )
        //res.removeHeader('Keep-Alive');
        //res.removeHeader('Date');;
        res.json({message: "ok"});
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.postCheck = async(req, res) => {
    try {   
        //res.json({});
        //const userData = await parking.findByIdAndUpdate({ "_id": "65d738cb6f3620f15d6ccdc6" }, req.body ,{ new: true } )
        
        const userData=await parking.findByIdAndUpdate({ "_id": "65d738cb6f3620f15d6ccdc6" }, req.body ,{ new: true } )

        res.json({status: "updated"});
        //emitter.updatepark(userData);
    } catch (err) {
        res.status(500).json(err)
    }
};


exports.add = async(req, res) => {
    try {
        console.log(req.body)
        const parkingData = new parking(req.body);
        const pdata = await parkingData.save();

        res.json({ message: "success", data: pdata });
    } catch (err) {
        res.status(500).json(err)
    }
};

    