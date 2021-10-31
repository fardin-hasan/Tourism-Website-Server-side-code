const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const port = 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ex382.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("vacation");
        const allDestinations = database.collection("destinations");
        const allBookings = database.collection("bookings");

        // find all data
        app.get('/destinations', async (req, res) => {
            const cursor = allDestinations.find({});
            const destinations = await cursor.limit(6).toArray();

            res.send(destinations);
        });
        // find all data
        app.get('/allPackage', async (req, res) => {
            const cursor = allDestinations.find({});
            const destinations = await cursor.toArray();

            res.send(destinations);
        });
        // post bookings
        app.post('/destination', async (req, res) => {
            const service = req.body;
            const result = await allDestinations.insertOne(service);
            res.json(result)
        })

        // find a specific data
        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await allDestinations.findOne(query);
            res.send(user);
        });
        // place order data
        app.post('/bookings', async (req, res) => {

            const bookings = req.body;
            const result = await allBookings.insertOne(bookings);
            res.json(result);
        });
        // get order data 
        app.get('/manageAllBooking', async (req, res) => {
            const cursor = allBookings.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })

        // delete booking
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allBookings.deleteMany(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})