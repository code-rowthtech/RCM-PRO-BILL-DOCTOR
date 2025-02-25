import React from "react";
import { Table } from "react-bootstrap";

const Intervention = ({ interventions = [] }) => {

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
                    {interventions?.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="fw-bold text-center">
                                No Intervention available
                            </td>
                        </tr>
                    ) : (
                        interventions?.map((intervention, index) => (
                            <tr key={index}>
                                <td>{intervention?.datetime}</td>
                                <td>{intervention?.type}</td>
                                <td>{intervention?.code}</td>
                                <td>{intervention?.description}</td>
                                <td>{intervention?.value}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default Intervention;
