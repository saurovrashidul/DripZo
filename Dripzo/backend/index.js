const express = require("express");
const qs = require("qs");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { default: axios } = require("axios");
require("dotenv").config();



const app = express();
const port = process.env.PORT || 5000;


// middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173"], // your frontend
        credentials: true, // IMPORTANT
    })
);

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
        const paymentsCollection = client.db("parcelDB").collection("payments")
        const ridersCollection = client.db("parcelDB").collection("riders")
        const usersCollection = client.db("parcelDB").collection("users")

        // const verifyToken = (req, res, next) => {
        //     const token = req.cookies.token;

        //     if (!token) {
        //         return res.status(401).send({ message: "Unauthorized" });
        //     }

        //     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        //         if (err) {
        //             return res.status(401).send({ message: "Invalid token" });
        //         }

        //         req.decoded = decoded;
        //         next();
        //     });
        // };



        const verifyToken = (req, res, next) => {
            // Read token from cookie
            const token = req.cookies?.token;

            if (!token) {
                return res.status(401).json({ message: "Unauthorized: No token provided" });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded; // attach user info to request
                next(); // allow access
            } catch (err) {
                return res.status(403).json({ message: "Forbidden: Invalid token" });
            }
        };




        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            console.log(email, "verifyadmin email")
            if (!email) return res.status(401).json({ message: "Unauthorized: No user" });

            const user = await usersCollection.findOne({ email });
            console.log(user)
            if (!user || user.role !== "admin") {
                return res.status(403).send({ message: "Forbidden" });
            }

            next();
        };

        // {{{{-----------token-------------}}}

        // app.post("/jwt", async (req, res) => {
        //      console.log("JWT route hit:", req.body);
        //     const user = req.body; // { email }

        //     const token = jwt.sign(
        //         user,
        //         process.env.JWT_SECRET,
        //         { expiresIn: "7d" }
        //     );

        //     res
        //         .cookie("token", token, {
        //             httpOnly: true,
        //             secure: process.env.NODE_ENV === "production",
        //             sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        //             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        //         })
        //         .send({ success: true });
        // });

        app.post("/jwt", async (req, res) => {
            console.log("JWT route hit:", req.body);

            const user = req.body; // e.g., { email }

            // Create JWT token
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

            // Set cookie
            res
                .cookie("token", token, {
                    httpOnly: true,            // ✅ cookie is not accessible via JS
                    secure: false,             // 🔹 false for localhost
                    sameSite: "lax",           // 🔹 allows frontend (different port) to send cookie
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                })
                .send({ success: true });
        });


        // app.post("/jwt", async (req, res) => {
        //   console.log("JWT route hit:", req.body);

        //   const user = req.body;

        //   const token = jwt.sign(user, process.env.JWT_SECRET, {
        //     expiresIn: "7d",
        //   });

        //   res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: false,       // 🔴 TEMPORARY for localhost
        //     sameSite: "lax",     // 🔴 TEMPORARY
        //   });

        //   res.send({ success: true });
        // });


        app.post("/logout", (req, res) => {
            res
                .clearCookie("token", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                })
                .send({ success: true });
        });



        // {{{{{{{{-----------user APIs-----------}}}}}}}}}}

        app.post("/users", async (req, res) => {
            const { name, email } = req.body;

            const existingUser = await usersCollection.findOne({ email });

            if (existingUser) {
                await usersCollection.updateOne(
                    { email },
                    { $set: { lastLogin: new Date() } }
                );
                return res.send({ message: "Login time updated" });
            }

            await usersCollection.insertOne({
                name,
                email,
                role: "user",
                createdAt: new Date(),
                lastLogin: new Date(),
            });

            res.status(201).send({ message: "User saved" });
        });




        // Fetch all users

        app.get("/users", async (req, res) => {
            try {
                const { email } = req.query;
                const query = email
                    ? { email: { $regex: email, $options: "i" } } // partial, case-insensitive match
                    : {};

                // Find users and convert cursor to array
                const users = await usersCollection
                    .find(query)
                    .sort({ createdAt: -1 }) // sort by newest first
                    .toArray(); // <-- IMPORTANT: convert cursor to array

                res.json(users);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to fetch users" });
            }
        });

        app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email;

            const user = await usersCollection.findOne({ email });

            res.json({ admin: user?.role === "admin" });
        });


        // Make / remove admin
        app.patch("/users/admin/:id", async (req, res) => {
            const { id } = req.params;
            const { makeAdmin } = req.body;
            try {
                const role = makeAdmin ? "admin" : "user"; // reset to normal user if removing
                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { role } }
                );
                res.json(result);
            } catch (err) {
                res.status(500).json({ message: "Failed to update role" });
            }
        });

        // Delete user
        app.delete("/users/:id", async (req, res) => {
            const { id } = req.params;
            try {
                const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (err) {
                res.status(500).json({ message: "Failed to delete user" });
            }
        });









        // {{{{{---------------parcel APIs----------------}}}}}



        app.post("/parcels", async (req, res) => {
            try {
                const parcel = {
                    ...req.body,
                    deliveryStatus: "not collected", // ✅ default value
                };

                const result = await parcelsCollection.insertOne(parcel);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to create parcel" });
            }
        });


        // GET /parcels/all → fetch all parcels for a user


        app.get("/parcels", async (req, res) => {
            try {
                const email = req.query.email;
                let query = {};

                // 🔹 Filter by email if provided
                if (email) {
                    query.userEmail = email;
                }

                // 🔹 NEW: exclude parcels that are already assigned
                // query.deliveryStatus = { $ne: "assigned" }; // ✅ Added this line
                // query.deliveryStatus = { $nin: ["assigned", "enroute", "delivered", "not collected"] };


                const result = await parcelsCollection
                    .find(query)
                    .sort({ submissionDateTime: -1 })
                    .toArray();

                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch parcels" });
            }
        });



        // app.get("/parcels/all", async (req, res) => {
        //     try {
        //         const email = req.query.email;
        //         let query = {};

        //         if (email) {
        //             query.userEmail = email;
        //         }

        //         // No deliveryStatus filter here → fetch everything
        //         const result = await parcelsCollection
        //             .find(query)
        //             .sort({ submissionDateTime: -1 })
        //             .toArray();

        //         res.send(result);
        //     } catch (error) {
        //         res.status(500).send({ message: "Failed to fetch parcels" });
        //     }
        // });







        //         const { email } = req.query;
        //         const query = email ? { userEmail: email } : {};

        //         const parcels = await parcelsCollection
        //             .find(query)
        //             .sort({ submissionDateTime: -1 })
        //             .project({
        //                 trackingID: 1,
        //                 type: 1,
        //                 senderRegion: 1,
        //                 receiverRegion: 1,
        //                 totalCost: 1,
        //                 submissionDateTime: 1,
        //                 userEmail: 1,
        //                 deliveryStatus: 1
        //             })
        //             .toArray();

        //         res.send(parcels);
        //     } catch (error) {
        //         res.status(500).send({ message: "Failed to fetch parcels" });
        //     }
        // });




        // app.get("/parcels", async (req, res) => {
        //     const email = req.query.email;

        //     if (!email) {
        //         return res.status(400).send({ message: "Email query is required" });
        //     }

        //     const query = { userEmail: email };
        //     const result = await parcelsCollection
        //         .find(query)
        //         .sort({ submissionDateTime: -1 })
        //         .toArray();;

        //     res.send(result);
        // });


        // GET pending deliveries for a rider

        // GET pending parcels for a rider by email
      

        app.get("/parcels/assignable", async (req, res) => {
  try {
    const query = {
      assignedRider: { $exists: false },
      deliveryStatus: { $ne: "delivered" }
    };

    const result = await parcelsCollection
      .find(query)
      .sort({ submissionDateTime: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch assignable parcels" });
  }
});

      
        app.get("/parcels/pending", async (req, res) => {
            try {
                const { email } = req.query; // rider email

                if (!email) {
                    return res.status(400).send({ message: "Email query is required" });
                }

                // Find the rider by email
                const rider = await ridersCollection.findOne({ email, status: "approved" });
                if (!rider) {
                    return res.status(403).send({ message: "Unauthorized or rider not found" });
                }

                // Find parcels assigned to this rider and not delivered
                const parcels = await parcelsCollection
                    .find({
                        // deliveryStatus: "assigned",
                        deliveryStatus: { $in: ["assigned", "enroute"] },

                        "assignedRider.riderId": rider._id,
                    })
                    .sort({ assignedAt: -1 })
                    .toArray();

                res.send(parcels);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "Failed to fetch pending deliveries" });
            }
        });



        // app.get("/parcels/:id", async (req, res) => {
        //     const id = req.params.id;

        //     const result = await parcelsCollection.findOne({
        //         _id: new ObjectId(id),
        //     });

        //     res.send(result);
        // })




        app.delete("/parcels/:id", async (req, res) => {
            const id = req.params.id;

            try {
                const result = await parcelsCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) {
                    return res.status(404).send({ message: "Parcel not found" });
                }
                res.send({ message: "Parcel deleted successfully" });
            } catch (error) {
                res.status(500).send({ message: "Failed to delete parcel" });
            }
        });



        app.patch("/parcels/:id/delivery-status", async (req, res) => {
            try {
                const { id } = req.params;
                const { status } = req.body;

                const validStatus = ["enroute", "delivered"];

                if (!validStatus.includes(status)) {
                    return res.status(400).send({ message: "Invalid delivery status" });
                }

                const updateData = {
                    deliveryStatus: status,
                };

                // optional timestamps (recommended)
                if (status === "enroute") {
                    updateData.collectedAt = new Date();
                }

                if (status === "delivered") {
                    updateData.deliveredAt = new Date();
                }

                const result = await parcelsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).send({ message: "Parcel not updated" });
                }

                res.send({
                    message: "Delivery status updated",
                    status,
                });
            } catch (error) {
                res.status(500).send({ message: "Failed to update delivery status" });
            }
        });


        // GET delivered parcels for a rider
        app.get("/parcels/delivered", async (req, res) => {
            try {
                const { email } = req.query;

                if (!email) {
                    return res.status(400).send({ message: "Email is required" });
                }

                const rider = await ridersCollection.findOne({
                    email,
                    status: "approved",
                });

                if (!rider) {
                    return res.status(403).send({ message: "Unauthorized rider" });
                }

                const parcels = await parcelsCollection
                    .find({
                        deliveryStatus: "delivered",
                        "assignedRider.email": email,
                    })
                    .sort({ deliveredAt: -1 })
                    .toArray();

                res.send(parcels);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "Failed to fetch delivered parcels" });
            }
        });


        app.patch("/parcels/cash-out/:id", async (req, res) => {
            try {
                const { id } = req.params;
                const { earningAmount } = req.body;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ message: "Invalid parcel ID" });
                }

                const result = await parcelsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: {
                            "assignedRider.riderPayment": "cashed out",
                            "assignedRider.earningAmount": earningAmount,
                        },
                    }
                );

                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "Cash out failed" });
            }
        });



        app.get("/parcels/:id", async (req, res) => {
            try {
                const { id } = req.params;

                // ✅ VALIDATION (VERY IMPORTANT)
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ message: "Invalid parcel ID" });
                }

                const result = await parcelsCollection.findOne({
                    _id: new ObjectId(id),
                });

                if (!result) {
                    return res.status(404).send({ message: "Parcel not found" });
                }

                res.send(result);
            } catch (error) {
                console.error("Get parcel error:", error);
                res.status(500).send({ message: "Server error" });
            }
        });


        // {{{{{-------------- payment APIs ---------------}}}}}

        app.post("/create-payment", async (req, res) => {
            const { transactionId, parcelId, amount, customerName, customerEmail } = req.body
            //    const payment = req.body
            //     console.log(payment, 'recievng payemnt data from cl')
            const tranId = new ObjectId().toString();


            await paymentsCollection.insertOne({
                tranId,
                // parcelId,
                parcelId: new ObjectId(parcelId),
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
            res.send({ gateWayPageUrl })
            // console.log(response, gateWayPageUrl, "ssl comerce hitting")
            // console.log(gateWayPageUrl, "url gateway ")

        })


        // ----------successPayment api----------------


        app.post("/payment-success", async (req, res) => {
            const successPayment = req.body;

            // Validate payment with SSLCommerz
            const isValid = await axios.get(
                `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${successPayment.val_id}&store_id=${STORE_ID}&store_passwd=${STORE_PASSWORD}&format=json`
            );

            if (isValid.data.status === "VALID") {

                await paymentsCollection.updateOne(
                    { tranId: isValid.data.tran_id },
                    {
                        $set: {
                            status: "success",
                            paidAt: new Date(),
                        },
                    }
                );

                const paymentInfo = await paymentsCollection.findOne({
                    tranId: isValid.data.tran_id,
                });

                if (!paymentInfo) {
                    return res.status(404).send({ message: "Payment record not found" });
                }

                const parcelUpdate = await parcelsCollection.updateOne(
                    { _id: new ObjectId(paymentInfo.parcelId) },
                    {
                        $set: {
                            paymentStatus: "paid",
                            // status: "Confirmed", // optional, for parcel status
                        },
                    }
                );

                return res.redirect(
                    "http://localhost:5173/dashboard/payment-success"
                );

            }

            else {
                return res.redirect("http://localhost:5173/dashboard/payment-fail");
            }

        });


        app.get("/payment-success", (req, res) => {
            res.redirect("http://localhost:5173/dashboard/payment-success");
        });

        app.post("/payment-cancel", (req, res) => {
            console.log("Payment cancelled");

            return res.redirect(
                "http://localhost:5173/dashboard/payment-cancel"
            );
        });

        app.get("/payment-cancel", (req, res) => {
            res.redirect(
                "http://localhost:5173/dashboard/payment-cancel"
            );
        });

        app.post("/payment-fail", (req, res) => {
            return res.redirect("http://localhost:5173/dashboard/payment-fail");
        });
        app.get("/payment-fail", (req, res) => {
            res.redirect("http://localhost:5173/dashboard/payment-fail");
        });



        app.post("/payment-cancel", (req, res) => {
            console.log("Payment cancelled");

            return res.redirect(
                "http://localhost:5173/dashboard/payment-cancel"
            );
        });

        app.get("/payment-cancel", (req, res) => {
            res.redirect(
                "http://localhost:5173/dashboard/payment-cancel"
            );
        });



        // Get all payments of a user
        app.get("/payments", async (req, res) => {
            const email = req.query.email;

            if (!email) {
                return res.status(400).send({ message: "Email query is required" });
            }

            try {
                const payments = await paymentsCollection
                    .find({ customerEmail: email, status: "success" })
                    .sort({ createdAt: -1 })
                    .toArray();

                res.send(payments);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch payments" });
            }
        });



        // {{{{{{{----------------riders APIs-------------------}}}}}



        app.post("/riders", async (req, res) => {
            try {
                const riderData = req.body;


                if (!riderData.email || !riderData.name) {
                    return res.status(400).send({ message: "Missing required fields" });
                }

                const existing = await ridersCollection.findOne({ email: riderData.email });
                if (existing) {
                    return res
                        .status(409) // Conflict
                        .send({ message: "You have already applied with this email" });
                }

                riderData.status = "pending";
                riderData.createdAt = new Date();

                const result = await ridersCollection.insertOne(riderData);

                res.status(201).send({
                    message: "Rider application submitted successfully",
                    insertedId: result.insertedId,
                });
            } catch (error) {
                res.status(500).send({ message: "Failed to submit rider application" });
            }
        });





        app.get("/riders", async (req, res) => {
            try {
                const { status } = req.query;

                const query = {};
                if (status) {
                    query.status = status;
                }

                const riders = await ridersCollection
                    .find(query)
                    .project({
                        name: 1,
                        email: 1,
                        phone: 1,
                        nid: 1,
                        address: 1,
                        district: 1,
                        serviceCenter: 1,
                        vehicleType: 1,
                        vehicleNumber: 1,
                        registrationNumber: 1,
                        status: 1,
                        createdAt: 1,
                    })

                    .toArray();

                res.send(riders);
            } catch (err) {
                res.status(500).send({ message: "Failed to fetch riders" });
            }
        });


        // app.patch("/riders/:id", async (req, res) => {
        //     try {
        //         const { status } = req.body; // "approved" or "rejected"
        //         const { id } = req.params;

        //         const result = await ridersCollection.updateOne(
        //             { _id: new ObjectId(id) },
        //             { $set: { status } }
        //         );

        //         if (result.modifiedCount === 1) {
        //             return res.send({ message: `Rider ${status} successfully` });
        //         }
        //         res.status(400).send({ message: "Failed to update rider status" });
        //     } catch (err) {
        //         res.status(500).send({ message: "Server error" });
        //     }
        // });

        // GET /riders/check/:email
        app.get("/riders/check/:email", async (req, res) => {
            const { email } = req.params;

            try {
                const rider = await ridersCollection.findOne({ email, status: "approved" });
                res.send({ rider: !!rider }); // true if approved rider exists
            } catch (err) {
                res.status(500).send({ rider: false });
            }
        });

        app.get("/parcels/rider/:email", async (req, res) => {
            const email = req.params.email;

            const parcels = await parcelsCollection.find({
                deliveryStatus: "assigned",
                "assignedRider.email": email,
            }).toArray();

            res.send(parcels);
        });



        app.get("/rider/earnings-summary", async (req, res) => {
            try {
                const { email } = req.query;

                if (!email) {
                    return res.status(400).send({ message: "Email is required" });
                }

                const now = new Date();

                const startOfToday = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate()
                );

                const startOfWeek = new Date(startOfToday);
                startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfYear = new Date(now.getFullYear(), 0, 1);

                const matchQuery = {
                    "assignedRider.email": email,
                    "assignedRider.riderPayment": "cashed out",
                };

                const parcels = await parcelsCollection.find(matchQuery).toArray();

                const sum = (fromDate) =>
                    parcels
                        .filter((p) => new Date(p.deliveredAt) >= fromDate)
                        .reduce((acc, p) => acc + (p.assignedRider.earningAmount || 0), 0);

                res.send({
                    today: sum(startOfToday),
                    week: sum(startOfWeek),
                    month: sum(startOfMonth),
                    year: sum(startOfYear),
                    total: parcels.reduce(
                        (acc, p) => acc + (p.assignedRider.earningAmount || 0),
                        0
                    ),
                });
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "Failed to load earnings summary" });
            }
        });


        app.patch("/parcels/:parcelId/assign-rider", async (req, res) => {
            try {
                const { parcelId } = req.params;
                const { riderId } = req.body;

                if (!ObjectId.isValid(parcelId) || !ObjectId.isValid(riderId)) {
                    return res.status(400).send({ message: "Invalid ID format" });
                }

                // 🔹 Find rider
                const rider = await ridersCollection.findOne({
                    _id: new ObjectId(riderId),
                    status: "approved",
                });

                if (!rider) {
                    return res.status(404).send({ message: "Approved rider not found" });
                }


                const parcel = await parcelsCollection.findOne({ _id: new ObjectId(parcelId) });

                if (!parcel) {
                    return res.status(404).send({ message: "Parcel not found" });
                }

                // Prevent re-assigning parcels that are already assigned or delivered
                if (parcel.assignedRider || parcel.deliveryStatus === "delivered") {
                    return res.status(400).send({
                        message: "Parcel is already assigned or delivered and cannot be reassigned",
                    });
                }


                // 🔹 Update parcel
                const updateResult = await parcelsCollection.updateOne(
                    { _id: new ObjectId(parcelId) },
                    {
                        $set: {
                            assignedRider: {
                                riderId: rider._id,
                                email: rider.email,
                                name: rider.name,
                                nid: rider.nid,
                                phone: rider.phone,
                                vehicleNumber: rider.vehicleNumber,
                                district: rider.district,
                            },
                            deliveryStatus: "assigned",
                            assignedAt: new Date(),
                        },
                    }
                );

                if (updateResult.modifiedCount === 0) {
                    return res.status(400).send({ message: "Parcel not updated" });
                }

                res.send({ message: "Rider assigned successfully" });
            } catch (error) {
                console.error("Assign rider error:", error);
                res.status(500).send({ message: "Failed to assign rider" });
            }
        });


        app.patch("/riders/:id", async (req, res) => {
            const id = req.params.id;
            const { status } = req.body;

            // 1️⃣ Update rider status
            const riderQuery = { _id: new ObjectId(id) };
            const riderUpdate = {
                $set: { status }
            };

            const riderResult = await ridersCollection.updateOne(
                riderQuery,
                riderUpdate
            );

            // 2️⃣ If approved → update user role
            if (status === "approved") {
                const rider = await ridersCollection.findOne(riderQuery);

                if (rider?.email) {
                    await usersCollection.updateOne(
                        { email: rider.email },
                        { $set: { role: "rider" } }
                    );
                }
            }

            res.send({
                success: true,
                message: "Rider approved and user role updated"
            });
        });

        //     try {
        //         const { parcelId } = req.params;
        //         const { riderId } = req.body;

        //         // ✅ validation
        //         if (!ObjectId.isValid(parcelId)) {
        //             return res.status(400).send({ message: "Invalid parcel ID" });
        //         }

        //         if (!ObjectId.isValid(riderId)) {
        //             return res.status(400).send({ message: "Invalid rider ID" });
        //         }

        //         // 🔹 find rider
        //         const rider = await ridersCollection.findOne({
        //             _id: new ObjectId(riderId),
        //             status: "approved",
        //         });

        //         if (!rider) {
        //             return res.status(404).send({ message: "Approved rider not found" });
        //         }

        //         // 🔹 update parcel
        //         const result = await parcelsCollection.updateOne(
        //             { _id: new ObjectId(parcelId) },
        //             {
        //                 $set: {
        //                     assignedRider: {
        //                         riderId: rider._id,
        //                         name: rider.name,
        //                         nid: rider.nid,
        //                         phone: rider.phone,
        //                         vehicleNumber: rider.vehicleNumber,
        //                         district: rider.district,
        //                     },
        //                     deliveryStatus: "assigned",
        //                     assignedAt: new Date(),
        //                 },
        //             }
        //         );

        //         if (result.modifiedCount === 0) {
        //             return res.status(400).send({ message: "Parcel not updated" });
        //         }

        //         res.send({ message: "Rider assigned successfully" });
        //     } catch (error) {
        //         console.error("Assign rider error:", error);
        //         res.status(500).send({ message: "Failed to assign rider" });
        //     }
        // });


        // app.patch("/parcels/assign-rider/:id", async (req, res) => {
        //     const parcelId = req.params.id;
        //     console.log(parcelId)
        //     const { riderId, name, phone } = req.body;


        //     const updateDoc = {
        //         $set: {
        //             deliveryStatus: "assigned",
        //             assignedRider: {
        //                 riderId,
        //                 name,
        //                 phone
        //             }
        //         }
        //     };

        //     const result = await parcelsCollection.updateOne(
        //         { _id: new ObjectId(parcelId) },
        //         updateDoc
        //     );

        //     res.send(result);
        // });


        //   try {
        //     const parcelId = req.params.id;
        //     const { riderId, name, phone } = req.body;

        //     console.log("Parcel ID:", parcelId);
        //     console.log("Body:", req.body);

        //     const result = await parcelsCollection.updateOne(
        //       { _id: new ObjectId(parcelId) },
        //       {
        //         $set: {
        //           deliveryStatus: "assigned",
        //           assignedRider: { riderId, name, phone },
        //         },
        //       }
        //     );

        //     console.log("Update Result:", result);

        //     if (result.matchedCount === 0) {
        //       return res.status(404).send({ success: false, message: "Parcel not found" });
        //     }

        //     res.send({ success: true, message: "Rider assigned", result });
        //   } catch (error) {
        //     console.error("Assign rider error:", error);  // <--- this will show exact problem
        //     res.status(500).send({ success: false, message: "Server error", error: error.message });
        //   }
        // });




        app.get("/riders/approved", async (req, res) => {
            const query = { status: "approved" };
            const result = await ridersCollection.find(query).toArray();
            res.send(result);
        });



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
