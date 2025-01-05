import { Route, Routes } from "react-router-dom";
import Login from "../AuthPages/Login";
import Register from "../AuthPages/Register";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AuthRoutes;