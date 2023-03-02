import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "../Page/Register/Register";
import LandingPage from "../Page/LandingPage/LandingPage";
import Login from "../Page/Login/Login";
import Dashborad from "../Page/Dashboard/Dashboard";
import Edit from "../Page/Edit/Edit";
import Create from "../Page/Create/Create";
import UnAuthorizedUser from "../Providers/Authentication/UnAuthorizedUser";
import UnAuthorizedUserPage from "../Page/UnAuthorizedUserPage/UnAuthorizedUserPage";

const RenderRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<UnAuthorizedUser />}>
        <Route path="" element={<Dashborad />} />
        <Route path=":id" element={<Edit />} />
        <Route path="create" element={<Create />} />
      </Route>
      <Route path="/unauthorized" element={<UnAuthorizedUserPage />} />
    </Routes>
  );
};

export default RenderRoutes;
