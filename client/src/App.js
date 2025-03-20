import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CategoryTree from "./components/CategoryTree";

const PrivateRoute = ({ children }) => (localStorage.getItem("token") ? children : <Navigate to="/login" />);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/category" element={<PrivateRoute><CategoryTree /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);

export default App;
