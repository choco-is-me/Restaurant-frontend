import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const Menu = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/display_menu", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => setMenuItems(data));

        fetch("http://localhost:8000/display_ingredients", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => setIngredients(data));
    }, []);

    const addToCart = (item) => {
        const existingOrder = JSON.parse(localStorage.getItem("order"));
        const existingTable = localStorage.getItem("selectedTable");
        const existingStaff = localStorage.getItem("staffId");

        if (!existingTable) {
            alert("Please go back to select a table.");
            return;
        }

        const order = existingOrder || {
            orderId: Date.now(),
            tableNo: existingTable,
            staffId: existingStaff,
            items: [],
        };

        const existingItem = order.items.find((i) => i.itemId === item.itemID);

        if (existingItem) {
            alert("This item has already been added to the cart.");
            return;
        }

        if (item.inStock === 2) {
            alert("This item is out of stock.");
            return;
        }

        const ingredient = ingredients.find(
            (i) => i.ingredientID === item.itemID
        );

        if (ingredient && ingredient.amount < ingredient.threshold) {
            alert("The ingredient for this item is not enough.");
            return;
        }

        order.items.push({
            itemId: item.itemID,
            quantity: 1,
        });

        localStorage.setItem("order", JSON.stringify(order));
        setCart(order.items);
    };

    // Group the menu items into sub-arrays of 4 items each
    const rows = menuItems.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 4);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);

    return (
        <Container style={{ paddingTop: "50px", marginTop: "50rem" }}>
            <Button
                onClick={() => navigate("/cart")}
                style={{ position: "fixed", top: 20, right: 20 }}
            >
                Cart ({cart.length})
            </Button>
            {rows.map((rowItems, rowIndex) => (
                <Row key={rowIndex} className="mb-4">
                    {rowItems.map((item) => (
                        <Col xs={6} md={3} key={item.itemID} className="mb-4">
                            <Card style={{ width: "18rem" }}>
                                <Card.Img
                                    variant="top"
                                    src={require(`../images/${item.itemID}.png`)}
                                    style={{ height: "200px" }}
                                />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>{item.price}</Card.Text>
                                    <Button
                                        variant="primary"
                                        onClick={() => addToCart(item)}
                                    >
                                        +
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </Container>
    );
};

export default Menu;
