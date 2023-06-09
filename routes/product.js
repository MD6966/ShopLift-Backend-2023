const express = require('express')
const router = express.Router();

const {newProduct , getProducts, getSingleProduct, updateProduct, 
    deleteProduct, createProductReview, getProductReviews, deleteProductReview} = require('../controller/productController')

const {isAuthenticated, authorizedRoles} = require('../middlewares/auth')

router.route('/products').get(getProducts)
router.route('/admin/product/new').post(isAuthenticated, authorizedRoles('admin'), newProduct)
router.route('/product/:id').get(getSingleProduct)
router.route('/admin/product/:id').put(isAuthenticated,authorizedRoles('admin'),updateProduct)
router.route('/admin/product/:id')
.put(isAuthenticated,authorizedRoles('admin'),updateProduct)
.delete(isAuthenticated,authorizedRoles('admin'),deleteProduct)
// .delete(isAuthenticated, authorizedRoles('admin'), deleteProduct)
router.route('/review').put(isAuthenticated, createProductReview)
router.route('/reviews').get(isAuthenticated, getProductReviews)
router.route('/reviews').delete(isAuthenticated, deleteProductReview)


module.exports = router;