import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const CategoryFilter = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategories(res.data.map((cat) => ({ value: cat._id, label: cat.name })));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  return (
    <div>
      <h3>Filter by Category</h3>
      <Select options={categories} onChange={(e) => onSelect(e.value)} />
    </div>
  );
};

export default CategoryFilter;
