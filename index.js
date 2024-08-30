const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// middle are
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@ecommercedatabase.la5qrjd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerceDatabase`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const serviceCollection = client.db('carDoctor').collection('services');
        const bookingCollection = client.db('carDoctor').collection('bookings');

        // Service Related API
        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find().toArray();
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        // Booking Related API

        // create jwt token and set cookie
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h',
            });

            console.log('jwt token', token);

            res.send(token);
        });

        // With query params
        app.get(`/bookings`, async (req, res) => {
            console.log(req.query.email);
            let filter = {};
            if (req.query?.email) {
                filter = {email: req.query.email};
            }
            const result = await bookingCollection.find(filter).toArray();
            res.send(result);
        });

        // With email params
        /* app.get(`/bookings/:email`, async (req, res) => {
            const email = req.params.email;
            const filter = {email: email};
            const result = await bookingCollection.find(filter).toArray();
            res.send(result);
        }); */

        app.post('/bookings', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await bookingCollection.insertOne(data);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db('admin').command({ping: 1});
        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        );
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello from server setup');
});

app.listen(port, () => {
    console.log(`server is running via : localhost:${port}`);
});
