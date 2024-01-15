import { Outlet } from "react-router-dom";
import { useState } from "react";

const PublicLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "guest");

    if (role === "guest") {
        return <Outlet />;
    }
};

export default PublicLayout;
