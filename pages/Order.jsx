import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Dropdown, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const statusMap = {
    1: "Pending",
    2: "Cooking",
    3: "Served",
};

const Order = () => {
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
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchData = () => {
        axios
            .get("display_order_status")
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                showToastWithMessage("There was an error!", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = (orderId, status) => {
        axios
            .post("set_order_status", {
                orderID: orderId,
                newStatus: status,
            })
            .then((response) => {
                if (response.data.status === "success") {
                    fetchData();
                }
            })
            .catch((error) => {
                showToastWithMessage("There was an error!", error);
            });
    };

    const handleRemoveOrder = (orderId) => {
        axios
            .post("remove_order", {
                orderId: orderId,
            })
            .then((response) => {
                if (response.data.status === "success") {
                    fetchData();
                }
            })
            .catch((error) => {
                showToastWithMessage("There was an error!", error);
            });
    };

    return (
        <Container className="table-container">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Order ID</th>
                        <th>Order Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderID}>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() =>
                                        setSelectedOrder(
                                            selectedOrder === order.orderID
                                                ? null
                                                : order.orderID
                                        )
                                    }
                                />
                            </td>
                            <td>{order.orderID}</td>
                            <td>
                                <Dropdown
                                    onSelect={(status) =>
                                        handleStatusChange(
                                            order.orderID,
                                            status
                                        )
                                    }
                                >
                                    <Dropdown.Toggle
                                        variant="success"
                                        id="dropdown-basic"
                                    >
                                        {statusMap[order.orderStatus]}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey="1">
                                            Pending
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="2">
                                            Cooking
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="3">
                                            Served
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                {selectedOrder === order.orderID && (
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleRemoveOrder(order.orderID)
                                        }
                                    >
                                        Remove
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Order;
