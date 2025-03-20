const Category = require('../model/category');

const getCategories = async (req, res) => {
    const id = req.params.id;
    try {
      let categories;
      if(!id) categories = await Category.find({});
      else categories = await Category.find({_id : id});
      res.send(categories);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}


const getMappings = async (req, res) => {
  let categories = {};
  try{
    const allCategories = await Category.find({} , "_id name");
    console.log("got details of categories");
    allCategories.forEach(category => {
      categories[category.name] = category._id;
    });
  }catch(error){
    console.log(error);
  }
  res.send(categories);
  return categories;
}


const createCategory = async (req, res) => {
    let  {name , parentId} = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });
    const newCategory = new Category({ name , parentId });
    try {
        const savedCategory = await newCategory.save();
        console.log("Category Created:", savedCategory);
        if (parentId) {
          await Category.findByIdAndUpdate(
              parentId,
              { $push: { children: savedCategory._id } },  // Add new category ID to parent's children array
              { new: true }
          );
          console.log(`✅ Added ${savedCategory._id} to parent ${parentId}`);
      }
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
    if (!category) return res.status(404).json({ error: "Category not found" , message : "Category not found" });
    const childrenIds = category.children?.map(child => child._id) || [];
    await Category.updateMany({children : id}, {$pull: {children: id}});
    await Category.deleteMany({ _id: { $in: [id, ...childrenIds] } })
      .then(() => res.send({message :"Category and its children deleted"}))
      .catch((error) => {
        console.error("Error deleting category and its children:", error);
        res.status(404).json({ error: "Internal Server Error"  });
      });
}


module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getMappings
};