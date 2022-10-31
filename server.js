// const express = require('express')
// const authRoute = require('./routes/auth')
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'

dotenv.config()

const port = 8000

const app = express()

app.use(express.json())

app.get('/', (req, res, next) => {
    res.status(200).json({
        server: 'running'
    })
})

app.use('/auth', authRouter)

// app.use((req, res, err) => {
//     res.json({
//         error: err.message
//     })
// })



async function main() {
	// const un = process.env.MONGODB_USERNAME
	// console.log(un)
	return mongoose.connect(process.env.MONGODB_URI)
		.then(success => {
			app.listen(port, (err) => {
				if(err) {
					console.log({
						error: err
					})
				}
				else{
					console.log('db connected ✅')
					console.log('listening on port', port, '🚀')
				}
			})
		})
}

main().catch(err => console.log(err));
