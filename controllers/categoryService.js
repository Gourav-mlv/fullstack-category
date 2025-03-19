const Category = require('../model/category');

const getCategories = async (req, res) => {
    const id = req.params.id;
    const categories = await Category.find({id : id});
    res.send(categories);
    return categories;
}


const createCategory = async (req, res) => {
    let  {name , parentId} = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    const categoryWithName = await Category.findOne({name});
    if(categoryWithName) return res.status(400).json({ error: `Category with name ${name} already exists` });
    const newCategory = new Category({ name , parentId });
    try {
        const savedCategory = await newCategory.save();
        console.log("Category Created:", savedCategory);
        res.status(200).json(savedCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  
const updateCategory = async (req, res) => {
    let  {id , name , parentId , children} = req.body;
    const filter = { _id: id };
    const update = {};
    if(name) update.name = name;
    if(parentId) update.parentId = parentId;
    if(children) update.children = children;

    await Category.findOneAndUpdate(filter, update, {new: true})
      .then((updatedCategory) => {
        console.log("Category Updated:", updatedCategory);
        res.status(200).json(updatedCategory);
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  };



const deleteCategory = async (req, res) => {
    const {id} = req.body;
    if (!id) return res.status(400).json({ error: "Category ID is required" });
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    const childrenIds = category.children?.map(child => child._id) || [];
    await Category.updateMany({children : id}, {$pull: {children: id}});
    await Category.deleteMany({ _id: { $in: [id, ...childrenIds] } })
      .then(() => res.send("Category and its children deleted"))
      .catch((error) => {
        console.error("Error deleting category and its children:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
}


module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};