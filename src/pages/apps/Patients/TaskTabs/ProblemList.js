import React, { useState } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiEdit, FiPlus } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import AddProblem from "./AddProblem"; // Import AddProblem Component

const problemData = [
    {
        problem: "Diabetes Mellitus",
        codes: "E11.9",
        icdCmCode: "ICD-10",
        snomed: "44054006",
        diagnosedDate: "2024-01-15",
        dateChanged: "2024-02-01",
        status: "Active",
        notes: "Patient under insulin therapy",
        updates: "Updated dosage",
        id: 1,
    },
    {
        problem: "Hypertension",
        codes: "I10",
        icdCmCode: "ICD-10",
        snomed: "38341003",
        diagnosedDate: "2023-08-22",
        dateChanged: "2024-01-30",
        status: "Active",
        notes: "Monitoring blood pressure",
        updates: "Added new medication",
        id: 2,
    },
];

const ProblemList = () => {
    const [showAddProblem, setShowAddProblem] = useState(false);

    return (
        <div>
            {showAddProblem ? (
                <AddProblem onCancel={() => setShowAddProblem(false)} />
            ) : (
                <Row>
                    <Col sm={12} className="d-flex justify-content-between">
                        <h4>Active Problem</h4>
                        <div className="d-flex gap-2">
                            <p className="mb-0 mt-1">
                                <input className="form-check-input bg-primary me-1" type="checkbox" />
                                Show Inactive Problem
                            </p>
                            <p className="mb-0 mt-1">
                                <input className="form-check-input bg-primary me-1" type="checkbox" />
                                Patient has no known active problem
                            </p>
                            <Button className="custom-buttons text-nowrap" onClick={() => setShowAddProblem(true)}>
                                <FiPlus className="fs-5 text-white" />&nbsp; Problem
                            </Button>
                        </div>
                    </Col>
                    <Col sm={12}>
                        <Table responsive className="table-centered table-nowrap mb-0">
                            <thead className="text-white bg-dark">
                                <tr>
                                    <th className="text-white">Problem</th>
                                    <th className="text-white">Codes</th>
                                    <th className="text-white">ICD-CM Code</th>
                                    <th className="text-white">Snomed</th>
                                    <th className="text-white">Diagnosed Date</th>
                                    <th className="text-white">Date Changed</th>
                                    <th className="text-white">Status</th>
                                    <th className="text-white">Notes</th>
                                    <th className="text-white">Updates</th>
                                    <th className="text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problemData.map((data) => (
                                    <tr key={data.id}>
                                        <td>{data.problem}</td>
                                        <td>{data.codes}</td>
                                        <td>{data.icdCmCode}</td>
                                        <td>{data.snomed}</td>
                                        <td>{data.diagnosedDate}</td>
                                        <td>{data.dateChanged}</td>
                                        <td>{data.status}</td>
                                        <td><FaEye className="fs-4 ms-2 cursor-pointer text-black" /></td>
                                        <td>{data.updates}</td>
                                        <td>
                                            <Link to={`/edit-problem/${data.id}`}>
                                                <IoInformationCircleOutline className="fs-4 cursor-pointer text-black" />&nbsp;
                                                <FiEdit className="fs-4 cursor-pointer text-black" />&nbsp;
                                                <MdDeleteOutline className="fs-4 cursor-pointer text-black" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default ProblemList;
