import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import CreateGoal from "../pages/CreateGoal";
import Dashboard from "../pages/Dashboard";
import Journal from "../pages/Journal";
import SearchResults from "../pages/SearchResults";
import MainLayout from "../layouts/MainLayout";
import Goals from "../pages/Goals";
import Settings from "../pages/Settings";

const RouteSwitch = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public routes without MainLayout */}
      <Route
        path='/'
        element={currentUser ? <Navigate to='/dashboard' replace /> : <Home />}
      />
      <Route
        path='/login'
        element={currentUser ? <Navigate to='/dashboard' replace /> : <Login />}
      />
      <Route
        path='/register'
        element={
          currentUser ? <Navigate to='/dashboard' replace /> : <Register />
        }
      />

      {/* Routes wrapped with MainLayout */}
      <Route element={<MainLayout />}>
        <Route
          path='/dashboard'
          element={
            currentUser ? <Dashboard /> : <Navigate to='/login' replace />
          }
        />
        <Route path='/searchresults' element={<SearchResults />} />

        {/* Protected Routes within MainLayout */}
        <Route
          path='/profile'
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path='/creategoal'
          element={
            <PrivateRoute>
              <CreateGoal />
            </PrivateRoute>
          }
        />
        <Route
          path='/journal'
          element={
            <PrivateRoute>
              <Journal />
            </PrivateRoute>
          }
        />
        <Route
          path='/goals'
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Route>

      {/* 404 - Not Found Route */}
      <Route path='*' element={<h1>404 Not Found!</h1>} />
    </Routes>
  );
};

export default RouteSwitch;
