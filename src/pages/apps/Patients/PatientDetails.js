import React from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

const PatientDetails = () => {
    return (
        <div>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Primary Provider</Form.Label>
                        <Form.Select>
                            <option value="1">Select Primary Provider</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">First Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter First Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Status</Form.Label>
                        <Form.Select>
                            <option value="1">Select Status</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Middle Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Middle Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Title</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Title'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Last Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Last Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Previous Birth Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Previous Birth Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Suffix</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Previous Birth Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Patient Chart Photo</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Patient Chart Photo'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Home Phone</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Home Phone'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Cell Phone</Form.Label>
                        <Form.Select>
                            <option value="1">Select Cell Phone</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Preferred Communication</Form.Label>
                        <Form.Select>
                            <option value="1">Select Preferred Communication</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Office Phone</Form.Label>
                        <Form.Select>
                            <option value="1">Select Office Phone</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Reminder Language</Form.Label>
                        <Form.Select>
                            <option value="1">Select Reminder Language</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Email</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Email'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Medication History Consent</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Medication History Consent'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Alternate Email</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Alternate Email'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Payment Profile</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Payment Profile'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Patient Chart Photo</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Patient Chart Photo'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Patient’s Copay $</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Patient’s Copay $'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2" controlId="templateSelect">
                        <Form.Label className="mb-0">Follow -up date</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Follow -up date'
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2" controlId="templateSelect">
                        <Form.Label className="mb-0">Follow-Up Reason</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Follow-Up Reason'
                        />
                    </Form.Group>
                </Col>
                <Col className='d-flex justify-content-end mb-2'>
                    <Button variant='success' className='fs-6' style={{ height: '30px' }}>Save</Button>
                </Col>
            </Row>
        </div>
    )
}

export default PatientDetails