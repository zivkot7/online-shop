import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "../Components/Register/Register";
import LandingPage from "../Page/LandingPage/LandingPage";
import Login from "../Components/Login/Login";
import Dashboard from "../Page/Admin/Dashboard/Dashboard";
import Edit from "../Page/Admin/Edit/Edit";
import UnAuthorizedUser from "../Providers/Authentication/UnAuthorizedUser";
import UnAuthorizedUserPage from "../Page/UnAuthorizedUserPage/UnAuthorizedUserPage";
import Create from "../Page/Admin/Create/Create";
import Products from "../Page/Admin/Dashboard/Products/Products";
import Categories from "../Page/Admin/Dashboard/Categories/Categories";
import Orders from "../Page/Admin/Dashboard/Orders/Orders";

const RenderRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<UnAuthorizedUser />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route
          path="/admin/dashboard/products"
          element={
            <Dashboard>
              <Products />
            </Dashboard>
          }
        />
        <Route
          path="/admin/dashboard/categories"
          element={
            <Dashboard>
              <Categories />
            </Dashboard>
          }
        />
        <Route
          path="/admin/dashboard/orders"
          element={
            <Dashboard>
              <Orders />
            </Dashboard>
          }
        />
        <Route path="/admin/dashboard/:id" element={<Edit />} />
        <Route path="/admin/dashboard/create" element={<Create />} />
      </Route>
      <Route path="/unauthorized" element={<UnAuthorizedUserPage />} />
    </Routes>
  );
};

export default RenderRoutes;
