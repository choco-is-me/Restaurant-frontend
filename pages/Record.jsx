import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBContainer,
} from "mdb-react-ui-kit";

function Record() {
    const [recordList, setRecordList] = useState([]);
    const [shiftTotals, setShiftTotals] = useState({});

    useEffect(() => {
        axios.get("display_record").then((response) => {
            if (response.data.length === 0) {
            } else {
                setRecordList(response.data);
                const totals = response.data.reduce((acc, record) => {
                    acc[record.shift] =
                        (acc[record.shift] || 0) + record.totalAmount;
                    return acc;
                }, {});
                setShiftTotals(totals);
            }
        });
    }, []);

    if (recordList.length === 0) {
        return (
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100vh",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "2rem",
                }}
            >
                Record Is Empty
            </div>
        );
    }

    return (
        <MDBContainer
            style={{
                marginTop: "3rem",
                display: "flex",
                marginLeft: "7rem",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                borderCollapse: "collapse",
                borderSpacing: "0",
                width: "100%",
                overflowX: "auto",
                overflowY: "auto",
            }}
        >
            <h2
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                Shift Summary
            </h2>
            <MDBTable color="dark" hover striped className="my-table">
                <MDBTableHead>
                    <tr>
                        <th scope="col">Shift</th>
                        <th scope="col">Revenue</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {Object.entries(shiftTotals).map(
                        ([shift, total], index) => (
                            <tr key={index}>
                                <td>{shift}</td>
                                <td>{total} VND</td>
                            </tr>
                        )
                    )}
                </MDBTableBody>
            </MDBTable>
            <h2
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                Shift Details
            </h2>
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
                    {recordList.map((record, index) => (
                        <tr key={index}>
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
