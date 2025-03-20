import React, { useState, useEffect } from "react";
import useCategories from "../hooks/useCategories";
import { createCategory, updateCategory, deleteCategory, getCategories } from "../api/categoryApi";
import TreeNode from "./TreeNode";

const CategoryTree = () => {
  const { categories, setCategories } = useCategories();
  const [newCategory, setNewCategory] = useState({ name: "", parentId: null });
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editParent, setEditParent] = useState(null);

  const buildCategoryTree = (flatCategories) => {
    if (!flatCategories) return [];

    const categoryMap = {};
    const tree = [];

    flatCategories.forEach((category) => {
      categoryMap[category._id] = { ...category, children: [] };
    });

    flatCategories.forEach((category) => {
      if (category.parentId && categoryMap[category.parentId]) {
        categoryMap[category.parentId].children.push(categoryMap[category._id]);
      } else {
        tree.push(categoryMap[category._id]);
      }
    });

    return tree;
  };

  const flattenCategories = (categoryTree) => {
    if (!categoryTree) return [];

    let result = [];
    const traverse = (nodes) => {
      nodes.forEach((node) => {
        if (!node) return;
        result.push(node);
        if (node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(categoryTree);
    return result;
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(buildCategoryTree(data));
    localStorage.setItem("categories", JSON.stringify(data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newCategory.name.trim()) return;

    const category = await createCategory(newCategory.name, newCategory.parentId);
    if (category) {
      fetchCategories();
      setNewCategory({ name: "", parentId: null });
    }
  };

  const handleUpdate = async (id, newName, parentId) => {
    if (!id || !newName.trim()) return;
  
    await updateCategory(id, newName, parentId);
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === id ? { ...category, name: newName } : category
      )
    );
    await fetchCategories();
  };

  const handleEditClick = (category) => {
    setEditCategory(category);
    setEditName(category.name);
    setEditParent(category.parentId || null);
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const deleteRecursively = (categoryId, categories) =>
      categories.filter((category) => {
        if (category._id === categoryId) return false;
        category.children = deleteRecursively(categoryId, category.children);
        return true;
      });

    await deleteCategory(id);
    setCategories((prevCategories) => deleteRecursively(id, prevCategories));
    localStorage.setItem("categories", JSON.stringify(flattenCategories(categories)));
  };

  return (
    <div className="category-tree-container">
      <h2>Category Tree</h2>

      {/* Add Category Section */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Category Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <select
          value={newCategory.parentId}
          onChange={(e) =>
            setNewCategory({
              ...newCategory,
              parentId: e.target.value === "" ? null : e.target.value,
            })
          }
        >
          <option value="">Root</option>
          {flattenCategories(categories).map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreate}>Add Category</button>
      </div>

      {/* Edit Category Section */}
      {editCategory && (
        <div className="edit-container">
          <h3>Edit Category</h3>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <select
            value={editParent}
            onChange={(e) =>
              setEditParent(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">Root</option>
            {flattenCategories(categories).map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditCategory(null)}>Cancel</button>
        </div>
      )}

      {/* Render Category Tree */}
      <ul className="category-list">
        {categories.map((category) => (
          <TreeNode
            key={category._id}
            node={category}
            handleUpdate={handleUpdate}  // Pass down handleUpdate
            handleDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default CategoryTree;
