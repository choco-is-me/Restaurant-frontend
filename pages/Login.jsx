import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

const Login = () => {
    const [staffID, setstaffID] = useState("");
    const [attempt, setAttempt] = useState(0);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Check if staffID is empty
        if (staffID === "") {
            alert("TYPE SOMETHING NIGGA");
            return;
        }

        // Send POST request to backend with staffID to get the role
        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ staffID }),
            });

            const data = await response.json();

            if (data.status === "success") {
                localStorage.setItem("role", data.role);
                localStorage.setItem("staffID", staffID);
                if (data.role === "admin") {
                    navigate("/admin");
                } else if (data.role === "manager") {
                    navigate("/manager");
                } else if (data.role === "cook") {
                    navigate("/cook");
                } else if (data.role === "waiter") {
                    navigate("/waiter");
                }
            } else {
                setAttempt(attempt + 1);
                if (attempt === 0) {
                    alert("Really");
                } else if (attempt === 1) {
                    alert("Can't even remember your id? WOAH!");
                } else if (attempt >= 2) {
                    alert("GYAT OUT NIGGA");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Error logging in");
        }
    };

    const handleInputChange = (e) => {
        const re = /^[0-9\b]+$/; // rules: only numbers and backspace allowed

        // if value is not blank, then test the regex
        if (e.target.value === "" || re.test(e.target.value)) {
            setstaffID(e.target.value);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <h1 className="text-center mb-4">Brodium Restaurant</h1>
                <Form onSubmit={handleLogin}>
                    <Form.Group id="staffID">
                        <Form.Control
                            type="text"
                            placeholder="Staff ID"
                            value={staffID}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button className="w-100 mt-3" type="submit">
                        Login
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Login;
