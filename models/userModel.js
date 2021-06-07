const mongoose = require('mongoose');
const{ isEmail } = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        username : {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
            trimp: true
        },
        email: {
            type: String,
            required: true,
            validate: isEmail,
            lowercase: true,
            trim: true,

        },
        password: {
            type: String, 
            required: true,
            max: 1024,
            minLength: 6,
        },
        rib: {
            type: String,
        },
    }
);

//launch function before save into display: 'block'
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
