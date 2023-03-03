var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs")
const User = require("../models/Users")
const {body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()
var validateToken = require("../auth/validateToken")
const { Buffer } = require('buffer')

/* Register */
router.post("/register",
    body("username").isLength({ min: 3 }).trim().escape(),
    body("password").isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Password is not strong enough" })
        }
        try {
            let user = await User.findOne({ username: req.body.username })
            if (user) {
                res.status(403).json({ message: "Username already in use" })
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err
                        try {
                            User.create(
                                {
                                    username: req.body.username,
                                    password: hash
                                })
                            res.status(200)
                            res.json({ success: true })
                        } catch (e) {
                            throw e
                        }
                    })
                })
            }
        } catch (e) {
            throw e
        }
    })

/* Login */
router.post('/login',
    async (req, res, next) => {
        try {
            let user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(403).json({ message: "No user found" })
            } else {
                bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) {
                        const jwtPayload = {
                            id: user._id,
                            username: user.username,
                            createdAt: user.createdAt,
                            bio: user.bio
                        }
                        jwt.sign(
                            jwtPayload,
                            process.env.SECRET,
                            {
                                expiresIn: 3600
                            },
                            (err, token) => {
                                if (err) console.log(err)
                                res.cookie('token', token, { httpOnly: true });
                                res.json({ success: true, token })
                            }
                        )
                    } else {
                        return res.status(403).json({ message: "Invalid credentials" })
                    }
                })
            }
        } catch (e) {
            throw e
        }
    })

/* Log out */
router.post('/logout', function (req, res, next) {
    res.clearCookie('token')
    res.json({message: "Logged out"})
})

/* Check login */
router.post("/check", validateToken, function (req, res, next) {
    let token = req.cookies["token"]
    res.json({ success: true, token })
})

/* Get user info */
router.get('/info/:id', async function (req, res, next) {
    const id = req.params.id
    try {
        let user = await User.findOne({ _id: id })
        res.json(user);
    } catch (e) {
        throw e
    }
});

/* Edit user */
router.post("/edit", validateToken, async function (req, res, next) {
    let token = req.cookies["token"]
    let userID = JSON.parse(Buffer.from(token.split(".")[1], "base64")).id
    let user = await User.findByIdAndUpdate(userID, req.body, {new: true})
    if(user) {
        res.json({ success: true, user })
    } else {
        res.json({success: false})
    }
})

module.exports = router;