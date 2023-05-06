import { Navigate, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import useUser from "../hooks/useUser";
import {SignIn, Decative} from '../pages'

export const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => ({
    user: state.auth.user,
  }));
  if (!user) return <Navigate to="/signin" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

export const ChekerRoute = ({ children }) => {
  const { user } = useSelector((state) => ({
    user: state.auth.user,
  }));
  if (!user) return <Navigate to="/signin" />;
  if (!["admin","checker"].includes(user.role)) return <Navigate to="/" />;
  return children;
};

export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => ({
    user: state.auth.user,
  }));
  if (!user) {
    return <Navigate to="/signin" />;
    // return <SignIn />;
  }
  if(!user.active) return <Decative/>
  return children;
};
