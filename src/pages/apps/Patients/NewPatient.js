import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { IoPrintSharp } from 'react-icons/io5';
import { LiaReceiptSolid } from 'react-icons/lia';
import { TbHeartRateMonitor } from 'react-icons/tb';
import PatientDetails from './PatientDetails';
import Demographics from './Demographics';
import Insurances from './Insurances';
import VitalStatus from './VitalStatus';
import profileDummy from '../../../assets/images/profileDummy.png'
import CloseIcon from "../../../assets/images/Icon.png"
const NewPatient = () => {
    const navigate = useNavigate();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('Patient Details');
    const [isClinicalReviewExpanded, setIsClinicalReviewExpanded] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleClinicalReviewToggle = () => {
        setIsClinicalReviewExpanded(!isClinicalReviewExpanded);
    };
    const [isClinicalReviewExpandedData, setIsClinicalReviewExpandedData] = useState(false);

    const handleToggle = () => {
        setIsClinicalReviewExpandedData(!isClinicalReviewExpandedData);
    };
    const patientMenuItems = [
        'Demographic',
        'Appointments',
        'Clinical Dashboard',
        'Documents',
        {
            label: 'Clinical Review',
            subItems: [
                'Problem List',
                'Allergy List',
                'Drug Medication',
                'Medication List',
                'Drug Interactions',
                'Care Quality Indicators (CQIs)',
            ],
        },
        'Intake Data',
        'Lab Orders',
        'Immunizations',
        'Patient Cost Estimator',
        'Growth Charts',
        'Onpatient Access',
        'Education Resources',
        'Communication',
        'Family History',
        'Imaging Orders',
        'Implantable Devices',
    ];

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid px-0 mt-2">
                <div className="row">
                    {/* Main Content */}
                    <div className={isSidebarCollapsed ? 'col-11' : 'col-10'}>
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
                                        <div className='mt-1 d-flex gap-2 ps-3'>
                                            <IoPrintSharp className='fs-3' />
                                            <LiaReceiptSolid className='fs-3 text-black' />
                                            <TbHeartRateMonitor className='fs-3' />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <Row className='pt-1'>
                                            <div className='d-flex gap-2 ps-1'>
                                                <p style={{ borderRight: '1px solid black' }} className='pe-2 text-nowrap fs-6'>
                                                    <span className='fw-bold' style={{ color: 'rgb(249, 139, 55)' }}>Jane Cooper</span> <span className='fs-6'>Male</span>
                                                </p>
                                                <p style={{ borderRight: '1px solid black' }} className='pe-2 text-nowrap fs-6'>
                                                    <span>Sep 10,1971</span>
                                                </p>
                                                <p className='text-nowrap fs-6'>
                                                    <span>55 years old</span>
                                                </p>
                                            </div>
                                            <Col sm={6} className='p-0'>
                                                <div className='row'>
                                                    <div className='col-12 mx-1 mt-1'>
                                                        <div className='row'>
                                                            <div className='col-3'>
                                                            <span className='fw-bold fs-6'>Patients ID:</span>
                                                            </div>
                                                            <div className='col-9'>
                                                            <span className='ps-2 text-primary fs-6'>2322BDEW</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 mt-1'>
                                                        <div className='row'>
                                                            <div className='col-3'>
                                                            <span className='fw-bold fs-6'>Phone:</span>
                                                            </div>
                                                            <div className='col-9'>
                                                            <span className='ps-2 fs-6'>9887363532</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 mt-1'>
                                                        <div className='row'>
                                                            <div className='col-3'>
                                                            <span className='fw-bold fs-6'>Email:</span>
                                                            </div>
                                                            <div className='col-9'>
                                                            <span className='ps-2 fs-6'>alma.lawson@example.com</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 mt-1'>
                                                        <div className='row'>
                                                            <div className='col-3'>
                                                            <span className='fw-bold fs-6'>Address:</span>
                                                            </div>
                                                            <div className='col-9'>
                                                            <span className='ps-2 fs-6'>2972 Westheimer Rd. Santa Ana, Illinois 85486</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                  
                                                    {/* <p className='fs-6 m-1'>
                                                        <span className='fw-bold'>Patients Chart ID:</span><span className='ps-2 text-primary'>2322BDEW</span>
                                                    </p> */}
                                                    {/* <p className='fs-6 m-1'>
                                                        <span className='fw-bold'>Phone:</span>
                                                        <span className='ps-2'>9887363532</span>
                                                    </p>
                                                    <p className='fs-6 m-1'>
                                                        <span className='fw-bold'>Email:</span><span className='ps-2'>alma.lawson@example.com</span>
                                                    </p>
                                                    <p className='fs-6 m-1'>
                                                        <span className='fw-bold'>Address:</span><span className='ps-2'>2972 Westheimer Rd. Santa Ana, Illinois 85486</span>
                                                    </p> */}
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                            <div className='row'>
                                                    <div className='col-12 mx-1 mt-1'>
                                                        <div className='row'>
                                                            <div className='col-5'>
                                                            <span className='fw-bold fs-6'>Primary Provider:</span>
                                                            </div>
                                                            <div className='col-7'>
                                                            <span className='ps-2 text-primary fs-6'>Nishchay Sharma</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 mt-1'>
                                                        <div className='row'>
                                                            <div className='col-5'>
                                                            <span className='fw-bold fs-6'>Date Added:</span>
                                                            </div>
                                                            <div className='col-7'>
                                                            <span className='ps-2 fs-6'>01/11/2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 mt-1'>
                                                        <div className='row'>
                                                            <div className='col-5'>
                                                            <span className='fw-bold fs-6'>Last Scheduled appt:</span>
                                                            </div>
                                                            <div className='col-7'>
                                                            <span className='ps-2 fs-6'>01/01/2025</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 mt-1'>
                                                        <div className='row'>
                                                            <div className='col-5'>
                                                            <span className='fw-bold fs-6'>Next Scheduled appt:</span>
                                                            </div>
                                                            <div className='col-7'>
                                                            <span className='ps-2 fs-6'>None</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col sm={2} className='d-flex justify-content-end pe-3'>
                                        <div className='text-center'>
                                            <Button
                                                className='text-black text-nowrap bg-white fs-6 d-flex align-items-center justify-content-center w-100'
                                                style={{ height: '30px' }}
                                            >
                                                New Appointment
                                            </Button>
                                            <Button className='text-black text-nowrap bg-white mt-1 fs-6 d-flex align-items-center justify-content-center w-100' style={{ height: '30px' }}>
                                                New Referral
                                            </Button>
                                            <Button className='text-black text-nowrap bg-white mt-1 fs-6 d-flex align-items-center justify-content-center w-100' style={{ height: '30px' }}>
                                                Start Session
                                            </Button>
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
                                            'Payment'
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
                                    {activeTab === 'Insurances' && <Insurances />}
                                    {activeTab === 'Eligibility' && <p>In Progress...</p>}
                                    {activeTab === 'Authorizations' && <p>In Progress...</p>}
                                    {activeTab === 'Vital Status' && <VitalStatus />}
                                    {activeTab === 'Balance' && <p>In Progress...</p>}
                                    {activeTab === 'Payment' && <p>In Progress...</p>}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className={isSidebarCollapsed ? 'col-1' : 'col-2'}>
                        <div
                            className="patient-menu-container bg-white mt-0"
                            style={{
                                border: '1px solid #ced4da',
                                borderRadius: '10px',
                            }}
                        >
                            <div
                                className="card m-0 overflow-hidden"
                                style={{ borderRadius: '10px' }}
                            >
                                <div
                                    className="card-header d-flex justify-content-between align-items-center text-white px-2 py-1"
                                    style={{ backgroundColor: '#444141' }}
                                >
                                    <button
                                        className="btn p-0 shadow-none outline-none"
                                        onClick={handleSidebarToggle}
                                    >
                                        <i
                                            className="bi bi-list text-white"
                                            style={{ fontSize: '25px' }}
                                        ></i>
                                        {/* <img src={CloseIcon} alt='' style={{ width: "30%", height: "30%", objectFit: "contain" }} /> */}

                                    </button>
                                    {!isSidebarCollapsed && <h4 className="m-0">Patient Chart</h4>}
                                    <button
                                        className="btn p-0 shadow-none outline-none"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#patientChartData"
                                        aria-expanded={isClinicalReviewExpandedData}
                                        aria-controls="patientChartData"
                                        onClick={handleToggle}
                                    >
                                        <i
                                            className={`bi ${isClinicalReviewExpandedData ? 'bi-chevron-up' : 'bi-chevron-down'
                                                }`}
                                            style={{ fontSize: '20px', color: "white" }}
                                        ></i>
                                    </button>
                                </div>
                                <div id="patientChartData" className="collapse">
                                    <div className="card-body p-0">
                                        {patientMenuItems.map((item, index) => (
                                            typeof item === 'string' ? (
                                                <p
                                                    key={index}
                                                    className="patient-menu-item text-black mb-0 ps-2 py-1"
                                                    onClick={() => handleTabClick(item)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        backgroundColor:
                                                            activeTab === item ? '#f8f9fa' : 'transparent',
                                                        fontWeight: activeTab === item ? 'bold' : 'normal',
                                                    }}
                                                >
                                                    {item}
                                                </p>
                                            ) : (
                                                <div key={index}>
                                                    <p
                                                        className="patient-menu-item text-black mb-0 px-2 border-bottom py-1 d-flex justify-content-between align-items-center"
                                                        onClick={handleClinicalReviewToggle}
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor:
                                                                isClinicalReviewExpanded ? '#f8f9fa' : 'transparent',
                                                            fontWeight: isClinicalReviewExpanded ? 'normal' : 'normal',
                                                        }}
                                                    >
                                                        {item.label}
                                                        <i
                                                            className={`bi ${isClinicalReviewExpanded
                                                                ? 'bi-chevron-up'
                                                                : 'bi-chevron-down'
                                                                }`}
                                                        ></i>
                                                    </p>
                                                    {isClinicalReviewExpanded && (
                                                        <div className="ms-0">
                                                            {item.subItems.map((subItem, subIndex) => (
                                                                <p
                                                                    key={subIndex}
                                                                    className="text-black  mb-0 ps-4 border-bottom py-1"
                                                                    onClick={() => handleTabClick(subItem)}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        backgroundColor:
                                                                            activeTab === subItem ? '#e9ecef' : 'transparent',
                                                                        fontWeight: activeTab === subItem ? 'bold' : 'normal',
                                                                    }}
                                                                >
                                                                    {subItem}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPatient;
