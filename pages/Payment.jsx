import React, { useState, useEffect } from "react";
import shortUUID from "short-uuid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBTypography,
    MDBBtn,
} from "mdb-react-ui-kit";

const Payment = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [header, setHeader] = useState("Your Bill");
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
            setHeader("Thank you for spending time with Brodium");
            localStorage.removeItem("bill");

            // Call set_order_status API to set the order status to 4 (Archived)
            axios
                .post("set_order_status", {
                    orderID: orderID,
                    newStatus: 4,
                })
                .then((response) => {
                    if (response.data.status !== "success") {
                        showToastWithMessage("Failed to set order status");
                    }
                })
                .catch((error) => {
                    showToastWithMessage("There was an error!", error);
                });
        }
    };

    return (
        <MDBContainer
            className="py-5"
            style={{
                marginLeft: "7.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <ToastContainer />
            <MDBCard>
                <MDBCardBody className="mx-4">
                    <MDBContainer>
                        <p
                            className="my-5 text-center"
                            style={{
                                fontSize: "30px",
                                fontFamily: "cursive",
                                fontWeight: "bold",
                            }}
                        >
                            {header}
                        </p>
                        <MDBRow>
                            <MDBTypography listUnStyled>
                                <li
                                    style={{
                                        fontFamily: "cursive",
                                        fontSize: "20px",
                                    }}
                                    className="text-black"
                                >
                                    {customerName}
                                </li>
                                <li
                                    style={{ fontFamily: "cursive" }}
                                    className="text-muted mt-1"
                                >
                                    <span className="text-black">Bill No:</span>{" "}
                                    #{invoiceNumber}
                                </li>
                                <li
                                    style={{ fontFamily: "cursive" }}
                                    className="text-black mt-1"
                                >
                                    {new Date().toLocaleString()}
                                </li>
                            </MDBTypography>
                            <hr />
                            {orderDetails.map((item, index) => (
                                <React.Fragment key={index}>
                                    <MDBCol
                                        style={{ fontFamily: "cursive" }}
                                        xl="10"
                                    >
                                        <p>
                                            {item.itemName} x {item.quantity}
                                        </p>
                                    </MDBCol>
                                    <MDBCol
                                        style={{ fontWeight: "bold" }}
                                        xl="2"
                                    >
                                        <p className="float-end">
                                            {item.totalamount} VND
                                        </p>
                                    </MDBCol>
                                    <hr />
                                </React.Fragment>
                            ))}
                            <MDBRow className="text-black">
                                <MDBCol xl="12">
                                    <p className="float-end fw-bold">
                                        Total: {totalAmount} VND
                                    </p>
                                </MDBCol>
                                <hr
                                    style={{
                                        border: "2px solid black",
                                    }}
                                />
                            </MDBRow>
                            <MDBBtn color="dark" onClick={handlePayment}>
                                Everything is correct
                            </MDBBtn>
                        </MDBRow>
                    </MDBContainer>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

export default Payment;
