import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet";
import NavbarComponentWaiter from "../components/NavbarWaiter";

const WaiterLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "waiter");

    if (role === "waiter") {
        return (
            <>
                <Helmet>
                    <title>Waiter</title>
                </Helmet>
                <NavbarComponentWaiter />
                <Outlet />
            </>
        );
    } else if (role === "guest") {
        return <Navigate to="/" />;
    }
};

export default WaiterLayout;
