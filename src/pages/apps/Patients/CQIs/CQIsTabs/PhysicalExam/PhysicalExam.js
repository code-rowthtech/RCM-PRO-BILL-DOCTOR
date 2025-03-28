import React from "react";
import { Table } from "react-bootstrap";

const PhysicalExam = ({ physicalExams = [] }) => {

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
                        <th className="text-white">Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {physicalExams?.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="fw-bold text-center">
                                No Physical Exam available
                            </td>
                        </tr>
                    ) : (
                        physicalExams?.map((exam, index) => (
                            <tr key={index}>
                                <td>{exam?.datetime}</td>
                                <td>{exam?.type}</td>
                                <td>{exam?.code}</td>
                                <td>{exam?.description}</td>
                                <td>{exam?.value}</td>
                                <td>{exam?.unit}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default PhysicalExam;
