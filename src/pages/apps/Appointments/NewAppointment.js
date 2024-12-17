// @flow
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';

const NewAppointment = () => {
    const navigate = useNavigate();
    const handleAppointment = () => {
        navigate('/apps/appointments/list');
    };

    return (
        <Card className="mt-4">
            {/* Card Header */}
            <div className="d-flex justify-content-between align-items-center mx-3 mt-2">
                <h5 className="fw-bold mb-0">New Appointment</h5>
                <Button onClick={handleAppointment}>Back</Button>
            </div>

            {/* Card Body */}
            <Card.Body>
                <Form>
                    <Row>
                        {/* Left Column */}
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="patient">
                                <Form.Label>Patient</Form.Label>
                                <Form.Select>
                                    <option>Select Name</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="doctor">
                                <Form.Label>Doctor</Form.Label>
                                <Form.Select>
                                    <option>Select Doctor</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter description"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="belongToDoctor">
                                <Form.Label>Belong to Doctor</Form.Label>
                                <Form.Select>
                                    <option>Belong to Doctor</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* Right Column */}
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="doctorDepartment">
                                <Form.Label>Doctor Department</Form.Label>
                                <Form.Select>
                                    <option>Doctor Department</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="date">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" />
                            </Form.Group>

                            <Form.Group className="mb-5">
                                <Form.Label className='mb-2'>Status</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="statusSwitch"
                                    label="Active"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 pt-1" controlId="taraq">
                                <Form.Label>Taraq</Form.Label>
                                <Form.Control type="text" placeholder="Taraq" />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>

            {/* Card Footer */}
            <div className="text-end mb-2 me-3">
                <Button variant="secondary" className="me-2">Cancel</Button>
                <Button variant="primary">Save</Button>
            </div>
        </Card>
    );
};

export default NewAppointment;
