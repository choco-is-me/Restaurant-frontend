import React, { useState, useEffect } from "react";
import shortUUID from "short-uuid";
import axios from "axios";
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

        console.log(response);

        if (response.data.status === "success") {
            setHeader("Gay Nigga");
            localStorage.removeItem("bill"); // Remove "bill" from local storage
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
            <MDBCard>
                <MDBCardBody className="mx-4">
                    <MDBContainer>
                        <p
                            className="my-5 text-center"
                            style={{ fontSize: "30px" }}
                        >
                            {header}
                        </p>
                        <MDBRow>
                            <MDBTypography listUnStyled>
                                <li className="text-black">{customerName}</li>
                                <li className="text-muted mt-1">
                                    <span className="text-black">Invoice</span>{" "}
                                    #{invoiceNumber}
                                </li>
                                <li className="text-black mt-1">
                                    {new Date().toLocaleString()}
                                </li>
                            </MDBTypography>
                            <hr />
                            {orderDetails.map((item, index) => (
                                <React.Fragment key={index}>
                                    <MDBCol xl="10">
                                        <p>
                                            {item.itemName} x {item.quantity}
                                        </p>
                                    </MDBCol>
                                    <MDBCol xl="2">
                                        <p className="float-end">
                                            {item.totalamount}
                                        </p>
                                    </MDBCol>
                                    <hr />
                                </React.Fragment>
                            ))}
                            <MDBRow className="text-black">
                                <MDBCol xl="12">
                                    <p className="float-end fw-bold">
                                        Total: {totalAmount}
                                    </p>
                                </MDBCol>
                                <hr style={{ border: "2px solid black" }} />
                            </MDBRow>
                            <MDBBtn color="primary" onClick={handlePayment}>
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
