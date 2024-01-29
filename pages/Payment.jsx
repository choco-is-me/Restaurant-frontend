import React, { useState, useEffect } from "react";
import { Container, Button, Typography } from "@mui/material";
import shortUUID from "short-uuid";
import axios from "axios";

const Payment = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [header, setHeader] = useState("Your Bill");

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const orderID = localStorage.getItem("bill"); // Get orderID from local storage
            const response = await axios.post("get_order_details", {
                orderID: orderID,
            });
            setOrderDetails(response.data);
            setTotalAmount(
                response.data.reduce((acc, item) => acc + item.totalamount, 0)
            );
        };

        setInvoiceNumber(shortUUID.generate());
        setCustomerName(localStorage.getItem("selectedGuest"));
        fetchOrderDetails();
    }, []);

    const handlePayment = async () => {
        const orderID = localStorage.getItem("bill"); // Get orderID from local storage
        const response = await axios.post("payment", {
            orderID: orderID,
        });

        if (response.data.status === "success") {
            setHeader("Thank you for being with Brodium");
            localStorage.removeItem("bill"); // Remove "bill" from local storage
        }
    };

    return (
        <Container
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Typography variant="h4">{header}</Typography>
            <Typography variant="h6">{customerName}</Typography>
            <Typography variant="body1">{invoiceNumber}</Typography>
            <Typography variant="body1">
                {new Date().toLocaleString()}
            </Typography>
            {orderDetails.map((item, index) => (
                <div key={index}>
                    <Typography variant="body1">
                        {item.itemName} x {item.quantity}
                    </Typography>
                    <Typography variant="body1">{item.totalamount}</Typography>
                </div>
            ))}
            <Button variant="contained" color="primary" onClick={handlePayment}>
                Everything is correct
            </Button>
            <Typography variant="h6">Total: {totalAmount}</Typography>
        </Container>
    );
};

export default Payment;
