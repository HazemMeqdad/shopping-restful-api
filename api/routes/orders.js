const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order.js")
const Product = require("../models/product.js")

const router = express.Router();

router.get("/", (req, res, next) => {
    Order.find()
        .select("product quentity _id")
        .populate('product', "name")  // To fetch doc by reference 
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quentity: order.quentity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + order._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quentity: req.body.quentity
            })
            order
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Order stored",
                        createdOrder: {
                            _id: result._id,
                            product: result.product,
                            quentity: result.quentity
                        },
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + result._id
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        })
        .catch(err => {
            res.status(500).json({
                message: "Product not found",
                error: err
            })
            return;
        })
})

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
        .select("product quentity _id")
        .populate('product', "name price _id")  // To fetch doc by reference 
        .exec()
        .then(result => {
            if (!result){
                return res.status(404).json({
                    message: "Order not found"
                })
            }
            res.status(200).json({
                order: result,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

router.delete("/:orderId", (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "order Deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: {
                        productId: "ID",
                        quantity: "Number"
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

module.exports = router;
