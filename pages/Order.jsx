import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Dropdown, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const statusMap = {
    1: "Pending",
    2: "Cooking",
    3: "Served",
    4: "Archived",
};

const statusVariantMap = {
    1: "warning",
    2: "info",
    3: "success",
    4: "secondary",
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
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    const [archivedOrders, setArchivedOrders] = useState([]);
    const [isTableVisible, setTableVisible] = useState(false);

    const fetchData = () => {
        axios
            .get("display_order_status")
            .then((response) => {
                const activeOrders = response.data
                    .filter((order) => order.orderStatus !== 4)
                    .sort((a, b) => b.orderID - a.orderID);
                const archivedOrders = response.data
                    .filter((order) => order.orderStatus === 4)
                    .sort((a, b) => b.orderID - a.orderID);
                setActiveOrders(activeOrders);
                setArchivedOrders(archivedOrders);
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
            <ToastContainer />
            <h2 style={{ fontWeight: "bold" }}>Active Orders</h2>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Order ID</th>
                        <th>Order Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {activeOrders.map((order) => (
                        <tr key={order.orderID}>
                            <td>
                                <Form.Check
                                    type="radio"
                                    checked={selectedOrder === order.orderID}
                                    onClick={() =>
                                        setSelectedOrder(
                                            selectedOrder === order.orderID
                                                ? null
                                                : order.orderID
                                        )
                                    }
                                    onChange={() => {}}
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
                                        variant={
                                            statusVariantMap[order.orderStatus]
                                        }
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
                                        <Dropdown.Item eventKey="4">
                                            Archived
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
                                        disabled={order.orderStatus === 3} // Disable if order status is 'Served'
                                    >
                                        Remove
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h2>
                <span
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => setTableVisible(!isTableVisible)}
                >
                    Archived Orders
                </span>
            </h2>
            {isTableVisible && (
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Order ID</th>
                            <th>Order Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {archivedOrders.map((order) => (
                            <tr key={order.orderID}>
                                <td>
                                    <Form.Check
                                        type="radio"
                                        checked={
                                            selectedOrder === order.orderID
                                        }
                                        onClick={() =>
                                            setSelectedOrder(
                                                selectedOrder === order.orderID
                                                    ? null
                                                    : order.orderID
                                            )
                                        }
                                        onChange={() => {}}
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
                                            variant={
                                                statusVariantMap[
                                                    order.orderStatus
                                                ]
                                            }
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
                                            <Dropdown.Item eventKey="4">
                                                Archived
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
                                            disabled={order.orderStatus === 3} // Disable if order status is 'Served'
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default Order;
