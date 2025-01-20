import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FormInput } from '../../../components';
import profileDummy from '../../../assets/images/profileDummy.png'
import { IoPrintSharp } from "react-icons/io5";
import PatientDetails from './PatientDetails';
import Demographics from './Demographics';
import { TbHeartRateMonitor } from "react-icons/tb";
import { LiaReceiptSolid } from "react-icons/lia";

const NewPatient = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Patient Details');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="background_Color pt-1 pb-2">
            <div className='container-fluid px-0 mt-2'>
                <div className='row'>
                    <div className='col-10'>
                        <Card
                            className='mb-1'
                            style={{
                                background: '#E6EBFF',
                                width: 'auto',
                                border: '1px solid #a4c5d5'
                            }}>
                            <Card.Body className="p-1">
                                <Row>
                                    <Col sm={2} className='ps-3 pt-2'>
                                        <div>
                                            <img
                                                src={profileDummy}
                                                alt="Patient Profile"
                                                className="img-fluid rounded"
                                                style={{ width: '136px', height: '139px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className='mt-1 d-flex gap-2 ps-2 '>
                                            <IoPrintSharp className='fs-3' />
                                            <LiaReceiptSolid className='fs-3 text-black' />
                                            <TbHeartRateMonitor className='fs-3' />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <Row className='pt-1'>
                                            <div className='d-flex gap-2 ps-1'>
                                                <p style={{ borderRight: '1px solid black' }} className='pe-2 text-nowrap fs-6'><span className='text-success fw-bold'>Jane Cooper</span> <span className='fs-6'>Male</span></p>
                                                <p style={{ borderRight: '1px solid black' }} className='pe-2 text-nowrap fs-6'><span>55 years old</span></p>
                                                <p className='text-nowrap fs-6'><span>Sep 10,1971</span></p>
                                            </div>
                                            <Col sm={6} className='p-0'>
                                                <div>
                                                    <p className='fs-6 m-1'>Patients Chart ID:<span className='ps-2 text-primary'>2322BDEW</span></p>
                                                    <p className='fs-6 m-1'>Phone:<span className='ps-2'>9887363532</span></p>
                                                    <p className='fs-6 m-1'>Email:<span className='ps-2'>alma.lawson@example.com</span></p>
                                                    <p className='fs-6 m-1'>Address:<span className='ps-2'>2972 Westheimer Rd. Santa Ana, Illinois 85486 </span></p>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div>
                                                    <p className='fs-6 m-1'>Primary Provider:<span className='ps-2'>Nishchay Sharma</span></p>
                                                    <p className='fs-6 m-1'>Date Added:<span className='ps-2'>01/11/2024</span></p>
                                                    <p className='fs-6 m-1'>Last Scheduled appt:<span className='ps-2 text-primary'>01/01/2025</span></p>
                                                    <p className='fs-6 m-1'>Next Scheduled appt:<span className='ps-2'>None</span></p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col sm={2} className='d-flex justify-content-center'>
                                        <div className='text-center'>
                                            <Button className='text-black text-nowrap bg-white' style={{ width: '90%', fontSize: '12px', height: '30px' }}>New Appointment</Button>
                                            <Button className='text-black text-nowrap bg-white mt-2' style={{ width: '90%', fontSize: '12px', height: '30px' }}>New Referral</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <div className=' mt-2'>
                            <Card className='px-2'>
                                <div>
                                    <ul className="nav nav-underline">
                                        {[
                                            'Patient Details',
                                            'Demographics',
                                            'Insurances',
                                            'Eligibility',
                                            'Authorizations',
                                            'Vital Status',
                                            'Balance',
                                            'Drchrono Payment'
                                        ].map((tab) => (
                                            <li className="nav-item" key={tab}>
                                                <a
                                                    className={`nav-link fw-medium  text-black ${activeTab === tab ? 'active' : ''}`}
                                                    onClick={() => handleTabClick(tab)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {tab}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-2">
                                    {activeTab === 'Patient Details' && <PatientDetails />}
                                    {activeTab === 'Demographics' && <Demographics />}
                                    {activeTab === 'Insurances' && <p>Insurances Content</p>}
                                    {activeTab === 'Eligibility' && <p>Eligibility Content</p>}
                                    {activeTab === 'Authorizations' && <p>Authorizations Content</p>}
                                    {activeTab === 'Vital Status' && <p>Vital Status Content</p>}
                                    {activeTab === 'Balance' && <p>Balance Content</p>}
                                    {activeTab === 'Drchrono Payment' && <p>Drchrono Payment Content</p>}
                                </div>

                                {/* <div className='d-flex gap-1 justify-content-end mb-2'>
                                <Button className=''>Cancel</Button>
                                <Button className='custom-buttons'>Save</Button>
                            </div> */}
                            </Card>
                        </div>
                    </div>
                    <div className='col-2'>
                        {/* <div style={{ height: '30px' }}> */}
                        <FormInput type="text" placeholder="Search..." />
                        {/* </div> */}
                        <div className='d-flex justify-content-center mt-2'>
                            <Button className="custom-buttons text-nowrap w-100" style={{ height: '30px' }}>
                                Add New Patient
                            </Button>
                        </div>
                        <div>
                            <div className="patient-menu-container rounded bg-white mt-2" style={{ border: '1px solid #ced4da' }}>
                                {[
                                    "Demographic", "Appointments", "Clinical Dashboard", "Documents", "Problem list",
                                    "Medication list", "Allergy list", "Drug Interactions", "CQMs", "Intake Data",
                                    "Lab Orders", "Immunizations", "Patient Cost Estimator", "Growth Charts",
                                    "Onpatient Access", "Education Resources", "Communication", "Family History",
                                    "Imaging orders", "Implantable devices"
                                ].map((item, index) => (
                                    <p key={index} className="patient-menu-item text-black mb-0 ps-2 py-1">
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default NewPatient;
