const Product = require('../models/product')
const dotenv = require('dotenv')
const connectDB = require('../config/database')

const products = require('../data/product.json')

dotenv.config({path:'config/config.env'})
connectDB();

const seedProducts = async ()=> {
    try {
        await Product.deleteMany();
        console.log("Products Deleted")

        await Product.insertMany(products);
        console.log('Products added')

        process.exit()
    }
    catch(error){
        console.log(error);
        process.exit()
    }
}

seedProducts()