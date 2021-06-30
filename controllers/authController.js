const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { signUpErrors, signInErrors } = require('../utils/errors.utils')
const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
}

module.exports.signUp = async (req, res) => {
    console.log(req.body)
    const {username, email, password} = req.body

    try{
        const user = await userModel.create({username, email, password})
        res.status(201).json({ user: user.username});
    }
    catch(err){
        const errors = signUpErrors(err)
        res.status(400).send({ errors })
        console.log(err)
        
    }
}

module.exports.signIn = async (req, res) => {
    const {email, password} = req.body
    try{
        const user = await userModel.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt',token, {httpOnly: true, maxAge})
        res.status(200).json({user: user.username})
    }catch(err){
        const errors = signInErrors(err)
        res.status(400).send({ errors })
        console.log(err)
    }
}

module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    console.log("logged out")
    res.redirect('/')
}