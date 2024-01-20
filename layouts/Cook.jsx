import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavbarComponentCook from "../components/NavbarCook";

const CookLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "cook");
    if (role === "cook") {
        return (
            <>
                <Helmet>
                    <title>Cook</title>
                </Helmet>
                <NavbarComponentCook />
                <Outlet />
            </>
        );
    } else if (role === "guest") {
        return <Navigate to="/" />;
    }
};

export default CookLayout;
