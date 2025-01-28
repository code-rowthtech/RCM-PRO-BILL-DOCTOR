import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { HiOutlinePrinter } from "react-icons/hi2";
import { LiaReceiptSolid } from 'react-icons/lia';
import { TbHeartRateMonitor } from 'react-icons/tb';
import PatientDetails from './PatientDetails';
import Demographics from './Demographics';
import Insurances from './Insurances';
import VitalStatus from './VitalStatus';
import profileDummy from '../../../assets/images/profileDummy.png'
import CloseIcon from "../../../assets/images/Icon.png"
import { MdPhone } from "react-icons/md";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { BiSolidLocationPlus } from "react-icons/bi";
import { getPatientsByIdAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';


const NewPatient = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('Patient Details');
    const [isClinicalReviewExpanded, setIsClinicalReviewExpanded] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const primaryProvider = JSON.parse(sessionStorage.getItem('hyper_user'))?.firstName;
    const store = useSelector((state) => state);
    const patientsDataById = store?.getPatientsByIdReducer?.data?.patient || [];
    console.log(patientsDataById, 'patientsDataByIdpatientsDataById')

    useEffect(() => {
        const data = {
            id: id,
        }
        // console.log(data, 'dataaa123456789')
        dispatch(getPatientsByIdAction({ key: encryptMessage(data) }));
    }, [dispatch]);

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
        { label: "Demographic", icon: "bi bi-person" },
        { label: "Appointments", icon: "bi bi-person" },
        { label: "Clinical Dashboard", icon: "bi bi-person" },
        { label: "Documents", icon: "bi bi-person" },
        {
            label: 'Clinical Review',
            icon: "bi bi-person",
            subItems: [
                { label: 'Problem List', icon: 'bi bi-person' },
                { label: 'Allergy List', icon: 'bi bi-person' },
                { label: 'Drug Medication', icon: 'bi bi-person' },
                { label: 'Medication List', icon: 'bi bi-person' },
                { label: 'Drug Interactions', icon: 'bi bi-person' },
                { label: 'Care Quality Indicators (CQIs)', icon: 'bi bi-person' },
            ],
        },
        { label: 'Intake Data', icon: 'bi bi-person' },
        { label: 'Lab Orders', icon: 'bi bi-person' },
        { label: 'Immunizations', icon: 'bi bi-person' },
        { label: 'Patient Cost Estimator', icon: 'bi bi-person' },
        { label: 'Growth Charts', icon: 'bi bi-person' },
        { label: 'Onpatient Access', icon: 'bi bi-person' },
        { label: 'Education Resources', icon: 'bi bi-person' },
        { label: 'Communication', icon: 'bi bi-person' },
        { label: 'Family History', icon: 'bi bi-person' },
        { label: 'Imaging Orders', icon: 'bi bi-person' },
        { label: 'Implantable Devices', icon: 'bi bi-person' },
    ];

    const toggleTimer = () => {
        if (!isRunning) {
            // Start or Resume Timer
            if (timeLeft === 0) {
                setTimeLeft(30 * 60); // Set to 30 minutes if starting fresh
            }
        }
        setIsRunning((prevIsRunning) => !prevIsRunning); // Toggle running state
    };

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (!isRunning || timeLeft === 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    // Function to format seconds into MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="background_Color  pb-2">
            <div className="container-fluid px-0 mt-0 pt-0">
                <div className="row">
                    {/* Main Content */}
                    <div className={isSidebarCollapsed ? 'col-11' : 'col-10'}>
                        <div
                            className='mb-1'
                            style={{
                                background: 'transparent',
                                width: 'auto',
                                // border: '1px solid #a4c5d5',
                                bordertop: '0px!important',
                                boxShadow: 0
                            }}>
                            <div className="p-1">
                                <Row>
                                    <Col sm={2} className='ps-2 pt-1'>
                                        <div>
                                            <img
                                                src={patientsDataById?.patientChartPhoto?.url || profileDummy}
                                                alt="Patient Profile"
                                                className="img-fluid rounded"
                                                style={{ width: '126px', height: '129px', objectFit: 'cover' }}
                                            />
                                        </div>

                                    </Col>

                                    <Col sm={8}>
                                        <Row className='pt-1'>
                                            <div className='d-flex gap-2 ps-1'>
                                                <p style={{ borderRight: '1px solid black' }} className='pe-2 text-nowrap fs-6'>
                                                    <span className='fw-bold text-capitalize' style={{ color: 'rgb(249, 139, 55)' }}>{patientsDataById?.firstName || 'N/A'} {patientsDataById?.middleName || ' '} {patientsDataById?.lastName || ' '}</span> <span className='fs-6 fw-bold'>Male</span>
                                                </p>
                                                <p style={{ borderRight: '1px solid black' }} className='pe-2 text-nowrap fw-bold fs-6'>
                                                    <span>{patientsDataById?.dob || 'N/A'}</span>
                                                </p>
                                                <p className='text-nowrap fs-6 fw-bold'>
                                                    <span>{patientsDataById?.yearsOld || 'N/A'}</span>
                                                </p>
                                            </div>
                                            <Col sm={6} className='p-0'>
                                                <div className='row'>
                                                    <div className='col-12 mx-1 '>
                                                        <div className='row'>
                                                            <div className='col-3'>
                                                                <span className='fw-bold fs-6'>Patients ID:</span>
                                                            </div>
                                                            <div className='col-9'>
                                                                <span className='ps-2 text-primary fs-6' style={{ fontWeight: 600 }}>{patientsDataById?.chartNumber}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 '>
                                                        <div className='row'>
                                                            <div className='col-3'>
                                                                <span><MdPhone className='fs-5 text-primary' /></span>
                                                            </div>
                                                            <div className='col-9'>
                                                                <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>{patientsDataById?.cellPhone}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 '>
                                                        <div className='row'>
                                                            <div className='col-3'>
                                                                <span ><MdOutlineMarkEmailUnread className='fs-5 text-primary' /></span>
                                                            </div>
                                                            <div className='col-9'>
                                                                <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>{patientsDataById?.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 '>
                                                        <div className='row'>
                                                            <div className='col-3'>
                                                                <span ><BiSolidLocationPlus className='fs-5 text-primary' /></span>
                                                            </div>
                                                            <div className='col-9'>
                                                                <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>{patientsDataById?.address || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className='row'>
                                                    <div className='col-12 mx-1 '>
                                                        <div className='row'>
                                                            <div className='col-5'>
                                                                <span className='fw-bold fs-6'>Primary Provider:</span>
                                                            </div>
                                                            <div className='col-7'>
                                                                <span className='ps-2 text-primary fs-6' style={{ fontWeight: 600 }}>{primaryProvider}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 '>
                                                        <div className='row'>
                                                            <div className='col-5'>
                                                                <span className='fw-bold fs-6'>Date Added:</span>
                                                            </div>
                                                            <div className='col-7'>
                                                                <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>
                                                                    {patientsDataById?.createdAt
                                                                        ? new Date(patientsDataById.createdAt).toLocaleDateString('en-GB')
                                                                        : 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 '>
                                                        <div className='row'>
                                                            <div className='col-5'>
                                                                <span className='fw-bold fs-6'>Last Appointment Date:</span>
                                                            </div>
                                                            <div className='col-7'>
                                                                <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>{patientsDataById?.lastApptDate || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12 mx-1 '>
                                                        <div className='row'>
                                                            <div className='col-5'>
                                                                <span className='fw-bold fs-6'>Next Appointment Date:</span>
                                                            </div>
                                                            <div className='col-7'>
                                                                <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>{patientsDataById?.nextApptDate || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col sm={2} className='d-flex justify-content-end pe-3'>
                                        <div className='text-center'>

                                            {/* <Button className='text-black text-nowrap bg-white mt-1 fs-6 d-flex align-items-center justify-content-center w-100' style={{ height: '30px' }}>
                                                New Referral
                                            </Button> */}
                                            <Button
                                                className="text-black text-nowrap bg-white fs-6 d-flex align-items-center justify-content-center w-100"
                                                style={{ height: '30px', borderRadius: "10px" }}
                                                onClick={toggleTimer} // Toggle the timer
                                            >
                                                {isRunning
                                                    ? `Pause (${formatTime(timeLeft)})`
                                                    : timeLeft > 0
                                                        ? `Resume (${formatTime(timeLeft)})`
                                                        : 'Start Session'}
                                            </Button>

                                            <Button
                                                className='text-black text-nowrap bg-white mt-1 fs-6 d-flex align-items-center justify-content-center w-100'
                                                style={{ height: '30px', borderRadius: "10px" }}
                                                as={Link} to={'/apps/appointments/newAppointment'}
                                            >
                                                Add Appointment
                                            </Button>
                                            <div className='mt-2 d-flex gap-2  justify-content-end'>
                                                <HiOutlinePrinter className='fs-3 text-black' />
                                                <LiaReceiptSolid className='fs-3 text-black' />
                                                {/* <TbHeartRateMonitor className='fs-3' /> */}
                                            </div>
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                        </div>

                        <div className=' mt-2 '>
                            <Card className='px-2'>
                                <div className='d-flex justify-content-between pt-1'>
                                    <div style={{ borderBottom: '2px solid grey' }}>
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
                                                <li className="nav-item " key={tab}>
                                                    <a
                                                        className={`nav-link ms-3 pb-0 tab-font-family ${activeTab === tab ? 'active text-primary' : 'text-black'}`}
                                                        onClick={() => handleTabClick(tab)}
                                                        style={{ cursor: 'pointer', fontWeight: 600 }}
                                                    >
                                                        {tab}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className=''>
                                        <Button className="custom-buttons" onClick={() => navigate(-1)}>Back</Button>
                                    </div>
                                </div>

                                <div className="mt-2 px-2 scroll-container" style={{ height: '65vh', overflow: 'auto' }}>
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
                    <div className={isSidebarCollapsed ? 'col-1 ' : 'col-2'}>
                        <div
                            className="patient-menu-container bg-white mt-0"
                            style={{
                                border: '1px solid #ced4da',
                                borderRadius: '10px',
                            }}
                        >
                            <div
                                className="card m-0 overflow-hidden"
                                style={{ borderRadius: '5px' }}
                            >
                                <div
                                    className="card-header d-flex justify-content-between align-items-center text-white px-2 py-1"
                                    style={{ backgroundColor: '#313A46' }}
                                >
                                    <button
                                        className="btn p-0 shadow-none outline-none"
                                        onClick={handleSidebarToggle}
                                    >
                                        <i
                                            className="bi bi-list text-white"
                                            style={{ fontSize: '18px' }}
                                        ></i>
                                        {/* <img src={CloseIcon} alt='' style={{ width: "30%", height: "30%", objectFit: "contain" }} /> */}

                                    </button>
                                    {!isSidebarCollapsed && <h5 className="m-0">Patient Chart</h5>}
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
                                            style={{ fontSize: '14px', color: "white" }}
                                        ></i>
                                    </button>
                                </div>
                                <div id="patientChartData" className="collapse">
                                    <div className="card-body p-0 scroll-container" style={{ height: '83vh', overflow: 'auto' }}>
                                        {patientMenuItems.map((item, index) => (
                                            item.subItems ? (
                                                <div key={index} className='ms-0'>
                                                    <p
                                                        className={`patient-menu-item text-black mb-0 ps-2 pe-2 border-bottom py-1 ${isSidebarCollapsed ? 'text-center fw-bold' : 'd-flex justify-content-between align-items-center'}`}
                                                        onClick={handleClinicalReviewToggle}
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: isClinicalReviewExpanded ? '#f8f9fa' : 'transparent',
                                                        }}
                                                    >
                                                        <span className='text-center'>
                                                            <i className={`${item.icon}`}></i>
                                                            <span className={`${isSidebarCollapsed ? 'd-none' : ''}`}>
                                                                {" " + item.label}
                                                            </span>
                                                        </span>
                                                        <i
                                                            className={`bi ${isClinicalReviewExpanded
                                                                ? 'bi-chevron-up'
                                                                : 'bi-chevron-down'
                                                                }
                                                           ${isSidebarCollapsed ? 'd-none' : ''}     
                                                                `}
                                                        ></i>
                                                    </p>
                                                    {isClinicalReviewExpanded && (
                                                        <div className="ms-0">
                                                            {item.subItems.map((subItem, subIndex) => (
                                                                <p
                                                                    key={subIndex}
                                                                    className="text-black mb-0 ps-4 border-bottom py-1"
                                                                    onClick={() => handleTabClick(subItem.label)}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        backgroundColor:
                                                                            activeTab === subItem.label ? '#e9ecef' : 'transparent',
                                                                        fontWeight: activeTab === subItem.label ? 'bold' : 'normal',
                                                                    }}
                                                                >
                                                                    {subItem.label}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p
                                                    key={index}
                                                    className={`patient-menu-item text-black mb-0 ps-2 py-1 ${isSidebarCollapsed ? 'text-center fw-bold' : ''}`}
                                                    onClick={() => handleTabClick(item.label)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: activeTab === item.label ? '#f8f9fa' : 'transparent',
                                                        fontWeight: activeTab === item.label ? 'bold' : 'normal',
                                                    }}
                                                >
                                                    <i className={`${item.icon}`}></i> <span className={`${isSidebarCollapsed ? 'd-none' : ''}`}>{item.label}</span>
                                                </p>
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
