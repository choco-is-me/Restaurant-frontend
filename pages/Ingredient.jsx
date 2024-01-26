import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const ManageIngredients = () => {
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
    const [ingredientList, setIngredientList] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [threshold, setThreshold] = useState("");
    const [itemID, setItemID] = useState("");

    const fetchData = () => {
        axios
            .get("display_ingredients")
            .then((response) => setIngredientList(response.data))
            .catch((error) => showToastWithMessage(`Error: ${error}`));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const sortedIngredientList = ingredientList.sort(
        (a, b) => a.ingredientID - b.ingredientID
    );

    const handleAddIngredient = () => {
        axios
            .post("add_ingredient", {
                ingredientName: name,
                amount,
                threshold,
                itemID,
            })
            .then(fetchData)
            .catch((error) => showToastWithMessage(`Error: ${error}`));
    };

    const handleEditIngredient = () => {
        const ingredient = ingredientList.find(
            (i) => i.ingredientID === selectedIngredient
        );

        const data = {
            ingredientID: selectedIngredient.toString(), // Convert to string
            newName: name || ingredient.name,
            newAmount: amount || ingredient.amount,
            newThreshold: (threshold || ingredient.threshold).toString(), // Convert to string
        };

        axios
            .post("edit_ingredient", data)
            .then(() => {
                fetchData();
                setSelectedIngredient(null); // Reset the selected ingredient
            })
            .catch((error) => showToastWithMessage(`Error: ${error}`));
    };

    const handleRemoveIngredient = (ingredientID) => {
        axios
            .post("remove_ingredient", {
                ingredientID,
            })
            .then(fetchData)
            .catch((error) => showToastWithMessage(`Error: ${error}`));
    };

    const resetAllAmounts = () => {
        axios
            .post("reset_ingredient_amounts")
            .then(() => {
                fetchData();
                showToastWithMessage("All ingredient amounts have been reset.");
            })
            .catch((error) => showToastWithMessage(`Error: ${error}`));
    };

    return (
        <Container className="table-container">
            <ToastContainer />
            <Table
                striped
                bordered
                hover
                className="staff-table"
                variant="dark"
            >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ingredient ID</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Threshold</th>
                        <th>Item ID</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedIngredientList.map((ingredient, index) => (
                        <tr key={index}>
                            <td>
                                <Form.Check
                                    type="radio"
                                    name="selectedIngredient"
                                    checked={
                                        selectedIngredient ===
                                        ingredient.ingredientID
                                    }
                                    onClick={() => {
                                        if (
                                            isClicked &&
                                            selectedIngredient ===
                                                ingredient.ingredientID
                                        ) {
                                            setSelectedIngredient(null);
                                            setIsClicked(false);
                                        } else {
                                            setIsClicked(true);
                                        }
                                    }}
                                    onChange={() =>
                                        setSelectedIngredient(
                                            ingredient.ingredientID
                                        )
                                    }
                                />
                            </td>
                            <td>{ingredient.ingredientID}</td>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.amount}</td>
                            <td>{ingredient.threshold}</td>
                            <td>{ingredient.itemID}</td>
                            <td>
                                {selectedIngredient ===
                                    ingredient.ingredientID && (
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            handleRemoveIngredient(
                                                ingredient.ingredientID
                                            );
                                        }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Form className="ingredient-form">
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formThreshold">
                    <Form.Label>Threshold</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter threshold"
                        onChange={(e) => setThreshold(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formItemID">
                    <Form.Label>Item ID</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter item ID"
                        onChange={(e) => setItemID(e.target.value)}
                    />
                </Form.Group>

                {selectedIngredient ? (
                    <Button
                        variant="dark"
                        style={{ marginTop: "1rem" }}
                        onClick={() => {
                            handleEditIngredient();
                        }}
                    >
                        Edit
                    </Button>
                ) : (
                    <Button
                        variant="dark"
                        style={{ marginTop: "1rem" }}
                        onClick={() => {
                            handleAddIngredient();
                        }}
                    >
                        Add
                    </Button>
                )}
                <Button
                    variant="danger"
                    style={{ marginLeft: "1rem", marginTop: "1rem" }}
                    onClick={() => {
                        resetAllAmounts();
                    }}
                >
                    Reset All
                </Button>
            </Form>
        </Container>
    );
};

export default ManageIngredients;
