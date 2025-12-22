const express = require("express");
const qs = require("qs");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { default: axios } = require("axios");
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


        const parcelsCollection = client.db("parcelDB").collection("parcels");
        const paymentsCollection= client.db("parcelDB").collection("payments")



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
            const { transactionId, parcelId, amount, customerName, customerEmail } = req.body
            //    const payment = req.body
            //     console.log(payment, 'recievng payemnt data from cl')
            const tranId = new ObjectId().toString();


            await paymentsCollection.insertOne({
                tranId,
                parcelId,
                amount: Number(amount),
                customerName,
                customerEmail,
                status: "pending",
                createdAt: new Date()
            });

            const initiate = {
                store_id: "dripz69452df167ad4",
                store_passwd: "dripz69452df167ad4@ssl",

                total_amount: amount,
                currency: "BDT",
                tran_id: tranId,

                success_url: "http://localhost:5000/payment-success",
                fail_url: "http://localhost:5000/payment-fail",
                cancel_url: "http://localhost:5000/payment-cancel",
                shipping_method: "Courier",
                product_name: "Parcel Delivery",
                product_category: "Logistics",
                product_profile: "general",
                cus_name: customerName,
                cus_email: customerEmail,
                cus_add1: "Dhaka",
                cus_add2: "Dhaka",
                cus_city: "Dhaka",
                cus_state: "Dhaka",
                cus_postcode: "1000",
                cus_country: "Bangladesh",
                cus_phone: "01711111111",
                cus_fax: "01711111111",

                ship_name: customerName,
                ship_add1: "Dhaka",
                ship_add2: "Dhaka",
                ship_city: "Dhaka",
                ship_state: "Dhaka",
                ship_postcode: "1000",
                ship_country: "Bangladesh",

                multi_card_name: "mastercard,visacard,amexcard",

                value_a: "ref001_A",
                value_b: "ref002_B",
                value_c: "ref003_C",
                value_d: "ref004_D",
            };


            const response = await axios({
                url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
                method: "POST",
                data: initiate,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })


            const gateWayPageUrl = response?.data?.GatewayPageURL
            res.send({gateWayPageUrl})
            console.log(response, gateWayPageUrl, "ssl comerce hitting")
            console.log(gateWayPageUrl, "url gateway ")

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
