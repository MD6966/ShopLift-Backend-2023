const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')
const catchAsynErrors = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')
/// Create New Product 

exports.newProduct = catchAsynErrors ( async (req, res, next) => {
    const product = await Product.create(req.body)
    req.body.user = req.user.id,
    res.status(201).json({
        success: true,
        product
    })
})

exports.getProducts = catchAsynErrors (async (req, res, next) => {
    const resPerPage = 4;
    const productCount = await Product.countDocuments();
    const apiFeautures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage)
    const products = await apiFeautures.query
    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
})

exports.getSingleProduct = catchAsynErrors (async(req, res, next)=> {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next ( new ErrorHandler('Product Not Found', 404))
    }
    res.status(200).json({
        success: true,
        product 
    })

})

exports.updateProduct = catchAsynErrors (async (req, res, next)=> {
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success: false,
            message:'Product Not Found'

        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })

})

exports.deleteProduct = catchAsynErrors (async (req, res, next) => {
    const product = await Product .findById(req.params.id)
    if(!product){
        return next ( new ErrorHandler('Product Not Found', 404))
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message:'Deleted Successfully'
    })


} )