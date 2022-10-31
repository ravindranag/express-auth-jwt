// const express = require('express')
// const { generateToken, getCurrentUser } = require('../utilities/jwt')
import express from 'express'
import User from '../models/user.js'
import { generateToken, getCurrentUser } from '../utilities/jwt.js'
import bcrypt from 'bcrypt'


const authRouter = express.Router()

const checkDuplicate = async (req, res, next) => {
	const { email } = req.body
	try {
		const user = await User.exists({
			email
		})
		if(user) {
			res.status(400).json({
				error: 'Cannot create user',
				message: 'User already exists'
			})
		} else next()
	}
	catch(err) {
		console.log('error', err)
	}
}


authRouter.post('/login', async(req, res, next) => {
    const { email, password } = req.body
    User.findOne({ email: email })
        .then(user => {
						if(user)
            return bcrypt.compare(password, user.password)
						else throw new Error('User does not exist')
        })
        .then(isCorrectPassword => {
            if (isCorrectPassword) {
                const token = generateToken(email)
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

authRouter.post('/signup', checkDuplicate, (req, res, next) => {
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
                error: 'Failed to create new user',
								message: err.message
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

authRouter.get('/users', async (req, res, next) => {
	try {
		const allUsers = await User.find().select('email about')
		res.json({
			count: allUsers.length,
			users: allUsers
		})
	}
	catch(err) {
		console.log(err)
		res.status(400).json({
			error: err.message,
			message: 'Cannot get all users'
		})
	}
})

// module.exports = authRouter
export default authRouter