const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const parkingController = require('../controller/parkingController');
const bookingController = require('../controller/bookingController');


//user routes
router.post('/user/add', userController.add);
router.post('/user/login', userController.login)
router.get('/user/getById/:id', userController.getById)
router.put('/user/update/:id', userController.update)
router.put('/user/updateBalance/:id', userController.updateBalance)
// router.get('/lease/getall', userController.getAll);
// router.get('/lease/search', userController.search);
router.get('/parking/getAll', parkingController.getAll);
router.get('/parking/updateParking', parkingController.updateParking);
router.post('/parking/postCheck', parkingController.postCheck);
router.post('/parking/add', parkingController.add);

router.get("/booking/getById/:id", bookingController.getById);
router.post("/booking/add", bookingController.add);
router.delete("/booking/delete/:id", bookingController.delete)
router.put('/booking/update/:id', bookingController.update)



module.exports = router;