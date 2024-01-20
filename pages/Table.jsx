import React, { useState, useEffect } from "react";
import { Table as BootstrapTable, Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const Table = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(
        localStorage.getItem("selectedTable") || null
    );

    const fetchData = (tableNo) => {
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
        console.log(selectedTable);
        console.log(tableNo)
    };

    return (
        <Container className="d-flex justify-content-center table-container">
        <BootstrapTable striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>TableNo</th>
                    <th>Guest</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {tables.map((table) => (
                    <tr
                        key={table.tableNo}
                        onDoubleClick={() => table.guestName && handleSelectTable(table.tableNo)}
                    >
                        <td>{table.tableNo}</td>
                        <td>
                            {table.guestName ? (
                                <>
                                    {table.tableNo === selectedTable && '⭐'}
                                    {table.guestName}
                                </>
                            ) : (
                                <Form onSubmit={(e) => handleMakeTable(table.tableNo, e)}>
                                    <Form.Control name="guestName" type="text" placeholder="Enter guest name" required />
                                </Form>
                            )}
                        </td>
                        <td>
                            {table.tableNo === selectedTable && (
                                <Button variant="danger" onClick={(e) => handleRemoveTable(table.tableNo, e)}>
                                    Remove
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </BootstrapTable>
        </Container>
    );
};

export default Table;
