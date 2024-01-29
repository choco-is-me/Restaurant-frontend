import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBContainer,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";

function Record() {
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
    const [recordList, setRecordList] = useState([]);

    useEffect(() => {
        axios
            .get("display_record")
            .then((response) => setRecordList(response.data))
            .catch((error) => showToastWithMessage(`Error: ${error}`));
    }, []);

    return (
        <MDBContainer
            style={{
                marginLeft: "7rem",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                borderCollapse: "collapse",
            }}
        >
            <ToastContainer />
            <MDBTable color="dark" hover striped className="my-table">
                <MDBTableHead>
                    <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Staff ID</th>
                        <th scope="col">Shift</th>
                        <th scope="col">Total Amount</th>
                        <th scope="col">Date</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {recordList.map((record) => (
                        <tr key={record.orderId}>
                            <td>{record.orderId}</td>
                            <td>{record.staffId}</td>
                            <td>{record.shift}</td>
                            <td>{record.totalAmount}</td>
                            <td>{record.date}</td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </MDBContainer>
    );
}

export default Record;
