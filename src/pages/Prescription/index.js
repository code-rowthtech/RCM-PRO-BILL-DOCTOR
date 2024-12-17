import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row, Table, Form } from 'react-bootstrap';
import { FiFileText, FiFilter } from "react-icons/fi";
import { LuFileText, LuFileEdit } from "react-icons/lu";
import { Link } from 'react-router-dom';

const Prescription = () => {
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);

    const patientsData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 35,
            gender: 'Male',
            amount: '$200',
            appointmentDate: '2023-11-10',
            status: true, // true for active, false for inactive
            insuranceProvider: 'HealthCare Inc.',
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            age: 29,
            gender: 'Female',
            amount: '$150',
            appointmentDate: '2023-11-12',
            status: false,
            insuranceProvider: 'MediSure',
        },
    ];

    const handleStatusChange = (id) => {
        // Toggle the status of the patient with the given ID
        patientsData.forEach((patient) => {
            if (patient.id === id) {
                patient.status = !patient.status;
            }
        });
    };

    return (
        <>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={6}></Col>
                                <Col sm={6} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Search..."
                                                className="w-auto"
                                            />
                                            <Button className="custom-buttons" 
                                            as={Link} to="/apps/prescription/newPrescription"
                                            >
                                                New Prescription
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="text-white">
                                            <tr>
                                                <th className="text-white">Sr. No.</th>
                                                <th className="text-white">Patients Name</th>
                                                <th className="text-white">Doctor</th>
                                                <th className="text-white">Added at</th>
                                                <th className="text-white">Status</th>
                                                <th className="text-white">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patientsData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="text-center">
                                                        <h3 className="my-5">No Data Found</h3>
                                                    </td>
                                                </tr>
                                            ) : (
                                                patientsData.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className="text-capitalize">
                                                            {data.firstName + ' ' + data.lastName}
                                                        </td>
                                                        <td>Doctor Demo</td>
                                                        <td>{data.appointmentDate}</td>
                                                        <td>
                                                            <Form.Check
                                                                type="switch"
                                                                id={`status-${data.id}`}
                                                                checked={data.status}
                                                                onChange={() => handleStatusChange(data.id)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <LuFileEdit className="fs-4" />
                                                            &nbsp;
                                                            <LuFileText className="fs-4" />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={detailsModal} onHide={() => setDetailsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Patient Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Name:</h5>
                    <p>
                        {selectedDetails?.firstName} {selectedDetails?.lastName}
                    </p>
                    {/* Add more patient details here */}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Prescription;
