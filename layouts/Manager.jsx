import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavbarComponentManager from "../components/NavbarManager";

const ManagerLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "manager");
    if (role === "manager") {
        return (
            <>
                <Helmet>
                    <title>Manager</title>
                </Helmet>
                <NavbarComponentManager />
                <Outlet />
            </>
        );
    } else if (role === "guest") {
        return <Navigate to="/" />;
    }
};

export default ManagerLayout;
