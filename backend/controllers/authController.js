const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler') 
const catchAsyncError = require('../middlewares/catchAsyncError')

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

        res.status(201).json({
            success: true,
            user
            });
})