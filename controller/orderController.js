const Order = require('../models/order')
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')

// Create New Order here

exports.newOrder = catchAsyncError(async(req,res,next)=> {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    }= req.body;
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,

    })
    res.status(200).json({
        success: true,
        order
    })
})


// Get single Order 

exports.getSingleOrder = catchAsyncError(async(req,res,next)=> {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('No Order Found with this id ', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})

// get logged in user order
exports.myOrders = catchAsyncError(async(req,res,next)=> {
    const order = await Order.find({user: req.user.id})

    res.status(200).json({
        success: true,
        order
    })
})


// get All orders

exports.allOrders = catchAsyncError(async(req,res,next)=> {
    const order = await Order.find()

    let totalAmount = 0;
    order.forEach(order=> {
        totalAmount +=order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        order
    })
})

// Update Or Process Order only for admin

exports.updateOrder = catchAsyncError(async(req,res,next)=> {
    const order = await Order.findById(req.params.id)
    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Ordered Delieverd', 400))
    }
    order.orderItems.forEach(async item => {
         await updateStock(item.product, item.quantity)
    })
    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()
    await order.save({validateBeforeSave: false})

    res.status(200).json({
        success: true,
        totalAmount,
        order
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity
}

// delete order 

exports.deleteOrder = catchAsyncError(async(req,res,next)=> {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('No Order Found with this id ', 404))
    }

    await order.remove()
    res.status(200).json({
        success: true,
        order
    })
})