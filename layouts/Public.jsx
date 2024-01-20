import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const PublicLayout = () => {
    const [role] = useState(localStorage.getItem("role") || "guest");
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== "guest") {
            navigate(`/${role}`);
        }
    }, [role, navigate]);

    if (role) {
        return (
            <>
                <Helmet>
                    <title>Welcome to Brodium</title>
                </Helmet>
                <Outlet />
            </>
        );
    }
};

export default PublicLayout;
