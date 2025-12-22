const SSLCommerzPayment = require("sslcommerz-lts");
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const STORE_ID = process.env.STORE_ID;
const STORE_PASSWORD = process.env.STORE_PASSWORD;



// Store ID: dripz69452df167ad4
// Store Password (API/Secret Key): dripz69452df167ad4@ssl


// Merchant Panel URL: https://sandbox.sslcommerz.com/manage/ (Credential as you inputted in the time of registration)



// Store name: testdripzwnu1
// Registered URL: www.dripzo.com
// Session API to generate transaction: https://sandbox.sslcommerz.com/gwprocess/v3/api.php
// Validation API: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl
// Validation API (Web Service) name: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

// You may check our plugins available for multiple carts and libraries: https://github.com/sslcommerz


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6id7hrn.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const db = client.db("parcelDB");
        const parcelsCollection = db.collection("parcels");


        // ---------------parcel APIs----------------

        app.post("/parcels", async (req, res) => {
            try {
                const parcel = req.body;

                const result = await parcelsCollection.insertOne(parcel);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to create parcel" });
            }
        });


        // app.get("/parcels", async (req, res) => {
        //     const result = await parcelsCollection.find().toArray();
        //     res.send(result);
        // });


        app.get("/parcels", async (req, res) => {
            const email = req.query.email;

            if (!email) {
                return res.status(400).send({ message: "Email query is required" });
            }

            const query = { userEmail: email };
            const result = await parcelsCollection
                .find(query)
                .sort({ submissionDateTime: -1 })
                .toArray();;

            res.send(result);
        });


        app.get("/parcels/:id", async (req, res) => {
            const id = req.params.id;

            const result = await parcelsCollection.findOne({
                _id: new ObjectId(id),
            });

            res.send(result);
        })

        // -------------- payment APIs ---------------

        app.post("/create-payment", async (req, res) => {
            const { parcelId, amount, customerName, customerEmail } = req.body
            console.log(payment, 'recievng payemnt data from cl')
            const tranId = new ObjectId().toString();
            const data = {

                store_id: `${process.env.STORE_ID}`,
                store_passwd: `${process.env.STORE_PASSWORD}`,
                total_amount: amount,
                tran_id: tranId,
                success_url: "http://yoursite.com/success.php",
                fail_url: "http://yoursite.com/fail.php",
                cancel_url: "http://yoursite.com/cancel.php",
                cus_name:  customerName,
                cus_email: customerEmail,
                parcel_ID: parcelId


            }
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
