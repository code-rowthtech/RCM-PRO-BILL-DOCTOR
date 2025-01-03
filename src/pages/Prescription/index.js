import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PrescriptionTable from './prescription';
import ClinicalNotes from './clinicalNotes';
import TreatmentPlans from './treatmentPlans';
import CompleatedProcedures from './compleatedProcedures';
import Files from './files';
import NewPrescription from './newPrescription';
import NewClinicalNotes from './newClinicalNotes';

const Prescription = () => {
    const [selectedPatient, setSelectedPatient] = useState('Select Patient');
    const [activeTab, setActiveTab] = useState('prescription');
    const [ShowNewPrescription, setShowNewPrescription] = useState(false);
    const [ShowNewClinicalNotes, setShowNewClinicalNotes] = useState(false);


    const renderTabContent = () => {
        switch (activeTab) {
            case 'prescription':
                if (ShowNewPrescription) {
                    return <NewPrescription />;
                } else {
                    return <PrescriptionTable />;
                }
            case 'clinicalNotes':
                if (ShowNewClinicalNotes) {
                    return <NewClinicalNotes />;
                } else {
                    return <ClinicalNotes />;
                }
            case 'treatmentPlans':
                return <TreatmentPlans />;
            case 'completedProcedures':
                return <CompleatedProcedures />;
            case 'files':
                return <Files />;
            default:
                return null;
        }
    };

    const handleSelect = (patient) => {
        setSelectedPatient(patient);
        console.log(`Selected Patient: ${patient}`);
        // Add additional logic if needed
    };

    return (
        <>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card style={{ height: '87vh' }}>
                        <Card.Body>
                            <Row>
                                <Col >
                                    <div className="d-flex justify-content-end gap-2">
                                        <Card style={{
                                            background: '#E6EBFF',
                                            width: '75vw',
                                            // height: '3.8vh',
                                            border: '1px solid #a4c5d5'
                                        }}>
                                            <Card.Body className="p-1">
                                                <p className="mb-0 ms-2 fw-bold text-secondary">All Patients</p>
                                            </Card.Body>
                                        </Card>
                                        <DropdownButton
                                            title={selectedPatient}
                                            id="dropdown-patient-button"
                                            className="text-nowrap"
                                            onSelect={handleSelect} // Bind the onSelect handler
                                        >
                                            <Dropdown.Item eventKey="John Doe">John Doe</Dropdown.Item>
                                            <Dropdown.Item eventKey="Jane Smith">Jane Smith</Dropdown.Item>
                                            <Dropdown.Item eventKey="Michael Brown">Michael Brown</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={8}>
                                    <ul className="nav nav-underline">
                                        {['prescription', 'clinicalNotes', 'treatmentPlans', 'completedProcedures', 'files'].map((tab, index) => (
                                            <li className="nav-item" key={index}>
                                                <a
                                                    className={classNames('nav-link fw-bold text-black', {
                                                        active: activeTab === tab,
                                                    })}
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab(tab);
                                                    }}
                                                >
                                                    {tab === 'prescription' && 'Prescription'}
                                                    {tab === 'clinicalNotes' && 'Clinical Notes'}
                                                    {tab === 'treatmentPlans' && 'Treatment Plans'}
                                                    {tab === 'completedProcedures' && 'Completed Procedures'}
                                                    {tab === 'files' && 'Files'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                                <Col sm={4} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Search..."
                                                className="w-auto"
                                            />
                                            {activeTab === 'prescription' && (
                                                <Button
                                                    className={` ${ShowNewPrescription ? 'bg-danger' : 'custom-buttons'}`}
                                                    onClick={() => setShowNewPrescription(!ShowNewPrescription)}
                                                >
                                                    {!ShowNewPrescription ? 'New Prescription' : 'Back'}
                                                </Button>
                                            )}
                                            {activeTab === 'clinicalNotes' && (
                                                <Button
                                                    className={` ${ShowNewClinicalNotes ? 'bg-danger' : 'custom-buttons'}`}
                                                    onClick={() => setShowNewClinicalNotes(!ShowNewClinicalNotes)}
                                                >
                                                    {!ShowNewClinicalNotes ? 'Create Notes' : 'Back'}
                                                </Button>
                                            )}

                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <div className="mt-1">{renderTabContent()}</div>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Prescription;
