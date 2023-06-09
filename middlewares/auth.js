const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticated = catchAsyncError(async(req,res,next)=> {
     const {token} = req.cookies
    if(!token) {
        return next(new ErrorHandler('Pleae login first', 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()
})

exports.authorizedRoles = (...roles) => {
    return(req,res,next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed for this`, 403)
                )
        }
        next()
    }
}