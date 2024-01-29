import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
} from "mdb-react-ui-kit";
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
        <MDBContainer
            style={{
                marginLeft: "7rem",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <ToastContainer />
            <MDBTable color="dark" hover striped className="my-table">
                <MDBTableHead>
                    <tr>
                        <th>#</th>
                        <th>Ingredient ID</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Threshold</th>
                        <th>Item ID</th>
                        <th>Action</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {sortedIngredientList.map((ingredient, index) => (
                        <tr key={index}>
                            <td>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
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
                                </div>
                            </td>
                            <td>{ingredient.ingredientID}</td>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.amount}</td>
                            <td>{ingredient.threshold}</td>
                            <td>{ingredient.itemID}</td>
                            <td>
                                {selectedIngredient ===
                                    ingredient.ingredientID && (
                                    <MDBBtn
                                        color="danger"
                                        onClick={() =>
                                            handleRemoveIngredient(
                                                ingredient.ingredientID
                                            )
                                        }
                                    >
                                        Remove
                                    </MDBBtn>
                                )}
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
            <div className="mb-3">
                <label htmlFor="formName" className="form-label">
                    Name
                </label>
                <MDBInput
                    id="formName"
                    type="text"
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="formAmount" className="form-label">
                    Amount
                </label>
                <MDBInput
                    id="formAmount"
                    type="number"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="formThreshold" className="form-label">
                    Threshold
                </label>
                <MDBInput
                    id="formThreshold"
                    type="number"
                    placeholder="Enter threshold"
                    onChange={(e) => setThreshold(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="formItemID" className="form-label">
                    Item ID
                </label>
                <MDBInput
                    id="formItemID"
                    type="number"
                    placeholder="Enter item ID"
                    onChange={(e) => setItemID(e.target.value)}
                />
            </div>
            <div style={{ paddingBottom: "3rem" }}>
                {selectedIngredient ? (
                    <MDBBtn
                        color="dark"
                        style={{ marginTop: "1rem" }}
                        onClick={() => handleEditIngredient()}
                    >
                        Edit
                    </MDBBtn>
                ) : (
                    <MDBBtn
                        color="dark"
                        style={{ marginTop: "1rem", marginLeft: "20rem" }}
                        onClick={() => handleAddIngredient()}
                    >
                        Add
                    </MDBBtn>
                )}
                <MDBBtn
                    color="danger"
                    style={{
                        marginLeft: "1rem",
                        marginTop: "1rem",
                    }}
                    onClick={() => resetAllAmounts()}
                >
                    Reset All
                </MDBBtn>
            </div>
        </MDBContainer>
    );
};

export default ManageIngredients;
