import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Menu = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [cart, setCart] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchData = async () => {
        try {
            const menuResponse = await axios.get("display_menu");
            setMenuItems(menuResponse.data);

            const ingredientsResponse = await axios.get("display_ingredients");
            setIngredients(ingredientsResponse.data);

            const orderStatusResponse = await axios.get("display_order_status");
            let maxOrderId = Math.max(
                ...orderStatusResponse.data.map((order) => order.orderID)
            );
            maxOrderId = maxOrderId === -Infinity ? 60 : maxOrderId;
            localStorage.setItem("maxOrderId", maxOrderId.toString());

            const existingOrder = JSON.parse(localStorage.getItem("order"));
            if (existingOrder && existingOrder.items) {
                setSelectedItems(existingOrder.items.map((i) => i.itemId));
                setCart(existingOrder.items);
            } else {
                setSelectedItems([]);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

        let orderId = localStorage.getItem("maxOrderId");
        if (orderId === null) {
            orderId = "60";
        } else {
            orderId = (parseInt(orderId, 10) + 1).toString();
        }
        localStorage.setItem("maxOrderId", orderId);

        const order = existingOrder || {
            orderId: parseInt(orderId, 10),
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
        fetchData();
    };

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleQuantityChange = (item, operator) => {
        // Get the existing order from local storage
        let order = JSON.parse(localStorage.getItem("order"));

        // Find the index of the item in the order
        let itemIndex = order.items.findIndex((i) => i.itemId === item.itemId);

        // If the item is not in the order, return
        if (itemIndex === -1) {
            return;
        }

        // Get the current quantity of the item
        let quantity = order.items[itemIndex].quantity;

        // Change the quantity based on the operator (+ or -)
        if (operator === "+") {
            // Check if the new quantity of the item exceeds the ingredient threshold
            const ingredientsForItem = item.ingredients;
            const potentialLostOfIngredients = ingredientsForItem.map(
                (i) => (quantity + 1) * i.ingredientThreshold
            );
            const isIngredientSufficient = potentialLostOfIngredients.every(
                (lost, index) => {
                    return lost <= ingredientsForItem[index].ingredientAmount;
                }
            );

            // If the ingredient threshold is exceeded, show a toast message and return
            if (!isIngredientSufficient) {
                showToastWithMessage(
                    "The ingredients for this item are not enough. Please decrease the quantity."
                );
                return;
            }

            quantity++;
            fetchData();
        } else if (operator === "-" && quantity > 1) {
            quantity--;
            fetchData();
        } else if (quantity === 1) {
            // Remove the item from the order if the quantity is 1 and the user presses "-"
            order.items.splice(itemIndex, 1);
            // Save the updated order to local storage
            localStorage.setItem("order", JSON.stringify(order));
            fetchData();
            return; // Return here after removing the item
        }

        // Update the quantity of the item in the order
        order.items[itemIndex].quantity = quantity;

        // Save the updated order to local storage
        localStorage.setItem("order", JSON.stringify(order));
    };

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

        try {
            await axios
                .post("add_item_to_order", requestBody)
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.removeItem("order");
                        window.location.reload();
                    }
                });
        } catch (error) {
            showToastWithMessage("Failed to add items to order");
        }
    };

    return (
        <Container className="menu" style={{ paddingTop: "50px", marginTop: "50rem" }}>
            <ToastContainer />
            <Button
                className="cart-button"
                variant="dark"
                onClick={() => {
                    handleShow();
                }}
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
                                    <Button
                                        onClick={() =>
                                            handleQuantityChange(item, "+")
                                        }
                                    >
                                        +
                                    </Button>
                                    <span style={{ margin: "0 10px" }}>
                                        {item.quantity}
                                    </span>
                                    <Button
                                        disabled={item.quantity <= 0}
                                        onClick={() =>
                                            handleQuantityChange(item, "-")
                                        }
                                    >
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
                    <Button
                        variant="secondary"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleConfirm();
                        }}
                    >
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
                                    onClick={() => {
                                        addToCart(item);
                                    }}
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
