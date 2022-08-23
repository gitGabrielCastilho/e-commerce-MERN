const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name'],
        maxLenght: [30, 'please enter less than 30 characters']
    },

    email: {
        type: String,
        required: [true, 'please enter a valid email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlenght: [6, 'please enter at least 6 characters'],
        select: false
    },
    avatar: {
        public_id:{
        type: String,
        required: true},
        
        url: {
            type: String,
            required: true}
        },
    
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)

})

module.exports =  mongoose.model('User', userSchema);