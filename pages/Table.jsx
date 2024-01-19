import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";

const Table = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(
        localStorage.getItem("selectedTable") || null
    );

    const fetchData = () => {
        axios
            .get("display_tables")
            .then((response) => {
                // Sort tables in ascending order based on table number
                response.data.sort((a, b) => a.tableNo - b.tableNo);
                setTables(response.data);
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMakeTable = (tableNo, e) => {
        e.preventDefault();
        const guestName = e.target.elements.guestName.value;
        axios
            .post("make_table", { tableNo, guestName })
            .then((response) => response.data)
            .then(fetchData)
            .catch((error) => console.error(error));
    };

    const handleRemoveTable = (tableNo, e) => {
        e.preventDefault();
        axios
            .post("remove_table", { tableNo })
            .then((response) => {
                if (response.data.status === "success") {
                    // Check if the removed table is the selected table
                    if (tableNo === selectedTable) {
                        // Update local storage and state variable
                        localStorage.removeItem("selectedTable");
                        setSelectedTable(null);
                    }
                }
            })
            .then(fetchData)
            .catch((error) => console.error(error));
    };

    const handleSelectTable = (tableNo) => {
        if (tableNo === selectedTable) {
            // If the table is already selected, deselect it
            localStorage.removeItem("selectedTable");
            setSelectedTable(null);
        } else {
            // Otherwise, select the table
            localStorage.setItem("selectedTable", tableNo);
            setSelectedTable(tableNo);
        }
    };

    return (
        <Container className="table-container">
            <Row className="table-row">
                {tables.map((table, index) => (
                    <Col md={4} sm={6} xs={12} key={index} className="mb-4">
                        <Row>
                            <Col xs={2}>
                                <Button
                                    variant="danger"
                                    className="button-remove-table"
                                    onClick={(e) =>{
                                        handleRemoveTable(table.tableNo, e);
                                    }}
                                >
                                    x
                                </Button>
                            </Col>
                            <Col xs={10}>
                                {table.guestName ? (
                                    <input
                                        type="text"
                                        value={`${table.tableNo}: ${table.guestName}`}
                                        onClick={() =>{
                                            handleSelectTable(table.tableNo);
                                        }}
                                        readOnly
                                        className="table-input"
                                        style={{
                                            backgroundColor:
                                                table.tableNo === selectedTable
                                                    ? "#ffbf80"
                                                    : "transparent",
                                            cursor: "pointer",
                                        }}
                                    />
                                ) : (
                                    <Form
                                        inline="true"
                                        onSubmit={(e) =>{
                                            handleMakeTable(table.tableNo, e)
                                        }}
                                        className="table-form"
                                    >
                                        <Form.Control
                                            type="text"
                                            name="guestName"
                                            placeholder={`${table.tableNo}: Guest Name`}
                                            required
                                            className="mr-2"
                                        />
                                        <Button
                                            variant="primary"
                                            className="button-add-table"
                                            type="submit"
                                        >
                                            +
                                        </Button>
                                    </Form>
                                )}
                            </Col>
                        </Row>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Table;
