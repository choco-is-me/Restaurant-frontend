import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PublicLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "guest");
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== "guest") {
            navigate(`/${role}`);
        }
    }, [role, navigate]);

    if (role) {
        return <Outlet />;
    }
};

export default PublicLayout;
