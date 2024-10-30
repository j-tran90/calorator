import { Routes, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Home from "../views/Home";
import Register from "../views/Register";
import Login from "../views/Login";
import Profile from "../views/Profile";
import CreateGoal from "../views/CreateGoal";
import Dashboard from "../views/Dashboard";
import Journal from "../views/Journal";
import SearchResults from "../views/SearchResults";

const RouteSwitch = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        <Route path='/searchresults' element={<SearchResults />} />
        {!currentUser ? (
          <Route path='/login' element={<Login />} />
        ) : (
          <Route path='/login' element={<Dashboard />} />
        )}

        {!currentUser ? (
          <Route path='/register' element={<Register />} />
        ) : (
          <Route path='/register' element={<Dashboard />} />
        )}

        {!currentUser ? (
          <Route path='/dashboard' element={<Home />} />
        ) : (
          <Route path='/dashboard' element={<Dashboard />} />
        )}

        {!currentUser ? (
          <Route path='/' element={<Home />} />
        ) : (
          <Route path='/' element={<Dashboard />} />
        )}

        {!currentUser ? (
          <Route path='/home' element={<Home />} />
        ) : (
          <Route path='/home' element={<Dashboard />} />
        )}

        {/* Protected Routes */}
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
        {/* End of Protected Routes */}
        <Route path='*' element={<h1>404 Not Found!</h1>} />
      </Routes>
    </>
  );
};

export default RouteSwitch;
