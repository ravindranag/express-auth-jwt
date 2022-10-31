// const jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import 'dotenv/config'

const secret = process.env.JWT_SECRET

const generateToken = (email) => {
    const token = jwt.sign({
        email: email
    }, secret, {
        expiresIn: '1d'
    })
    return token
}

const getCurrentUser = (req, res, next) => {
    const token = req.headers.authorization
        // console.log(token)
    jwt.verify(token, secret, async(err, result) => {
        if (err) {
            res.json({ error: err })
        } else {
            console.log(result)
            const user = await User.findOne({ email: result.email }).select('email about')
            console.log(user)
            req.user = user
            next()
        }
    })
}

// module.exports = {
//     generateToken,
//     getCurrentUser
// }
export {
    generateToken,
    getCurrentUser
}