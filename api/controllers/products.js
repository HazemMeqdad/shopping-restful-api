const mongoose = require("mongoose");
const Product = require("../models/product.js");

module.exports.get_all_products = (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

module.exports.post_new_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                    message: "Created product successfully",
                    createdProduct: {
                        name: result.name,
                        price: result.price,
                        _id: result._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + result._id
                        }
                    }
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

module.exports.get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        description: "Get all products ",
                        url: "http://localhost:3000/products/"
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for porvided ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
    ;
}

module.exports.patch_product = (req, res, next) => {
    const id = req.params.productId;
    const upateOps = {};
    for (const ops of req.body){
        upateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, {$set: upateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product upddated",
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/products/' + id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({
                error: err
            })
        })
}

module.exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/products/',
                    body: {
                        name: "String",
                        price: "Number"
                    }
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}
