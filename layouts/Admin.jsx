import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import NavbarComponentAdmin from "../components/NavbarAdmin";

const AdminLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "admin");
    if (role === "admin") {
        return (
            <>
                <NavbarComponentAdmin />
                <Outlet />
            </>
        );
    } else if (role === "guest") {
        return <Navigate to="/" />;
    }
};

export default AdminLayout;
