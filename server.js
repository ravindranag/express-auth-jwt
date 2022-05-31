// const express = require('express')
// const authRoute = require('./routes/auth')
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'

dotenv.config()

// connect to db
main().catch(err => console.log(err));

async function main() {
    // const un = process.env.MONGODB_USERNAME
    // console.log(un)
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('db connected ✅')
}

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

app.listen(port, () => {
    console.log('listening on port', port)
})