import React, { useState, useEffect } from "react";
import shortUUID from "short-uuid";
import axios from "axios";
import { toast } from "react-toastify";
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
    const [servedOrders, setServedOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [refresh, setRefresh] = useState(false);

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
            if (!selectedOrder) return;
            const response = await axios.post("get_order_details", {
                orderID: selectedOrder,
            });
            setOrderDetails(response.data);
            setTotalAmount(
                response.data.reduce((acc, item) => acc + item.totalamount, 0)
            );
        };

        const fetchServedOrders = async () => {
            const response = await axios.get("display_order_status");
            const servedOrders = response.data.filter(
                (order) => order.orderStatus === 3
            );
            setServedOrders(servedOrders);
        };

        setInvoiceNumber(shortUUID.generate());
        setCustomerName(localStorage.getItem("selectedGuest"));
        fetchServedOrders();
        fetchOrderDetails();
        setRefresh(false);
    }, [selectedOrder, refresh]);

    const handlePayment = async () => {
        if (!selectedOrder) return;
        const response = await axios.post("payment", {
            orderID: selectedOrder,
        });

        if (response.data.status === "success") {
            setSelectedOrder(null);

            // Call set_order_status API to set the order status to 4 (Archived)
            axios
                .post("set_order_status", {
                    orderID: selectedOrder,
                    newStatus: 4,
                })
                .then((response) => {
                    if (response.data.status !== "success") {
                        showToastWithMessage("Failed to archive the order!");
                    } else {
                        setRefresh(true);
                        showToastWithMessage(
                            "Thank you for spending time with Brodium"
                        );
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
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <div className="button-group">
                {servedOrders.map((order) => (
                    <MDBBtn
                        color="dark"
                        onClick={() => setSelectedOrder(order.orderID)}
                    >
                        Order {order.orderID}
                    </MDBBtn>
                ))}
            </div>
            <MDBCard style={{ marginTop: "20px" }}>
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
                            Your Bill
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
