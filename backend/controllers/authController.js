const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');

exports.registerUser = catchAsyncError( async (req, res, next) => {
    
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id:'avatars/kccvibpsuiusmwfepb3m',
            url:'https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfepb3m.png'
        }
        });

        sendToken(user, 200, res)
})

exports.loginUser = catchAsyncError( async (req , res, next) => {

        const {email, password} = req.body;

        
        if(!email || !password) {
            return next(new ErrorHandler('Please enter a valid email and password', 400))
        }

        const user = await User.findOne({email}).select('+password');


        
        if(!user) {
            return next(new ErrorHandler('Email not valid', 401))
        }

        const isPasswordMatched = await user.comparePassword(password);

        
        
        if(!isPasswordMatched) {
            return next(new ErrorHandler('password not valid', 401))
        }
        
        sendToken(user, 200, res)

})