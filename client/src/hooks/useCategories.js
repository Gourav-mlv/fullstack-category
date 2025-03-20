// useCategories.js
import { useState, useEffect } from "react";
import { getCategories } from "../api/categoryApi";

const buildCategoryTree = (flatCategories) => {
  const categoryMap = {};
  const tree = [];

  // Initialize categories in a map
  flatCategories.forEach(category => {
    categoryMap[category._id] = { ...category, children: [] };
  });

  // Build the tree structure
  flatCategories.forEach(category => {
    if (category.parentId && categoryMap[category.parentId]) {
      categoryMap[category.parentId].children.push(categoryMap[category._id]);
    } else {
      tree.push(categoryMap[category._id]); // Root categories
    }
  });

  return tree;
};


const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      const treeData = buildCategoryTree(data);
      setCategories(treeData);
      localStorage.setItem("categories", JSON.stringify(treeData));
    };
    loadCategories();
  }, []);

  return { categories, setCategories };
};

export default useCategories;