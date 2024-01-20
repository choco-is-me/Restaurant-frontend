import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Login = () => {
    const [staffID, setstaffID] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [isTimeout, setIsTimeout] = useState(false);
    const navigate = useNavigate();

    const showToastWithMessage = (message) => {
        toast(message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-message",
            progressClassName: "toast-progress-bar",
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Check if staffID is empty
        if (staffID === "") {
            setAttempt(attempt + 1);
            if (attempt === 0) {
                showToastWithMessage("Please enter you staff ID again");
            } else if (attempt === 1) {
                showToastWithMessage("Please enter you staff ID again");
            } else if (attempt >= 2) {
                setIsTimeout(true);
                showToastWithMessage("Too many attempts, please try again later");
                setTimeout(() => {
                    setIsTimeout(false);
                    setAttempt(0); // Reset the attempt count after the timeout
                }, 10000);
            }
            return;
        }

        // Send POST request to backend with staffID to get the role
        try {
            const response = await axios.post("login", { staffID });
        
            const data = response.data;
        
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
                    showToastWithMessage("Please enter you staff ID again");
                } else if (attempt === 1) {
                    showToastWithMessage("Please enter you staff ID again");
                } else if (attempt >= 2) {
                    setIsTimeout(true);
                    showToastWithMessage("Too many attempts, please try again later");
                    setTimeout(() => {
                        setIsTimeout(false);
                        setAttempt(0); // Reset the attempt count after the timeout
                    }, 10000);
                }
            }
        } catch (err) {
            console.error(err);
            showToastWithMessage("Error logging in");
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
            <ToastContainer />
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
                    <Button
                        variant="dark"
                        className="w-100 mt-3"
                        type="submit"
                        disabled={isTimeout}
                    >
                        Login
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Login;
