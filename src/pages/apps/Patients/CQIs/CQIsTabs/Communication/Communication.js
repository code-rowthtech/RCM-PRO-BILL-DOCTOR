import React from "react";
import { Table } from "react-bootstrap";

const Communication = ({communications =[]}) => {

    return (
        <div>
            {/* Table Section */}
            <Table responsive className="table table-nowrap mb-0">
                <thead className="text-white bg-dark">
                    <tr>
                        <th className="text-white">Datetime</th>
                        <th className="text-white">Type</th>
                        <th className="text-white">Code</th>
                        <th className="text-white">Description</th>
                        <th className="text-white">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {communications?.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="fw-bold text-center">
                                No Communication available
                            </td>
                        </tr>
                    ) : (
                        communications?.map((comm, index) => (
                            <tr key={index}>
                                <td>{comm?.datetime}</td>
                                <td>{comm?.type}</td>
                                <td>{comm?.code}</td>
                                <td>{comm?.description}</td>
                                <td>{comm?.value}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default Communication;
