import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import NavbarComponentCook from "../components/NavbarCook";

const CookLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "cook");
    if (role === "cook") {
        return (
            <>
                <NavbarComponentCook />
                <Outlet />
            </>
        );
    } else if (role === "guest") {
        return <Navigate to="/" />;
    }
};

export default CookLayout;
