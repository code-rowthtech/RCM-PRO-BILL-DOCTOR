import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

const Insurances = () => {
    return (
        <div>
            <Row style={{ borderBottom: '1px solid black' }} className='pb-1'>
                <h4> Primary Insurance</h4>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insuranceCompany">
                        <Form.Label className="mb-0">Insurance Company</Form.Label>
                        <Form.Control type="text" placeholder="Enter Insurance Company" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="carrierPayerID">
                        <Form.Label className="mb-0">Carrier Payer ID</Form.Label>
                        <Form.Control type="text" placeholder="Enter Carrier Payer ID" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="alternateEligibilityPayer">
                        <Form.Label className="mb-0">Alternate Eligibility Payer</Form.Label>
                        <Form.Control type="text" placeholder="Enter Alternate Eligibility Payer" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="tplCode">
                        <Form.Label className="mb-0">TPL Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter TPL Code" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insuranceIDNumber">
                        <Form.Label className="mb-0">Insurance ID Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Insurance ID Number" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insuranceGroupName">
                        <Form.Label className="mb-0">Insurance Group Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Insurance Group Name" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insuranceGroupNumber">
                        <Form.Label className="mb-0">Insurance Group Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Insurance Group Number" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insurancePlanName">
                        <Form.Label className="mb-0">Insurance Plan Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Insurance Plan Name" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insurancePlanType">
                        <Form.Label className="mb-0">Insurance Plan Type</Form.Label>
                        <Form.Control type="text" placeholder="Enter Insurance Plan Type" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insuranceClaimOfficeNumber">
                        <Form.Label className="mb-0">Insurance Claim Office Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Insurance Claim Office Number" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="numberVisitsAllowed">
                        <Form.Label className="mb-0">Number Visits Allowed Per Year</Form.Label>
                        <Form.Control type="number" placeholder="Enter Number of Visits" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="cardIssuedDate">
                        <Form.Label className="mb-0">Card Issued Date</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insurancePhotoBack">
                        <Form.Label className="mb-0">Insurance Photo Back</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="insurancePhotoFront">
                        <Form.Label className="mb-0">Insurance Photo Front</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="primaryInsuranceNotes">
                        <Form.Label className="mb-0">Primary Insurance Notes</Form.Label>
                        <Form.Control as="textarea" rows={1} placeholder="Enter Notes" />
                    </Form.Group>
                </Col>
            </Row>
            <Row className='mt-2'>
                <h4> HCFA Options</h4>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="defaultOnsetDate">
                        <Form.Label className="mb-0">Default Onset Date</Form.Label>
                        <Form.Control as="select">
                            <option>Select Onset Date</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="defaultInitialVisitDate">
                        <Form.Label className="mb-0">Default Initial Visit Date</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>
                </Col>
               

            </Row>
            <Col className='d-flex justify-content-end my-2 gap-2'>
                    <Button
                        variant='primary'
                        className='fs-6 d-flex align-items-center justify-content-center custom-buttons'
                        style={{ height: '30px', padding: '0 15px' }}
                    >
                        Save and add another
                    </Button>
                    <Button
                        variant='primary'
                        className='fs-6 d-flex align-items-center justify-content-center custom-buttons'
                        style={{ height: '30px', padding: '0 15px' }}
                    >
                        Save and continue editing
                    </Button>
                    <Button
                        variant='primary'
                        className='fs-6 d-flex align-items-center justify-content-center custom-buttons'
                        style={{ height: '30px', padding: '0 15px' }}
                    >
                        Save
                    </Button>
                </Col>
        </div>
    )
}

export default Insurances