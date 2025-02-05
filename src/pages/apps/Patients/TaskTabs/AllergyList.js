import React, { useState } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiEdit, FiPlus } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import AddAllergy from "./AddAllergy"; // Renamed component

const allergyData = [
    {
        allergen: "Peanuts",
        reaction: "Anaphylaxis",
        rxNormCode: "123456",
        snomedCode: "91936005",
        status: "Active",
        notes: "Carries EpiPen",
        updates: "Last checked on 2024-01-10",
        id: 1,
    },
    {
        allergen: "Pollen",
        reaction: "Sneezing",
        rxNormCode: "654321",
        snomedCode: "40733004",
        status: "Active",
        notes: "Seasonal allergy",
        updates: "Updated severity status",
        id: 2,
    },
];


const AllergyList = () => {
    const [showAddAllergy, setShowAddAllergy] = useState(false);

    return (
        <div>
            {showAddAllergy ? (
                <AddAllergy onCancel={() => setShowAddAllergy(false)} />
            ) : (
                <Row>
                    <Col sm={12} className="d-flex justify-content-between">
                        <h4>Allergy List</h4>
                        <Button className="custom-buttons text-nowrap" onClick={() => setShowAddAllergy(true)}>
                            <FiPlus className="fs-5 text-white" />&nbsp; Add Allergy
                        </Button>
                    </Col>
                    <Col sm={12}>
                        <Table responsive className="table-centered table-nowrap mb-0">
                            <thead className="text-white bg-dark">
                                <tr>
                                    <th className="text-white">Allergen</th>
                                    <th className="text-white">Reaction</th>
                                    <th className="text-white">RxNorm Code</th>
                                    <th className="text-white">Snomed Code</th>
                                    <th className="text-white">Status</th>
                                    <th className="text-white">Notes</th>
                                    <th className="text-white">Updates</th>
                                    <th className="text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allergyData.map((data) => (
                                    <tr key={data.id}>
                                        <td>{data.allergen}</td>
                                        <td>{data.reaction}</td>
                                        <td>{data.rxNormCode}</td>
                                        <td>{data.snomedCode}</td>
                                        <td>{data.status}</td>
                                        <td>
                                            <FaEye className="fs-4 ms-2 cursor-pointer text-black" />
                                        </td>
                                        <td>{data.updates}</td>
                                        <td>
                                            <Link to={`/edit-allergy/${data.id}`}>
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

export default AllergyList;
