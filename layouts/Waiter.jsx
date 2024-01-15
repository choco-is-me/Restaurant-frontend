import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import NavbarComponentWaiter from "../components/NavbarWaiter";

const WaiterLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "waiter");
    if (role === "waiter") {
        return (
            <>
                <NavbarComponentWaiter />
                <Outlet />
            </>
        );
    } else if (role === "guest") {
        return <Navigate to="/" />;
    }
};

export default WaiterLayout;
