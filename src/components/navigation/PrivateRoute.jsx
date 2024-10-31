import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Redirect to login if not authenticated
  return currentUser ? children : <Navigate to='/login' replace />;
};

export default PrivateRoute;
