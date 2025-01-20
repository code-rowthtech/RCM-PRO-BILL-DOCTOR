import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';

const Demographics = () => {
    return (
        <div>
            <Row style={{ borderBottom: '1px solid black' }} className='pb-1'>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="nationalId">
                        <Form.Label className="mb-0">Patient National ID Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter National ID" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="dob">
                        <Form.Label className="mb-0">Patient Date of Birth</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="country">
                        <Form.Label className="mb-0">Country</Form.Label>
                        <Form.Control type="text" placeholder="Enter Country" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="countryCode">
                        <Form.Label className="mb-0">Country Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter Country Code" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="approxAge">
                        <Form.Label className="mb-0">Approx Age</Form.Label>
                        <Form.Control type="number" placeholder="Enter Approx Age" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="sex">
                        <Form.Label className="mb-0">Sex</Form.Label>
                        <Form.Control as="select">
                            <option>Select Sex</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="mailAddress">
                        <Form.Label className="mb-0">Mail Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Mail Address" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="mailZipCode">
                        <Form.Label className="mb-0">Mail Zip Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter Zip Code" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="genderIdentity">
                        <Form.Label className="mb-0">Gender Identity</Form.Label>
                        <Form.Control type="text" placeholder="Enter Gender Identity" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="sexualOrientation">
                        <Form.Label className="mb-0">Sexual Orientation</Form.Label>
                        <Form.Control type="text" placeholder="Enter Sexual Orientation" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="mailCity">
                        <Form.Label className="mb-0">Mail City</Form.Label>
                        <Form.Control type="text" placeholder="Enter Mail City" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="mailState">
                        <Form.Label className="mb-0">Mail State</Form.Label>
                        <Form.Control type="text" placeholder="Enter Mail State" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="race">
                        <Form.Label className="mb-0">Race</Form.Label>
                        <Form.Control type="text" placeholder="Enter Race" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="raceSubcategories">
                        <Form.Label className="mb-0">Race - Subcategories</Form.Label>
                        <Form.Control type="text" placeholder="Enter Race Subcategories" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="timeZone">
                        <Form.Label className="mb-0">Time Zone</Form.Label>
                        <Form.Control type="text" placeholder="Enter Time Zone" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="note">
                        <Form.Label className="mb-0">Note</Form.Label>
                        <Form.Control as="textarea" placeholder="Enter Notes" rows={1} />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="ethnicity">
                        <Form.Label className="mb-0">Ethnicity</Form.Label>
                        <Form.Control type="text" placeholder="Enter Ethnicity" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="preferredLanguage">
                        <Form.Label className="mb-0">Preferred Language</Form.Label>
                        <Form.Control type="text" placeholder="Enter Preferred Language" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="maritalStatus">
                        <Form.Label className="mb-0">Patient's Marital Status</Form.Label>
                        <Form.Control type="text" placeholder="Enter Marital Status" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="maritalStatus">
                        <Form.Label className="mb-0">EPSDT Services</Form.Label>
                        <Form.Control type="text" placeholder="Enter EPSDT Services" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="maritalStatus">
                        <Form.Label className="mb-0">Patient Student Status</Form.Label>
                        <Form.Control type="text" placeholder="Enter Patient Student Status" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="maritalStatus">
                        <Form.Label className="mb-0">Country</Form.Label>
                        <Form.Control type="text" placeholder="Enter Country" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="maritalStatus">
                        <Form.Label className="mb-0">EPSDT Referral Condition</Form.Label>
                        <Form.Control type="text" placeholder="Enter EPSDT Referral Condition" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="emergencyContactName">
                        <Form.Label className="mb-0">Emergency Contact Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Emergency Contact Name" />
                    </Form.Group>
                </Col>


                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="streetAddress">
                        <Form.Label className="mb-0">Street Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Street Address" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="zipCode">
                        <Form.Label className="mb-0">Zip Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter Zip Code" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="emergencyContactPhone">
                        <Form.Label className="mb-0">Emergency Contact Phone</Form.Label>
                        <Form.Control type="text" placeholder="Enter Contact Phone" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="emergencyContactPhone">
                        <Form.Label className="mb-0">Emergency Contact Relation</Form.Label>
                        <Form.Control type="text" placeholder="Enter Contact Relation" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="city">
                        <Form.Label className="mb-0">City</Form.Label>
                        <Form.Control type="text" placeholder="Enter City" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="state">
                        <Form.Label className="mb-0">State</Form.Label>
                        <Form.Control type="text" placeholder="Enter State" />
                    </Form.Group>
                </Col>
            </Row>

            <Row style={{ borderBottom: '1px solid black' }} className='mt-2'>
                {/* Referring Doctor Information */}
                <h4> Referring Doctor</h4>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorSearch">
                        <Form.Label className="mb-0">Referring Doctor Search</Form.Label>
                        <Form.Control type="text" placeholder="Search Referring Doctor" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorFirstName">
                        <Form.Label className="mb-0">Referring Dr. First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter First Name" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorMiddleName">
                        <Form.Label className="mb-0">Referring Dr. Middle Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Middle Name" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorLastName">
                        <Form.Label className="mb-0">Referring Dr. Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Last Name" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorSpecialty">
                        <Form.Label className="mb-0">Referring Dr. Specialty</Form.Label>
                        <Form.Control as="select">
                            <option>Select Specialty</option>
                            <option>Cardiology</option>
                            <option>Orthopedics</option>
                            <option>Dermatology</option>
                            <option>Pediatrics</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorEmail">
                        <Form.Label className="mb-0">Referring Dr. Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorPhone">
                        <Form.Label className="mb-0">Referring Dr. Phone</Form.Label>
                        <Form.Control type="text" placeholder="Enter Phone Number" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorFax">
                        <Form.Label className="mb-0">Referring Dr. Fax</Form.Label>
                        <Form.Control type="text" placeholder="Enter Fax Number" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorSuffix">
                        <Form.Label className="mb-0">Referring Dr. Suffix</Form.Label>
                        <Form.Control type="text" placeholder="Enter Suffix" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringDoctorNPI">
                        <Form.Label className="mb-0">Referring Dr. NPI Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter NPI Number" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="referringSource">
                        <Form.Label className="mb-0">Referring Source</Form.Label>
                        <Form.Control type="text" placeholder="Enter Referring Source" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="primaryCarePhysician">
                        <Form.Label className="mb-0">Primary Care Physician</Form.Label>
                        <Form.Control type="text" placeholder="Enter Primary Care Physician" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-2" controlId="referringDoctorQualifier">
                        <Form.Label className="mb-0">Referring Dr. Qualifier</Form.Label>
                        <Form.Control as="select">
                            <option>Select Qualifier</option>
                            <option>MD</option>
                            <option>DO</option>
                            <option>NP</option>
                            <option>PA</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-2" controlId="referringDoctorNumber">
                        <Form.Label className="mb-0">Referring Dr. Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Referring Dr. Number" />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-2" controlId="referringNumber">
                        <Form.Label className="mb-0">Referring Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Referring Number" />
                    </Form.Group>
                </Col>
            </Row>

            <Row className='mt-2'>
                <h4> Employer</h4>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="employer">
                        <Form.Label className="mb-0">Employer</Form.Label>
                        <Form.Control type="text" placeholder="Enter Employer Name" />
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="employerPhone">
                        <Form.Label className="mb-0">Employer Phone</Form.Label>
                        <Form.Control type="text" placeholder="Enter Employer Phone" />
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="employerAddress">
                        <Form.Label className="mb-0">Employer Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Employer Address" />
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="employerZip">
                        <Form.Label className="mb-0">Employer Zip Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter Zip Code" />
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-2" controlId="employerCity">
                        <Form.Label className="mb-0">Employer City</Form.Label>
                        <Form.Control type="text" placeholder="Enter City" />
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-2" controlId="employerState">
                        <Form.Label className="mb-0">Employer State</Form.Label>
                        <Form.Control as="select">
                            <option>Select State</option>
                            <option>Alabama</option>
                            <option>Alaska</option>
                            <option>Arizona</option>
                            <option>California</option>
                            <option>Florida</option>
                            <option>New York</option>
                            <option>Texas</option>
                            <option>Washington</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col className='d-flex justify-content-end align-items-center mb-2 gap-2'>
                    <Button variant='danger' className='fs-6' style={{ height: '30px' }}>Delete</Button>
                    <Button variant='secondary' className='fs-6' style={{ height: '30px' }}>Clear</Button>
                    <Button variant='success' className='fs-6' style={{ height: '30px' }}>Next</Button>
                </Col>

            </Row>

        </div>
    )
}

export default Demographics