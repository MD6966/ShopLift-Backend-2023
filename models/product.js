const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
        name : {
            type: String,
            required: [true, 'Please Enter the prodcut name'],
            trim: true,
            maxLength:[100, 'Product length must be less than  or equal to 100']
        },
        price : {
            type: Number,
            required: [true, 'Please Enter the prodcut price'],
            maxLength:[5, 'Product length must be less than  or equal to 5 characters'],
            default: 0.00
        },
        description : {
            type: String,
            required: [true, 'Please Enter the prodcut description'],
        },
        ratings : {
            type: Number,
            default: 0,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],

        category: {
            type: String,
            required: [true, 'Please Select Category'],
            enum: {
                values : [
                    'Electronics',
                    'Mobiles',
                    'Cameras',
                    'Food',
                    'Books',
                    'Clocks',
                    'Shoes',
                    'Beauty/Health',
                    'Sports',

                ],
                message:'please Select correct category'
            }
        },
        seller : {
            type:String,
            required: [true, 'Enter Seller of product']
        },
        stock : {
            type: Number,
            required: [true, 'Enter the stock of the product'],
            maxLength: [5,'Must be less than or equal to 5 characters' ],
            default:0
        },
        numOfReviews : {
            type: Number,
            default:0
        },
        reviews: [
            {name:{type:String, required:true}},
            {rating:{type:Number, required:true}},
            {comment:{type:String, required:true}},
           
        ],
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            requried: true,
        },
        createdAt: {
            type:Date,
            default: Date.now
        } 
})

module.exports = mongoose.model('Product', productSchema)