const express = require('express');
const productsController = require('../controllers/products.controller');
const router = express.Router();
const auth=require('../middlewares/auth');
const autorizate =require('../middlewares/authorize');

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProduct);
router.post('/',
    auth,
    autorizate('admin'),
     productsController.createProduct);
router.put('/:id',
    auth,
    autorizate('admin'),
    productsController.updateProduct);
router.delete('/:id', 
    auth,
    autorizate('admin'),
    productsController.deleteProduct);
module.exports = router;
