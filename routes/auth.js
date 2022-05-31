// const express = require('express')
// const { generateToken, getCurrentUser } = require('../utilities/jwt')
import express from 'express'
import User from '../models/user.js'
import { generateToken, getCurrentUser } from '../utilities/jwt.js'
import bcrypt from 'bcrypt'


const authRouter = express.Router()



authRouter.post('/login', async(req, res, next) => {
    const { name, password } = req.body
    User.findOne({ name: name })
        .then(user => {
            return bcrypt.compare(password, user.password)
        })
        .then(isCorrectPassword => {
            if (isCorrectPassword) {
                const token = generateToken(name)
                res.json({
                    message: 'Login successful',
                    token: token
                })
            } else {
                res.json({
                    message: 'Invalid credentials'
                })
            }
        })
        .catch(err => {
            res.json({
                error: err.message
            })
        })
})

authRouter.post('/signup', (req, res, next) => {
    const newUser = new User(req.body)
    console.log(newUser)
    newUser.save()
        .then(doc => {
            res.json({
                message: 'new user created',
                user: doc
            })
        })
        .catch(err => {
            res.json({
                error: err.message
            })
        })

})

authRouter.get('/info', getCurrentUser, (req, res, next) => {
    console.log(req.user)
    if (req.user) {
        res.json({
            user: req.user
        })
    }
})

// module.exports = authRouter
export default authRouter