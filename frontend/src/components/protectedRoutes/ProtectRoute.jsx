import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import './protectRoute.css';
export default function ProtectedRoute({ condition }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="basic"></div>;

    }

    if (!condition(user)) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

