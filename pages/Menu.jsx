import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const Menu = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [cart, setCart] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetch("http://192.168.0.163:8000/display_menu", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => setMenuItems(data));

        fetch("http://192.168.0.163:8000/display_ingredients", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => setIngredients(data));

        const existingOrder = JSON.parse(localStorage.getItem("order"));
        if (existingOrder && existingOrder.items) {
            setSelectedItems(existingOrder.items.map((i) => i.itemId));
            setCart(existingOrder.items);
        } else {
            setSelectedItems([]);
        }
    }, [menuItems, ingredients]);

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

    const addToCart = (item) => {
        const existingOrder = JSON.parse(localStorage.getItem("order"));
        const existingTable = localStorage.getItem("selectedTable");
        const existingStaff = localStorage.getItem("staffID");

        if (!existingTable) {
            showToastWithMessage("Please go back to select a table.");
            return;
        }

        const order = existingOrder || {
            orderId: Date.now(),
            tableNo: existingTable,
            staffId: existingStaff,
            items: [],
        };

        const existingItemIndex = order.items.findIndex(
            (i) => i.itemId === item.itemID
        );

        const ingredientsForItem = ingredients.filter(
            (i) => i.itemID === item.itemID
        );

        if (existingItemIndex !== -1) {
            order.items.splice(existingItemIndex, 1);
        } else {
            if (item.inStock === 2) {
                showToastWithMessage("This item is out of stock.");
                return;
            }

            if (
                ingredientsForItem.some(
                    (ingredient) => ingredient.amount < ingredient.threshold
                )
            ) {
                showToastWithMessage(
                    "The ingredients for this item are not enough."
                );
                return;
            }

            // Create a new array for ingredients
            const ingredientsArray = ingredientsForItem.map((ingredient) => ({
                ingredientId: ingredient.itemID,
                ingredientAmount: ingredient.amount,
                ingredientThreshold: ingredient.threshold,
            }));

            order.items.push({
                itemId: item.itemID,
                name: item.name,
                price: item.price,
                quantity: 1,
                ingredients: ingredientsArray,
            });
        }

        if (order.items.length === 0) {
            localStorage.removeItem("order");
        } else {
            localStorage.setItem("order", JSON.stringify(order));
        }
        setCart(order.items);
        setSelectedItems(order.items.map((i) => i.itemId));
    };

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleConfirm = async () => {
        const order = JSON.parse(localStorage.getItem("order"));

        // Convert the order to the required format
        const requestBody = order.items.map((item) => ({
            orderId: order.orderId,
            itemId: item.itemId,
            quantity: item.quantity,
            staffId: order.staffId,
            tableNo: order.tableNo,
        }));

        const response = await fetch(
            "http://192.168.0.163:8000/add_item_to_order",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (response.ok) {
            // Clear the order from local storage and reload the page
            localStorage.removeItem("order");
            window.location.reload();
        } else {
            // Handle error
            console.error("Failed to add items to order");
        }
    };

    return (
        <Container style={{ paddingTop: "50px", marginTop: "50rem" }}>
            <ToastContainer />
            <Button
                variant="dark"
                onClick={handleShow}
                style={{ position: "fixed", top: 20, right: 30 }}
            >
                Cart ({cart.length})
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Your Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cart.map((item) => {
                        return (
                            <div
                                key={item.itemId}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <p style={{ margin: 0 }}>{item.name}</p>
                                <div>
                                    <Button>+</Button>
                                    <span style={{ margin: "0 10px" }}>
                                        {item.quantity}
                                    </span>
                                    <Button disabled={item.quantity <= 0}>
                                        -
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ flexGrow: 1, textAlign: "left" }}>
                        <p>Total Price: {totalPrice}</p>
                    </div>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row>
                {menuItems.map((item) => (
                    <Col
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={item.itemID}
                        className="mb-4"
                    >
                        <Card
                            style={{
                                width: "18rem",
                                // Change the background color if the item is selected
                                backgroundColor: selectedItems.includes(
                                    item.itemID
                                )
                                    ? "orange"
                                    : "white",
                            }}
                        >
                            <Card.Img
                                variant="top"
                                src={require(`../images/${item.itemID}.png`)}
                                style={{ height: "200px" }}
                            />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>{item.price}</Card.Text>
                                <Button
                                    variant="dark"
                                    onClick={() => addToCart(item)}
                                >
                                    +
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Menu;
