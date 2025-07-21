import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";


export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const hasShownToast = useRef(false);


    useEffect(() => {
        if (!isLoading && !isAuthenticated && !hasShownToast.current) {
            toast.error("Please login to access this feature", {
                toastId: "login-required",
            });
            hasShownToast.current = true;
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}