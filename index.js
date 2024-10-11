// const express = require('express')
// const dotenv = require('dotenv')
// const cors = require('cors')
// const bodyParser = require('body-parser');
// const db = require('./src/db/db');
// const apis = require('./src/routes/routes');
// const socketio = require('socket.io');
// const http = require('http');

// const parking = require('./src/schema/parkingSchema');

// const ip = "192.168.64.12";

// const app = express()
// dotenv.config({ path: '.env' })
// const PORT = process.env.PORT || 3000;
// app.use(cors({origin: '*' }))
// app.use(bodyParser.json())
// app.use('/', apis);

// // app.listen(PORT, ip, ()=>{
// //     console.log("server started")
// // })


// const server = http.createServer(app);
// const io = socketio(server,{
//   cors: {
//     origin: '*',
//   }
// });


// io.on('connection', (socket) => {
//     console.log('A user connected');   
//     // Handle events from the client
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//         // Broadcast the message to all connected clients
//         io.emit('chat message', msg);
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// server.listen(PORT, ip, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// exports.updatepark = (data) => {io.emit('hello', data);}

/////////////////////////////////////////////////////
const express = require('express');
const expressWs = require('express-ws');
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./src/db/db');
const apis = require('./src/routes/routes');
const parking = require('./src/schema/parkingSchema');
const cron = require('node-cron');
const user = require('./src/schema/userSchema');
const booking = require('./src/schema/bookingSchema');

////////////////node-cron////////////////////
cron.schedule('*/10 * * * * *',async () => {
    console.log("running schedular")
    try {
        let data = await booking.find();
        for (let i = 0; i < data.length; i++) {
            const bookingData = data[i];
            const storedDateTime = bookingData?.reservetime;
            const currentDateTime = new Date();


            if (storedDateTime < currentDateTime && bookingData?.status === 'booked') {
                
                await booking.findByIdAndDelete(bookingData?._id)
                const pData = await parking.findByIdAndUpdate({ "_id": "65e9621bd0f445c63fef5e7d" }, {[bookingData.slot]: 'vacant'}, { new: true })
            
                wsConnections.forEach(connection => {
                    connection.send("{\"event\": \"parking updated\", \"data\":" + JSON.stringify(pData) + "}");
                });
                

            }
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }

});

/////////////////////////////////////////////////

const app = express();
const appWs = expressWs(app);

dotenv.config({ path: '.env' })
const PORT = process.env.PORT || 3000;
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use('/', apis);


let wsConnections = []; // Array to store WebSocket connections

// WebSocket Endpoint Setup
app.ws('/echo', ws => {
    // Add new WebSocket connection to the array
    wsConnections.push(ws);

    ws.on('message', async (msg) => {

        console.log(msg, "tttttttttttt")

        const data = JSON.parse(msg);
        if (data.event == "sensor_update") {
            console.log('sensor_update event, updating data in database');

            const pData = await parking.findByIdAndUpdate({ "_id": "65e9621bd0f445c63fef5e7d" }, data.data, { new: true })
            
            wsConnections.forEach(connection => {
                connection.send("{\"event\": \"parking updated\", \"data\":" + JSON.stringify(pData) + "}");
            });
        }

        else if (data.event == "gate") {
            wsConnections.forEach(connection => {
                connection.send(msg);
            });
        } else if (data.event == "gate_open_command") {
            wsConnections.forEach(connection => {
                connection.send(msg);
            });
        } else if (data.event == "gate_open_exit_command") {
            wsConnections.forEach(connection => {
                connection.send(msg);
            });
        } else if (data.event == "gate_open_front") {
            console.log("hhhhh")
            wsConnections.forEach(connection => {
                connection.send(msg);
            });
        } else if (data.event == "gate_close_front") {
            console.log("hhhhh")
            wsConnections.forEach(connection => {
                connection.send(msg);
            });
        } else if (data.event == "gate_open_back") {
            console.log("hhhhh")
            wsConnections.forEach(connection => {
                connection.send(msg);
            });
        } else if (data.event == "gate_close_back") {
            console.log("hhhhh")
            wsConnections.forEach(connection => {
                connection.send(msg);
            });
        }

    });

    // Handle WebSocket close event to remove closed connections from the array
    ws.on('close', () => {
        wsConnections = wsConnections.filter(connection => connection !== ws);
    });
});

app.post('/updateParking', async (req, res) => {


    const pData = await parking.findByIdAndUpdate({ "_id": "65e9621bd0f445c63fef5e7d" }, req.body, { new: true })
    wsConnections.forEach(connection => {
        connection.send("{\"event\": \"parking updated\", \"data\":" + JSON.stringify(pData) + "}");
    });


    res.json({ message: "success", data: pData });
});

//////////////////////////////////////////////////////////////////////////

// app.put('/parking/update/:parkingId', async (req, res) => {
//     try {
//         const { parkingId } = req.params;
//         const { slot, status } = req.body;

//         const updatedParkingRecord = await parking.findOneAndUpdate(
//             { _id: parkingId, 'slots.slot': slot },
//             { $set: { 'slots.$.status': status } },
//             { new: true }
//         );

//         if (!updatedParkingRecord) {
//             return res.status(404).json({ error: 'Parking facility or slot not found' });
//         }

//         wsConnections.forEach(connection => {
//             connection.send("{\"event\": \"parking updated\", \"data\":" + JSON.stringify(updatedParkingRecord) + "}");
//         });
//         res.json({ message: 'Slot status updated successfully', data: updatedParkingRecord });
//     } catch (error) {
//         console.error('Error updating slot status:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

////////////////////////////////////////////////////////////////

const ip = "localhost";
app.listen(PORT, ip, () => console.log('Server has been started'));


module.exports.wsConnections = wsConnections;
module.exports.appWs = appWs;
