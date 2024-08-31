const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;

// middle are
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    })
);

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@ecommercedatabase.la5qrjd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerceDatabase`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// * middlewares

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log('verifyToken', token);
    if (!token) {
        return res.status(401).send('unauthorized access');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('unauthorized access');
        }
        req.user = decoded;
        console.log('req user decoded', req.user);
        next();
    });
};

//logger for testing
const logger = (req, res, next) => {
    console.log('middlewares', req.method, req.url);
    next();
};

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const serviceCollection = client.db('carDoctor').collection('services');
        const bookingCollection = client.db('carDoctor').collection('bookings');

        //Auth related API
        // create jwt token and set cookie

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h',
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            }).send({success: true});
        });

        app.post('/logout', async (req, res) => {
            const user = req.body;
            res.clearCookie('token', {maxAge: 0}).send({success: true});
        });

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

        // With query params
        app.get(`/bookings`, logger, verifyToken, async (req, res) => {
            console.log(req.query.email);
            if (req?.user?.email !== req?.query?.email) {
                return res.status(403).send({message: 'forbidden user'});
            }

            // cookie read
            console.log('jwt token', req.cookies);

            let filter = {};
            if (req.query?.email) {
                filter = {email: req.query.email};
            }
            const result = await bookingCollection.find(filter).toArray();
            res.send(result);
        });

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
