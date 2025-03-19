const express = require('express');
const router = express.Router();
const categoryService = require('../controllers/categoryService');

router.get('/categories/:id', categoryService.getCategories);
router.post('/categories' , categoryService.createCategory);
router.put('/categories' , categoryService.updateCategory);
router.delete('/categories' , categoryService.deleteCategory);

module.exports = router;