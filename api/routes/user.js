const express = require("express");
const mongoose = require("mongoose");
const md5 = require("md5");
const jwt = require("jsonwebtoken")

const router = express.Router();

const User = require("../models/user.js");

router.post("/signup", (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(result => {
            if (result.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: md5(req.body.password)
                })
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "user created"
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email, password: md5(req.body.password) })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            } else {
                // Token can decode by this website https://jwt.io
                const token = jwt.sign(
                    {
                        email: req.body.email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    },
                    
                )
                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.delete("/:userId", (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "user deleted"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

module.exports = router;
