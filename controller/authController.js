const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
// register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: '1231231',
            url:'122213231231231231',
        }
    })
    sendToken(user, 200, res )
})

// Login user 

exports.loginUser = catchAsyncError(async (req,res,next)=> {
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new ErrorHandler('Please Enter Email & password', 400))
    }
    const user = await User.findOne({email}).select('+password')
    if(!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    const isPassword = await await user.comparePassword(password)
    if(!isPassword) {
        return next(new ErrorHandler('Invalid Email or Password', 401))

    }
    sendToken(user, 200, res )
})

// forgot password 
exports.forgotPassword = catchAsyncError(async(req,res,next)=> {
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return next ( new ErrorHandler('Email Does not exist', 404))
    }

    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave:false})

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Password Reset token is \n\n\n${resetURL}`

    try {
        await sendEmail({
            email: user.email,
            subject:'ShopLift Password Recovery',
            message
        })
        res.status(200).json({
            success: true,
            message:`Email sent to ${user.email}` 
        })

    }
    catch(err) {
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined,
        await User.findOne({email: req.body.email})
        return next ( new ErrorHandler(err.message, 500))

    }
})

// reset password 

exports.resetPassword = catchAsyncError(async(req,res,next)=> {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt : Date.now()}
    })
    if (!user) {
    return next(new ErrorHandler('Password reset token is invalid or expired', 404))
    }
    if(req.body.password != req.body.confirmPassword){
        return next (new ErrorHandler('Password not matched', 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    sendToken(user, 200, res)

})

// getCurrentUserDetails 

exports.getUserProfile = catchAsyncError(async(req,res,next)=> {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

// update or change password 

 exports.updatePassword = catchAsyncError(async(req,res,next)=> {
    const user = await User.findById(req.user.id).select('+password')

    // this will check previous password 

    const isMatched = await user.comparePassword(req.body.oldpassword)
    if(!isMatched) {
        return next(new ErrorHandler('Old Password is incorrect', 400))
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res)

})

//update user profile

exports.updateProfile = catchAsyncError(async (req,res,next)=> {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // update profile picture 

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    })
    res.status(200).json({
        success: true
    }) 
})


// Route for logout user

exports.logout = catchAsyncError(async(req,res,next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out user'
    })
})


// Admin Routes 

// Get all users 

exports.allUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

// Get single user details
exports.getUserDetails = catchAsyncError(async(req,res,next)=> {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not exist with id:${req.params.id}`))

    }

    res.status(200).json({
        success: true,
        user
    })
})

//update user Admin

exports.updateUser = catchAsyncError(async (req,res,next)=> {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }


    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    })
    res.status(200).json({
        success: true
    }) 
})

// Delete User 

exports.deleteUser = catchAsyncError(async(req,res,next)=> {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not exist with id:${req.params.id}`))

    }
    await user.remove()

    res.status(200).json({
        success: true,
    })
})