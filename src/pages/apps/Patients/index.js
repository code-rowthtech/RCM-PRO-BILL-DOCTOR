import React, { useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { LuFileText, LuFileEdit } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Patients = () => {

    const patientsData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            phone: '123-456-7890',
            appointmentDate: '2023-11-10',
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '555-789-1234',
            appointmentDate: '2023-11-12',
        },
        {
            id: 3,
            firstName: 'Michael',
            lastName: 'Johnson',
            phone: '987-654-3210',
            appointmentDate: '2023-11-15',
        },
        {
            id: 4,
            firstName: 'Emily',
            lastName: 'Davis',
            phone: '444-555-6666',
            appointmentDate: '2023-11-18',
        },
        {
            id: 5,
            firstName: 'Chris',
            lastName: 'Brown',
            phone: '222-333-4444',
            appointmentDate: '2023-11-20',
        },
        {
            id: 6,
            firstName: 'Amanda',
            lastName: 'Wilson',
            phone: '111-222-3333',
            appointmentDate: '2023-11-25',
        },
        {
            id: 7,
            firstName: 'David',
            lastName: 'Martinez',
            phone: '999-888-7777',
            appointmentDate: '2023-11-28',
        },
        {
            id: 8,
            firstName: 'Jessica',
            lastName: 'Taylor',
            phone: '666-777-8888',
            appointmentDate: '2023-12-01',
        },
        {
            id: 9,
            firstName: 'Robert',
            lastName: 'Anderson',
            phone: '333-222-1111',
            appointmentDate: '2023-12-05',
        },
        {
            id: 10,
            firstName: 'Sophia',
            lastName: 'Thomas',
            phone: '555-444-3333',
            appointmentDate: '2023-12-10',
        },
    ];

    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={12} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput type="text" placeholder="Search..." />
                                            <Button as={Link} to="/apps/patients/new-patient" className="custom-buttons ">Add New Patient</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="text-white bg-dark">
                                            <tr>
                                                <th className='text-white'>Patients ID</th>
                                                <th className='text-white'>Patients Name</th>
                                                <th className='text-white'>Phone Number</th>
                                                <th className='text-white'>Last Appointment</th>
                                                <th className='text-white'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patientsData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className='text-center'>
                                                        <h3 className='my-5'>No Data Found</h3>
                                                    </td>
                                                </tr>
                                            ) : (
                                                patientsData.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>0000{data.id}</td>
                                                        <td className='text-capitalize'>
                                                            {data.firstName + ' ' + data.lastName}
                                                        </td>
                                                        <td>{data.phone}</td>
                                                        <td>{data.appointmentDate}</td>
                                                        <td>
                                                            <FaEye
                                                                className='fs-4 ms-2 cursor-pointer'
                                                            />
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

        </>
    );
}

export default Patients;
