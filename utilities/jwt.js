// const jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const secret = 'huehue'

const generateToken = (name) => {
    const token = jwt.sign({
        name: name
    }, secret, {
        expiresIn: 60 * 60
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
            const user = await User.findOne({ name: result.name }).select('name about')
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