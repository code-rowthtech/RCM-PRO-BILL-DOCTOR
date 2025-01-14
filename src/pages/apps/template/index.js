import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTemplateAction } from '../../../redux/actions';
import { Button, Card, Col, Row, Table, Modal, Form } from 'react-bootstrap';
import { FiFileText, FiFilter } from 'react-icons/fi';
import { PiFilePdf } from 'react-icons/pi';
import { FormInput } from 'lucide-react';
import { FaEye } from "react-icons/fa";

const Template = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const template = store?.getTemplateReducer?.data?.templates || [];
    console.log({ template })
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        const payload = {
            flag: 'Self',
            clinicId: '',
            associatedDepartment: '',
            search: '',
            favoriteStatus: ''
        };
        dispatch(getTemplateAction(payload));
    }, [dispatch]);

    // Handle modal open
    const handleOpenModal = (template) => {
        setSelectedTemplate(template);
        setShowModal(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTemplate(null);
    };

    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={6}></Col>
                                <Col sm={6} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput type="text" placeholder="Search..." />
                                            <Button className="custom-buttons">
                                                <FiFilter className="fs-4" />
                                            </Button>
                                            <Button className="custom-buttons">
                                                <PiFilePdf className="fs-4" />
                                            </Button>
                                            <FormInput type="Date" />
                                            <Button className="custom-buttons">
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
                                                <th className='text-white'>Template Name</th>
                                                <th className='text-white'>Date</th>
                                                <th className='text-white'>Gender</th>
                                                <th className='text-white'>Disease</th>
                                                <th className='text-white'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {template?.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className='text-center'>
                                                        <h3 className='my-5'>No Data Found</h3>
                                                    </td>
                                                </tr>
                                            ) : (
                                                template?.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className='text-capitalize'>{data?.templateName}</td>
                                                        <td>{data?.date}</td>
                                                        <td>{data.gender}</td>
                                                        <td>{data?.disease}</td>
                                                        <td>
                                                            <FaEye
                                                                className='text-secondary cursor-pointer'
                                                                onClick={() => handleOpenModal(data)}
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

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Template Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {selectedTemplate && (
                        <Form>
                            <Row>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Template Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.templateName}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Date</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.date}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Gender</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.gender}
                                            readOnly
                                        />
                                    </Form.Group>

                                </Col>
                            </Row>
                            <Row>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Age</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.age}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Chief Complaint</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.chiefComplaint}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Diagnosis</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.diagnosis}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Contact Number</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.contactNumber}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Disease</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.disease}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Patient Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.patientName}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Template Type</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.templateType}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Diagnosis</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.diagnosis}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                {/* <Col sm='4'>
                                    <Form.Group className='mb-3'>
                                        <Form.Label className='mb-0'>Patient Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            defaultValue={selectedTemplate.patientName}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col> */}
                            </Row>
                            <Row>
                                <Col sm="6">
                                    <Card className="mb-3 bg-white shadow-0">
                                        <Card.Header>
                                            <h6 className="mb-0">Treatment Plan</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <h6>Lifestyle Recommendations</h6>
                                            <ul>
                                                <li><strong>Diet:</strong> {selectedTemplate.treatmentPlan.lifestyleRecommendations.diet}</li>
                                                <li><strong>Exercise:</strong> {selectedTemplate.treatmentPlan.lifestyleRecommendations.exercise}</li>
                                                <li><strong>Other:</strong> {selectedTemplate.treatmentPlan.lifestyleRecommendations.other}</li>
                                            </ul>
                                            <h6>Medications</h6>
                                            <ul>
                                                {selectedTemplate.treatmentPlan.medications.map((med, index) => (
                                                    <li key={index}>
                                                        <strong>Name:</strong> {med.name}, <strong>Dosage:</strong> {med.dosage}
                                                    </li>
                                                ))}
                                            </ul>
                                            <h6>Therapies</h6>
                                            <ul>
                                                {selectedTemplate.treatmentPlan.therapies.map((therapy, index) => (
                                                    <li key={index}>
                                                        <strong>Type:</strong> {therapy.type}, <strong>Frequency:</strong> {therapy.frequency}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col sm="6" >
                                    <Card className="mb-3">
                                        <Card.Header>
                                            <h6 className="mb-0">Vitals</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col sm="6">
                                                    <p><strong>Temperature:</strong> {selectedTemplate.vitals.temperature}</p>
                                                    <p><strong>Blood Pressure:</strong> {selectedTemplate.vitals.bloodPressure}</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p><strong>Heart Rate:</strong> {selectedTemplate.vitals.heartRate}</p>
                                                    <p><strong>Oxygen Saturation:</strong> {selectedTemplate.vitals.oxygenSaturation}</p>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Template;
