import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6900";
const getToken = () => localStorage.getItem("token");

export const getCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const categories =  res.data;
    const fetchChildren = async (category) => {
      if (category.children) {
        const children = await Promise.all(category.children.map((childId) => axios.get(`${API_BASE_URL}/categories/${childId}`)));
        category.children = children.map((child) => child.data);
        category.children.forEach(fetchChildren);
      }
    };
    categories.forEach(fetchChildren);
    console.log(categories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const createCategory = async (name, parentId) => {
    if(parentId === "") parentId = null;
  try {
    const res = await axios.post(
      `${API_BASE_URL}/categories`,
      { name, parentId },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating category:", error);
  }
};

export const updateCategory = async (id, name) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/categories`,
      { id, name },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      data: { id },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};
