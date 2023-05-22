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

// create new review 

exports.createProductReview = catchAsynErrors(async(req,res,next)=> {
    const {rating, comment, productId} = req.body
    const review = {
        name: req.user.name,
        user: req.user._id,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )
    if (isReviewed) {
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment
                review.rating = rating
            } 
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    product.rating = product.reviews.reduce((acc, item)=>item.rating + acc, 0)/ product.reviews.length
    await product.save({validateBeforeSave: false})
    res.status(200).json({
        success: true
    })

})

// Get product Reviews

exports.getProductReviews = catchAsynErrors( async (req,res,next)=> {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//Delete Review of the product 

exports.deleteProductReview = catchAsynErrors( async (req,res,next)=> {
    const product = await Product.findById(req.query.productId)
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
    const numOfReviews = reviews.length
    const ratings = product.rating = product.reviews.reduce((acc, item)=>item.rating + acc, 0)/ reviews.length
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindModify : false
    })
    res.status(200).json({
        success: true,
    })
})