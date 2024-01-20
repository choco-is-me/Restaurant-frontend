import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Form, Button } from "react-bootstrap";

const ManageStaff = () => {
    const [staffList, setStaffList] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [shift, setShift] = useState("");
    const [specialty, setSpecialty] = useState("");

    const fetchData = () => {
        axios
            .get("staff_list")
            .then((response) => setStaffList(response.data))
            .catch((error) => console.error(`Error: ${error}`));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddStaff = () => {
        axios
            .post("signup", {
                name,
                role,
                shift,
                specialty,
            })
            .then(fetchData)
            .catch((error) => console.error(`Error: ${error}`));
    };

    const handleEditStaff = () => {
        const staff = staffList.find((s) => s.staffId === selectedStaff);
        axios
            .post("edit_staff", {
                staffID: selectedStaff,
                newName: name || staff.name,
                newRole: role || staff.role,
                newShift: shift || staff.shift,
                newSpecialty: specialty || staff.specialty,
            })
            .then(() => {
                fetchData();
                setSelectedStaff(null); // Reset the selected staff
            })
            .catch((error) => console.error(`Error: ${error}`));
    };
    

    const handleRemoveStaff = (staffId) => {
        axios
            .post("remove_staff", {
                staffID: staffId,
            })
            .then(fetchData)
            .catch((error) => console.error(`Error: ${error}`));
    };

    return (
        <Container className="d-flex justify-content-center table-container">
            <Table striped bordered hover className="staff-table" variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Shift</th>
                        <th>Specialty</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {staffList.map((staff, index) => (
                        <tr key={index}>
                            <td>
                                <Form.Check
                                    type="radio"
                                    name="selectedStaff"
                                    checked={selectedStaff === staff.staffId}
                                    onClick={() => {
                                        if (
                                            isClicked &&
                                            selectedStaff === staff.staffId
                                        ) {
                                            setSelectedStaff(null);
                                            setIsClicked(false);
                                        } else {
                                            setIsClicked(true);
                                        }
                                    }}
                                    onChange={() =>
                                        setSelectedStaff(staff.staffId)
                                    }
                                />
                            </td>
                            <td>{staff.staffId}</td>
                            <td>{staff.name}</td>
                            <td>{staff.role}</td>
                            <td>{staff.shift}</td>
                            <td>{staff.specialty}</td>
                            <td>
                                {selectedStaff === staff.staffId && (
                                    <Button
                                        variant="danger"
                                        onClick={() =>{
                                            handleRemoveStaff(staff.staffId)
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
            <Form className="staff-form">
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter role"
                        onChange={(e) => setRole(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formShift">
                    <Form.Label>Shift</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter shift"
                        onChange={(e) => setShift(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formSpecialty">
                    <Form.Label>Specialty</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter specialty"
                        onChange={(e) => setSpecialty(e.target.value)}
                    />
                </Form.Group>

                {selectedStaff ? (
                    <Button variant="dark" 
                            onClick={() =>{
                                handleEditStaff();
                            }}>
                        Edit
                    </Button>
                ) : (
                    <Button variant="dark" 
                            onClick={() =>{
                                handleAddStaff();
                            }}>
                        Add
                    </Button>
                )}
            </Form>
        </Container>
    );
};

export default ManageStaff;
