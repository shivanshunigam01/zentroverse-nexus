import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {

   const app = useSelector((state) => state.app);
  if (!app.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
