import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../components';
import { FiFileText, FiFilter } from "react-icons/fi";
import { PiFilePdf } from "react-icons/pi";
import { LuFileText } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";

const Patients = () => {
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);

    // Static patient data with additional fields
    const patientsData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 35,
            gender: 'Male',
            amount: '$200',
            appointmentDate: '2023-11-10',
            status: 'Confirmed',
            insuranceProvider: 'HealthCare Inc.',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            }
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            age: 29,
            gender: 'Female',
            amount: '$150',
            appointmentDate: '2023-11-12',
            status: 'Pending',
            insuranceProvider: 'MediSure',
            email: 'jane.smith@example.com',
            phone: '555-789-1234',
            address: {
                street: '456 Elm St',
                city: 'Greenwood',
                state: 'CA',
                zipCode: '90210'
            }
        },
        // Additional entries as needed
    ];

    const closeDetailsModal = () => {
        setDetailsModal(false);
        setSelectedDetails(null);
    };

    const [status, setStatus] = useState(true);

    const handleStatusChange = (isActive) => {
        setStatus(isActive);
    };

    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={6}>
                                    <Button variant={status === false ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(true)}
                                        className={`${status === true ? 'custom-buttons text-white' : 'bg-none border-primary'} me-2`}
                                    >
                                        Confirm
                                    </Button>
                                    <Button variant={status === true ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(false)}
                                        className={`${status === false ? 'custom-buttons text-white' : 'bg-none border-primary'} me-2`}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                                <Col sm={6} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput
                                                type="text"
                                                placeholder="Search..."
                                            />
                                            <Button className="custom-buttons ">
                                                <FiFilter className="fs-4" />
                                            </Button>
                                            <Button className="custom-buttons ">
                                                <PiFilePdf className="fs-4" />
                                            </Button>
                                            <FormInput
                                                type="Date"
                                            />
                                            <Button className="custom-buttons ">
                                                <FiFileText className="fs-4" />
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
                                                <th className='text-white'>Sr. No.</th>
                                                <th className='text-white'>Patients Name</th>
                                                <th className='text-white'>Age</th>
                                                <th className='text-white'>Gender</th>
                                                <th className='text-white'>Amount</th>
                                                <th className='text-white'>Appointment Date</th>
                                                <th className='text-white'>Status</th>
                                                <th className='text-white'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patientsData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className='text-center'>
                                                        <h3 className='my-5'>No Data Found</h3>
                                                    </td>
                                                </tr>
                                            ) : (
                                                patientsData.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className='text-capitalize'>
                                                            {data.firstName + ' ' + data.lastName}
                                                        </td>
                                                        <td>{data.age}</td>
                                                        <td>{data.gender}</td>
                                                        <td>{data.amount}</td>
                                                        <td>{data.appointmentDate}</td>
                                                        <td>{data.status}</td>
                                                        <td><FaRegEdit className='fs-4' />&nbsp;<LuFileText className='fs-4' /></td>

                                                        {/* <td>
                                                            
                                                            <Link to="#" className="action-icon">
                                                                <i
                                                                    onClick={() => {
                                                                        setDetailsModal(true);
                                                                        setSelectedDetails(data);
                                                                    }}
                                                                    className="mdi mdi-eye"></i>
                                                            </Link>
                                                        </td> */}
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

            <Modal show={detailsModal} onHide={closeDetailsModal}>
                <Modal.Header
                    onHide={closeDetailsModal}
                    closeButton
                    className={'modal-colored-header pb-0 border-0 text-center'}>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="mt-0 text-center">Patient Details</h4>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}><h5>Name</h5></Col>
                            <Col sm={6}><p className='mb-0 text-start'>{selectedDetails?.firstName + ' ' + selectedDetails?.lastName}</p></Col>
                        </Col>
                        {/* Additional fields as needed */}
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Patients;
