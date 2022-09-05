const crypto = require('crypto')
const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
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

exports.forgotPassword = catchAsyncError(async(req, res, next) => {

    const user = await User.findOne({email: req.body.email})

    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\n If you have requested this email, then ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})



exports.logout = catchAsyncError( async(req, res, next) =>{

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

exports.resetPassword = catchAsyncError(async(req, res, next) => {
  
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: {$gt: Date.now()}
    })

    if(!user) {
        return next(new ErrorHandler('Password reset token invalid or has expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    user.password = req.body.password;
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    sendToken(user, 200, res)

})