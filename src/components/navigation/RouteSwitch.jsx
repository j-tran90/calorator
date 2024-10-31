// src/components/navigation/RouteSwitch.js
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home"; // You can keep Home for other purposes later
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import CreateGoal from "../pages/CreateGoal";
import Dashboard from "../pages/Dashboard";
import Journal from "../pages/Journal";
import SearchResults from "../pages/SearchResults";
import MainLayout from "../layout/MainLayout"; // Import the MainLayout

const RouteSwitch = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path='/searchresults' element={<SearchResults />} />

      {/* Root path for Login and Register */}
      {!currentUser ? (
        <Route
          path='/'
          element={
            <>
              <Login />
              <Register />
            </>
          }
        />
      ) : (
        <Route path='/' element={<Dashboard />} />
      )}

      {/* Protected Routes with NavBar */}
      <Route element={<MainLayout />}>
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
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>

      {/* 404 Not Found */}
      <Route path='*' element={<h1>404 Not Found!</h1>} />
    </Routes>
  );
};

export default RouteSwitch;
