const express = require("express");
const categoryService = require("../controllers/categoryService");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/categories/:id', authenticate, categoryService.getCategories);
router.get('/categories/', authenticate, categoryService.getCategories);
router.post('/categories' , authenticate,  categoryService.createCategory);
router.put('/categories' ,  authenticate, categoryService.updateCategory);
router.delete('/categories' ,  authenticate, categoryService.deleteCategory);
router.get('/map/categories' ,  authenticate, categoryService.getMappings);


module.exports = router;