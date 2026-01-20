import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const ProtectedRoute = ({ children }) => {
  const { data } = useUserContext();

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
