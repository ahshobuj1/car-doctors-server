const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion} = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

console.log('dotenv ', process.env.DB_NAME);

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

        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find().toArray();
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
