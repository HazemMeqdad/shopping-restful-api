const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const productRouter = require("./api/routes/products.js");
const ordersRouter = require("./api/routes/orders.js");
const userRouter = require("./api/routes/user.js");

mongoose.connect("mongodb://localhost:27017")

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-All-Origin", "*");
    res.header("Access-Control-All-Headers", "*"); // Origin, X-Requested-With, Content-Type, Authorization
    
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({})
    }
    next();
});

app.use("/products", productRouter);
app.use("/orders", ordersRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;