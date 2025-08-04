import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { HiOutlinePrinter } from 'react-icons/hi2';
import { LiaReceiptSolid } from 'react-icons/lia';
import { TbHeartRateMonitor } from 'react-icons/tb';
import PatientDetails from './PatientDetails';
import Demographics from './Demographics';
import Insurances from './Insurances';
import VitalStatus from './VitalStatus';
import profileDummy from '../../../assets/images/profileDummy.png';
import { MdPhone } from 'react-icons/md';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import { BiEdit, BiSolidLocationPlus } from 'react-icons/bi';
import { getPatientsByIdAction, resetUpdateAction, updatePatientsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentForm from '../Appointments/Tabs/AppointmentForm';
import { TbCapture } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { MdMedicalInformation } from 'react-icons/md';
import { MdOutlinePreview } from 'react-icons/md';
import { LuCalendarClock } from 'react-icons/lu';
import { AiOutlineInteraction } from 'react-icons/ai';
import { FaUserDoctor } from 'react-icons/fa6';
import { TbReportSearch } from 'react-icons/tb';
import { TbVaccine } from 'react-icons/tb';
import { SiPrivateinternetaccess } from 'react-icons/si';
import { GrContact } from 'react-icons/gr';
import { TbHistory } from 'react-icons/tb';
import { RiImageEditFill } from 'react-icons/ri';
import { GiGrowth } from 'react-icons/gi';
import { MdCorporateFare } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import Spinner from '../../../constants/Spinner';
import { handleUpload } from '../../../helpers/HandleUpload';
import AssignTask from './TaskTabs/AssignTask';
import AddAsignTask from './TaskTabs/AddAsignTask';
import ProblemList from './TaskTabs/ProblemList';
import AllergyList from './TaskTabs/AllergyList';
import FilterDropdown from './FilterDropdown';
import Drug from './DrugIntraction/Drug';
import CQIs from './CQIs/CQIs';
import AppointmentList from './AppointmentsListShow/Appointment';
import LabRequest from './LabRequest/LabRequest';
import ResponsibleParty from './ResponsibleParty';
import RefferingDoctor from './RefferingDoctor';
import { FaRegCopy } from 'react-icons/fa';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const NewPatient = () => {
    const dispatch = useDispatch();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState('Appointments');
    const {
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [isClinicalReviewExpanded, setIsClinicalReviewExpanded] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const primaryProvider = JSON.parse(sessionStorage.getItem('hyper_user'))?.name?.text;
    const store = useSelector((state) => state);
    const patientsDataById = store?.getPatientsByIdReducer?.data?.data || [];
    const updateSuccess = store?.updatePatientsReducer?.data?.status;
    const [profilePhoto, setProfilePhoto] = useState(profileDummy);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [selectedMainTab, setSelectedMainTab] = useState('Patient Info');
    const [selectedSubTab, setSelectedSubTab] = useState('Assign Task');
    const [visibleSection, setVisibleSection] = useState('patient'); // Default section
    const [encounterTab, setEncounterTab] = useState('encounter');
    const [encounterModal, setEncounterModal] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const workingTabs = ['Patient Info', 'Demographics', 'ResponsibleParty', 'RefferingDoctor'];
    const activePatientChartItems = ['Patient Info', 'Appointments'];

    useEffect(() => {
        const data = {
            id: id,
        };
        if (id) {
            dispatch(getPatientsByIdAction(data));
        }
    }, [id]);

    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(getPatientsByIdAction({ id }));
            dispatch(resetUpdateAction());
            setLogo(null);
            setLogoName('');
            setIsCameraOpen(false);
            setSelectedMainTab('Demographics');
        }
    }, [updateSuccess, id, dispatch]); // Ensure dependencies are correctly set

    const handleMainTabChange = (tab) => {
        setSelectedMainTab(tab);
        setVisibleSection('patient'); // Show Patient Section, Hide Task Section
    };

    const handleSubTabChange = (subTab) => {
        setSelectedSubTab(subTab);
        setVisibleSection('task'); // Show Task Section, Hide Patient Section
    };

    const handleEncounterTabs = () => {
        setEncounterModal(true);
    };
    const handleSidebarToggle = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleTabClick = (tab) => {
        setSelectedSubTab(tab);
    };
    const tabMappings = {
        'Patient Info': { mainTab: 'Patient Info', section: 'patient' },
        Appointments: { mainTab: 'Appointments', section: 'appointments' },
        // Encounter: { mainTab: 'Encounter', section: 'encounter' },
        'Drug Interactions': { mainTab: 'Drug Interactions', section: 'drug' },
        CQIs: { mainTab: 'CQIs', section: 'CQIs' },
        'Lab Request': { mainTab: 'Lab Request', section: 'Lab Request' },
    };

    const handleChartTabChange = (tab) => {
        const mapping = tabMappings[tab];
        if (mapping) {
            setSelectedMainTab(mapping.mainTab);
            setVisibleSection(mapping.section);
        }
    };

    const handleClinicalReviewToggle = () => {
        setIsClinicalReviewExpanded(!isClinicalReviewExpanded);
        setVisibleSection('task');
    };
    const [isClinicalReviewExpandedData, setIsClinicalReviewExpandedData] = useState(false);

    const patientMenuItems = [
        { label: 'Patient Info', icon: <MdMedicalInformation /> },
        { label: 'Appointments', icon: <LuCalendarClock /> },
        {
            label: 'Clinical Review',
            icon: <MdOutlinePreview />,
            subItems: [
                { label: 'Assign Task', icon: <FiPlus /> },
                { label: 'Problem List', icon: <FiPlus /> },
                { label: 'Allergy List', icon: <FiPlus /> },
                // { label: 'Drug Medication', icon: <FiPlus /> },
                { label: 'Medication List', icon: <FiPlus /> },
            ],
        },
        { label: 'Drug Interactions', icon: <AiOutlineInteraction /> },
        { label: 'CQIs', icon: <FaUserDoctor /> },
        { label: 'Lab Request', icon: <TbReportSearch /> },
        { label: 'Vaccinations', icon: <TbVaccine /> },
        { label: 'Patient Access', icon: <SiPrivateinternetaccess /> },
        { label: 'Patient Communication', icon: <GrContact /> },
        { label: 'Genetic History', icon: <TbHistory /> },
        { label: 'Imaging Requests', icon: <RiImageEditFill /> },
        { label: 'Growth Tracker', icon: <GiGrowth /> },
        { label: 'Estimates', icon: <MdCorporateFare /> },
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

    const modalTabs = [
        'Appointments',
        // 'Encounter',
        'Billing',
        'Eligibility',
        'Vitals',
        'Growthcharts',
        'Log Comm.',
        'Revisions',
        'Mu Helper',
    ];

    const handleModalTabClick = (modalTabs) => {
        setActiveModalTab(modalTabs);
    };

    const openCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }, // Open front camera
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const [uploading, setUploading] = useState(false);
    const capturePhoto = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas image to Blob
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], `profile-photo-${Date.now()}.png`, { type: 'image/png' });

                    try {
                        const url = await handleUpload(file, setUploading);
                        setLogo(url);
                        setLogoName(file?.name);
                    } catch (error) {
                        console.error('Error uploading photo:', error);
                    }
                }
            }, 'image/png');

            stopCamera();
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setIsCameraOpen(false);
    };
    const onSubmit = (data) => {
        const payload = {
            id: id,
            ...(logo?.url === null
                ? {}
                : {
                    photo: {
                        url: logo?.url?.split('?')[0] || patientsDataById?.patientChartPhoto?.url,
                        title: logoName,
                    },
                }),
        };
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };

    return (
        <>
            <div className="background_Color  pb-2">
                <div className="container-fluid px-0 mt-2 pt-0">
                    <div className="row">
                        {/* Main Content */}
                        <div className={isSidebarCollapsed ? 'col-11 px-0' : 'col-10 px-0'}>
                            <div class="accordion border-none custom-shadow rounded-1" id="accordionExample">
                                <div class="accordion-item collapsed border-0">
                                    <h2 class="accordion-header mt-0">
                                        <button
                                            className="accordion-button collapsed py-1 bg-white"
                                            style={{ border: '#000', height: '43px' }}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-expanded={isOpen}
                                            aria-controls="collapseOne"
                                            onClick={() => setIsOpen(!isOpen)} // Toggle state on click
                                        >
                                            <div className="d-flex gap-2 ps-1 pt-2">
                                                <p
                                                    style={{ borderRight: '1px solid black' }}
                                                    className="pe-2 text-nowrap fs-6">
                                                    <span
                                                        className="fw-bold text-capitalize"
                                                        style={{ color: 'rgb(249, 139, 55)' }}>
                                                        {patientsDataById?.name?.[0]?.text || 'N/A'}
                                                    </span>
                                                </p>
                                                <p
                                                    style={{ borderRight: '1px solid black' }}
                                                    className="pe-2 text-nowrap fs-6">
                                                    <span className="fs-6 fw-bold text-capitalize">
                                                        {patientsDataById?.gender || ' '}
                                                    </span>
                                                </p>
                                                <p
                                                    style={{ borderRight: '1px solid black' }}
                                                    className="pe-2 text-nowrap fw-bold fs-6">
                                                    <span>
                                                        {patientsDataById?.birthDate
                                                            ? new Date(patientsDataById.birthDate).toLocaleDateString(
                                                                'en-GB'
                                                            )
                                                            : 'N/A'}
                                                    </span>
                                                </p>
                                                <p
                                                    className="text-nowrap fs-6 fw-bold pe-2"
                                                    style={{ borderRight: '1px solid black' }}>
                                                    <span>
                                                        {patientsDataById?.approxAge != null
                                                            ? patientsDataById.approxAge + ' years old'
                                                            : '-'}
                                                    </span>
                                                </p>
                                                <p className="text-nowrap fs-6 fw-bold">
                                                    <span>{patientsDataById?.telecom?.[3]?.value || 'N/A'}</span>
                                                </p>
                                            </div>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseOne"
                                        class="accordion-collapse collapse "
                                        data-bs-parent="#accordionExample">
                                        <div
                                            class="accordion-body  p-0 bg-white pb-1"
                                            style={{ borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                                            <div className="p-1">
                                                <Row>
                                                    <Col sm={2} className="ps-0 pt-1">
                                                        <Form
                                                            onSubmit={handleSubmit(onSubmit)}
                                                            className="d-flex flex-column align-items-center">
                                                            <div
                                                                className="position-relative d-flex align-items-center flex-column justify-content-center"
                                                                style={{ display: 'inline-block' }}>
                                                                {isCameraOpen ? (
                                                                    <video
                                                                        ref={videoRef}
                                                                        autoPlay
                                                                        playsInline
                                                                        className="rounded"
                                                                        style={{
                                                                            width: '105px',
                                                                            height: '100px',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                ) : uploading ? (
                                                                    <div className="py-3">
                                                                        <Spinner />
                                                                    </div>
                                                                ) : (
                                                                    <img
                                                                        src={
                                                                            logo?.url
                                                                                ? logo.url.split('?')[0]
                                                                                : patientsDataById?.photo?.[0]?.url
                                                                                    ? patientsDataById?.photo?.[0]?.url
                                                                                    : profilePhoto
                                                                        }
                                                                        alt="Patient Profile"
                                                                        className="img-fluid rounded"
                                                                        style={{
                                                                            width: '126px',
                                                                            height: '129px',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                )}

                                                                {!isCameraOpen && (
                                                                    <BiEdit
                                                                        className={`position-absolute fs-4 text-primary ${uploading ? 'd-none' : ''
                                                                            }`}
                                                                        style={{
                                                                            bottom: '-5px',
                                                                            right: '-9px',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                        onClick={openCamera}
                                                                    />
                                                                )}

                                                                {isCameraOpen && (
                                                                    <div className="camera-controls d-flex justify-content-center gap-1 mt-1">
                                                                        <Button
                                                                            onClick={capturePhoto}
                                                                            type="button"
                                                                            className="custom-buttons">
                                                                            <TbCapture className="text-white fs-5" />{' '}
                                                                        </Button>
                                                                        <Button
                                                                            onClick={stopCamera}
                                                                            className="custom-buttons">
                                                                            <IoClose className="text-white fs-5" />
                                                                        </Button>
                                                                    </div>
                                                                )}

                                                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                                            </div>

                                                            <Button
                                                                type="submit"
                                                                className={`${!logo ? 'd-none' : 'custom-buttons'}`}
                                                                style={!logo ? {} : { marginTop: '5px' }}
                                                                disabled={!logo}>
                                                                Submit
                                                            </Button>
                                                        </Form>
                                                    </Col>

                                                    <Col sm={8}>
                                                        <Row className="pt-1">
                                                            <Col sm={6} className="p-0">
                                                                <div className="row">
                                                                    <div className="col-12 mx-1 ">
                                                                        <div className="row">
                                                                            <div className="col-3">
                                                                                <span className="fw-bold fs-6">
                                                                                    Patients ID:
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-9">
                                                                                <span
                                                                                    className="ps-2 text-primary fs-6"
                                                                                    style={{ fontWeight: 600 }}>
                                                                                    {patientsDataById?.chartNumber}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 mx-1">
                                                                        <div className="row">
                                                                            <div className="col-3">
                                                                                <span>
                                                                                    <MdPhone className="fs-5 text-primary" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-9">
                                                                                {patientsDataById?.telecom?.[0]
                                                                                    ?.value && (
                                                                                        <FaRegCopy
                                                                                            className="text-primary cursor-pointer"
                                                                                            onClick={() =>
                                                                                                navigator.clipboard.writeText(
                                                                                                    patientsDataById
                                                                                                        .telecom[0].value
                                                                                                )
                                                                                            }
                                                                                            title="Copy to clipboard"
                                                                                            style={{ fontSize: '10px' }}
                                                                                        />
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-12 mx-1 ">
                                                                        <div className="row">
                                                                            <div className="col-3">
                                                                                <span>
                                                                                    <MdOutlineMarkEmailUnread className="fs-5 text-primary" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-9 d-flex align-items-center">
                                                                                {patientsDataById?.telecom?.[3]
                                                                                    ?.value ? (
                                                                                    <>
                                                                                        <a
                                                                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${patientsDataById.telecom[3].value}`}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="ps-2 fs-6 me-2 text-decoration-none text-dark"
                                                                                            style={{ fontWeight: 600 }}
                                                                                            title="Send email via Gmail">
                                                                                            {
                                                                                                patientsDataById
                                                                                                    .telecom[3].value
                                                                                            }
                                                                                        </a>
                                                                                        <FaRegCopy
                                                                                            className="text-primary cursor-pointer"
                                                                                            onClick={() =>
                                                                                                navigator.clipboard.writeText(
                                                                                                    patientsDataById
                                                                                                        .telecom[3]
                                                                                                        .value
                                                                                                )
                                                                                            }
                                                                                            title="Copy to clipboard"
                                                                                            style={{ fontSize: '10px' }}
                                                                                        />
                                                                                    </>
                                                                                ) : (
                                                                                    <span
                                                                                        className="ps-2 fs-6 me-2"
                                                                                        style={{ fontWeight: 600 }}>
                                                                                        N/A
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 mx-1 ">
                                                                        <div className="row">
                                                                            <div className="col-3">
                                                                                <span>
                                                                                    <BiSolidLocationPlus className="fs-5 text-primary" />
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-9">
                                                                                <span
                                                                                    className="ps-2 fs-6"
                                                                                    style={{ fontWeight: 600 }}>
                                                                                    {patientsDataById?.address?.[0]
                                                                                        ?.city ||
                                                                                        patientsDataById?.address?.[0]
                                                                                            ?.state
                                                                                        ? `${patientsDataById
                                                                                            ?.address?.[0]
                                                                                            ?.city || ''
                                                                                        }${patientsDataById
                                                                                            ?.address?.[0]
                                                                                            ?.city &&
                                                                                            patientsDataById
                                                                                                ?.address?.[0]?.state
                                                                                            ? ', '
                                                                                            : ''
                                                                                        }${patientsDataById
                                                                                            ?.address?.[0]
                                                                                            ?.state || ''
                                                                                        }`
                                                                                        : 'N/A'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <div className="row">
                                                                    <div className="col-12 mx-1 ">
                                                                        <div className="row">
                                                                            <div className="col-5">
                                                                                <span className="fw-bold fs-6">
                                                                                    Primary Provider:
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-7">
                                                                                <span
                                                                                    className="ps-2 text-primary fs-6"
                                                                                    style={{ fontWeight: 600 }}>
                                                                                    {primaryProvider}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 mx-1 ">
                                                                        <div className="row">
                                                                            <div className="col-5">
                                                                                <span className="fw-bold fs-6">
                                                                                    Date Added:
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-7">
                                                                                <span
                                                                                    className="ps-2 fs-6"
                                                                                    style={{ fontWeight: 600 }}>
                                                                                    {patientsDataById?.createdAt
                                                                                        ? new Date(
                                                                                            patientsDataById.createdAt
                                                                                        ).toLocaleDateString('en-GB')
                                                                                        : 'N/A'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 mx-1 ">
                                                                        <div className="row">
                                                                            <div className="col-5">
                                                                                <span className="fw-bold fs-6">
                                                                                    Last Appointment Date:
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-7">
                                                                                <span
                                                                                    className="ps-2 fs-6"
                                                                                    style={{ fontWeight: 600 }}>
                                                                                    {patientsDataById?.lastApptDate ||
                                                                                        'N/A'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 mx-1 ">
                                                                        <div className="row">
                                                                            <div className="col-5">
                                                                                <span className="fw-bold fs-6">
                                                                                    Next Appointment Date:
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-7">
                                                                                <span
                                                                                    className="ps-2 fs-6"
                                                                                    style={{ fontWeight: 600 }}>
                                                                                    {patientsDataById?.nextApptDate ||
                                                                                        'N/A'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                    <Col sm={2} className="d-flex justify-content-end pe-2">
                                                        <div className="text-center">
                                                            <Button
                                                                className="text-black text-nowrap bg-white fs-6 d-flex align-items-center justify-content-center w-100"
                                                                style={{ height: '30px', borderRadius: '10px' }}
                                                                onClick={toggleTimer} // Toggle the timer
                                                            >
                                                                {isRunning
                                                                    ? `Pause (${formatTime(timeLeft)})`
                                                                    : timeLeft > 0
                                                                        ? `Resume (${formatTime(timeLeft)})`
                                                                        : 'Start Session'}
                                                            </Button>

                                                            <Button
                                                                className="text-black text-nowrap bg-white mt-1 fs-6 d-flex align-items-center justify-content-center w-100"
                                                                style={{ height: '30px', borderRadius: '10px' }}
                                                                onClick={handleShow} // Open modal on button click
                                                            >
                                                                Add Appointment
                                                            </Button>
                                                            <Button
                                                                className="text-black text-nowrap bg-white mt-1 fs-6 d-flex align-items-center justify-content-center w-100"
                                                                style={{ height: '30px', borderRadius: '10px' }}
                                                                onClick={handleEncounterTabs}>
                                                                Add Encounter
                                                            </Button>
                                                            <div className="mt-2 d-flex gap-2  justify-content-end">
                                                                <HiOutlinePrinter className="fs-3 text-black" />
                                                                <LiaReceiptSolid className="fs-3 text-black" />
                                                                {/* <TbHeartRateMonitor className='fs-3' /> */}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Info Section */}
                            {visibleSection === 'patient' && (
                                <div className="mt-2">
                                    <Card
                                        className="px-2"
                                        style={{
                                            height: isOpen ? '60.4vh' : '80.3vh',
                                            transition: 'height 0.3s ease-in-out',
                                        }}>
                                    </Card>
                                </div>
                            )}
                            {/* Task Section */}
                            {visibleSection === 'task' && (
                                <div className="mt-2">
                                    <Card className="px-2">
                                        <div className="d-flex justify-content-between pt-2 px-2 ">
                                            <h4>Clinic Review</h4>
                                            <div className="d-flex gap-1">
                                                <Button
                                                    className="custom-buttons"
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#offcanvasRight"
                                                    aria-controls="offcanvasRight">
                                                    <FiPlus className="fs-5 text-white" />
                                                    &nbsp;Task
                                                </Button>
                                                <Button
                                                    className="cancel-button"
                                                    onClick={() => setVisibleSection('patient')}>
                                                    Back
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between ">
                                            <div className="ms-2" style={{ borderBottom: '2px solid grey' }}>
                                                <ul className="nav nav-underline">
                                                    {[
                                                        'Assign Task',
                                                        'Problem List',
                                                        'Allergy List',
                                                        // 'Drug Medication',
                                                        'Medication List',
                                                    ].map((subTab) => (
                                                        <li className="nav-item" key={subTab}>
                                                            <a
                                                                className={`nav-link me-2 pb-0 tab-font-family ${selectedSubTab === subTab
                                                                    ? 'active text-primary'
                                                                    : 'text-black'
                                                                    }`}
                                                                onClick={() => handleSubTabChange(subTab)}
                                                                style={{ cursor: 'pointer', fontWeight: 600 }}>
                                                                {subTab}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <div
                                                    className="offcanvas offcanvas-end"
                                                    style={{ width: '500px!important' }}
                                                    tabindex="-1"
                                                    id="offcanvasRight"
                                                    aria-labelledby="offcanvasRightLabel">
                                                    <div
                                                        className="offcanvas-header py-1 "
                                                        style={{ borderBottom: '2px solid grey' }}>
                                                        <h4 id="offcanvasRightLabel">Add Assign Task</h4>
                                                        <button
                                                            type="button"
                                                            className="btn-close text-danger"
                                                            data-bs-dismiss="offcanvas"
                                                            aria-label="Close"></button>
                                                    </div>

                                                    <div className="offcanvas-body">
                                                        <AddAsignTask />
                                                    </div>
                                                </div>
                                                {selectedSubTab === 'Assign Task' && (
                                                    <FilterDropdown
                                                        showFilterDropdown={showFilterDropdown}
                                                        setShowFilterDropdown={setShowFilterDropdown}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className="mt-2 px-2 scroll-container"
                                            style={{ height: '65vh', overflow: 'auto' }}>
                                            {selectedSubTab === 'Assign Task' && <AssignTask />}
                                            {selectedSubTab === 'Problem List' && <ProblemList />}
                                            {selectedSubTab === 'Allergy List' && <AllergyList />}
                                            {/* {selectedSubTab === 'Drug Medication' && (
                                                <p>Drug Medication ⏳ In Progress</p>
                                            )} */}
                                            {selectedSubTab === 'Medication List' && (
                                                <p>Medication List ⏳ In Progress</p>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Drug Sections */}
                            {visibleSection === 'drug' && (
                                <>
                                    <Drug />
                                </>
                            )}

                            {/* CQIs section */}
                            {visibleSection === 'CQIs' && (
                                <>
                                    <CQIs />
                                </>
                            )}
                            {/* Appointment section */}
                            {visibleSection === 'appointments' && (
                                <>
                                    <AppointmentList Id={id} isOpen={isOpen} setIsOpen={setIsOpen} />
                                </>
                            )}

                            {/* Lab Request section */}
                            {visibleSection === 'Lab Request' && (
                                <>
                                    <LabRequest />
                                </>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className={isSidebarCollapsed ? 'col-1' : 'col-2'}>
                            <div
                                className="patient-menu-container bg-white mt-0"
                                style={{
                                    border: '1px solid #ced4da',
                                    borderRadius: '10px',
                                }}>
                                <div className="card m-0 overflow-hidden" style={{ borderRadius: '5px' }}>
                                    <div
                                        className="card-header d-flex justify-content-center align-items-center text-white px-2 py-1"
                                        style={{ backgroundColor: '#313A46', height: '43px' }}>
                                        <h5 className="m-0">Patient Chart</h5>
                                    </div>
                                    <div id="patientChartData" className="expanded">
                                        <div
                                            className="card-body p-0 scroll-container"
                                            style={{ height: '81.8vh', overflow: 'auto' }}>
                                            {patientMenuItems?.map((item, index) =>
                                                item.subItems ? (
                                                    <div key={index} className="ms-0">
                                                        <OverlayTrigger
                                                            placement="bottom"
                                                            overlay={
                                                                item.label === 'Clinical Review' ? (
                                                                    <Tooltip id={`tooltip-${item.label}`}>
                                                                        ⏳ In Progress
                                                                    </Tooltip>
                                                                ) : (
                                                                    <></>
                                                                )
                                                            }>
                                                            <p
                                                                className={`patient-menu-item text-black mb-0 ps-2 pe-2 border-bottom py-1 
                                                                  ${isSidebarCollapsed
                                                                        ? 'text-center fw-bold'
                                                                        : 'd-flex justify-content-between align-items-center'
                                                                    }`}
                                                                onClick={() => {
                                                                    if (item.label !== 'Clinical Review') {
                                                                        handleClinicalReviewToggle();
                                                                    }
                                                                }}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    backgroundColor:
                                                                        isClinicalReviewExpanded &&
                                                                            item.label !== 'Clinical Review'
                                                                            ? '#f8f9fa'
                                                                            : 'transparent',
                                                                }}>
                                                                <span
                                                                    className={
                                                                        isSidebarCollapsed
                                                                            ? 'd-block w-100 text-center'
                                                                            : 'd-flex'
                                                                    }
                                                                    title={isSidebarCollapsed ? item.label : ''}>
                                                                    <span
                                                                        style={{
                                                                            marginTop: '0px',
                                                                            display: 'inline-block',
                                                                        }}>
                                                                        {item?.icon}
                                                                    </span>
                                                                    {!isSidebarCollapsed && <>&nbsp;{item.label}</>}
                                                                </span>
                                                                {!isSidebarCollapsed && (
                                                                    <i
                                                                        className={`bi ${isClinicalReviewExpanded &&
                                                                            item.label !== 'Clinical Review'
                                                                            ? 'bi-chevron-up'
                                                                            : 'bi-chevron-down'
                                                                            }`}></i>
                                                                )}
                                                            </p>
                                                        </OverlayTrigger>

                                                        {/* Only show subItems if not Clinical Review and expanded */}
                                                        {item.label !== 'Clinical Review' &&
                                                            isClinicalReviewExpanded && (
                                                                <div className="ms-0">
                                                                    {item.subItems.map((subItem, subIndex) => (
                                                                        <OverlayTrigger
                                                                            key={subIndex}
                                                                            placement="bottom"
                                                                            overlay={
                                                                                <Tooltip
                                                                                    id={`tooltip-${subItem.label}`}>
                                                                                    ⏳ In Progress
                                                                                </Tooltip>
                                                                            }>
                                                                            <div className="d-flex justify-content-between align-items-center ps-4 border-bottom py-1 pe-2">
                                                                                <div
                                                                                    style={{
                                                                                        opacity: 0.5,
                                                                                        cursor: 'progress',
                                                                                        pointerEvents: 'none',
                                                                                        display: 'flex',
                                                                                        width: '100%',
                                                                                    }}>
                                                                                    <p className="text-black mb-0 d-flex">
                                                                                        <span
                                                                                            className="mb-0 bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                                                                            style={{
                                                                                                width: '20px',
                                                                                                height: '20px',
                                                                                                fontSize: '10px',
                                                                                                lineHeight: '20px',
                                                                                            }}>
                                                                                            0
                                                                                        </span>
                                                                                        {!isSidebarCollapsed &&
                                                                                            subItem.label}
                                                                                    </p>
                                                                                    {!isSidebarCollapsed && (
                                                                                        <p
                                                                                            className="mb-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                                                            style={{
                                                                                                width: '20px',
                                                                                                height: '20px',
                                                                                                fontSize: '10px',
                                                                                                lineHeight: '20px',
                                                                                            }}
                                                                                            title={
                                                                                                isSidebarCollapsed
                                                                                                    ? subItem.label
                                                                                                    : ''
                                                                                            }>
                                                                                            {subItem.icon}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </OverlayTrigger>
                                                                    ))}
                                                                </div>
                                                            )}
                                                    </div>
                                                ) : (
                                                    <OverlayTrigger
                                                        key={index}
                                                        placement="bottom"
                                                        overlay={
                                                            !activePatientChartItems.includes(item.label) ? (
                                                                <Tooltip id={`tooltip-${item.label}`}>
                                                                    ⏳ In Progress
                                                                </Tooltip>
                                                            ) : (
                                                                <></>
                                                            )
                                                        }>
                                                        <div>
                                                            <p
                                                                className={`patient-menu-item text-black mb-0 py-1 d-flex align-items-center 
                                                                           ${isSidebarCollapsed ? 'text-center' : 'ps-2'}`}
                                                                onClick={() => {
                                                                    if (activePatientChartItems.includes(item.label)) {
                                                                        handleChartTabChange(item.label);
                                                                    }
                                                                }}
                                                                style={{
                                                                    cursor: activePatientChartItems.includes(item.label)
                                                                        ? 'pointer'
                                                                        : 'progress',
                                                                    backgroundColor:
                                                                        selectedMainTab === item.label
                                                                            ? '#E8F0FE'
                                                                            : 'transparent',
                                                                    fontWeight:
                                                                        selectedMainTab === item.label
                                                                            ? 'bold'
                                                                            : 'normal',
                                                                    opacity: activePatientChartItems.includes(
                                                                        item.label
                                                                    )
                                                                        ? 1
                                                                        : 0.5,
                                                                }}
                                                                title={isSidebarCollapsed ? item.label : ''}>
                                                                <span
                                                                    className={
                                                                        isSidebarCollapsed ? 'w-100 text-center' : ''
                                                                    }>
                                                                    {item?.icon}
                                                                </span>
                                                                {!isSidebarCollapsed && <>&nbsp;{item.label}</>}
                                                            </p>
                                                            {!activePatientChartItems.includes(item.label) && (
                                                                <div style={{ pointerEvents: 'none', height: 0 }} />
                                                            )}
                                                        </div>
                                                    </OverlayTrigger>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal component */}
            </div>
            <Modal centered size="xl" show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="pt-0"
                    style={{
                        overflowY: 'scroll',
                        height: '60vh',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}>
                    <style>
                        {`::-webkit-scrollbar {
                     display: none; /* Chrome, Safari, and Edge */
                     }`}
                    </style>
                    <div>
                        <ul className="nav nav-underline">
                            {modalTabs.map((modalTab) => (
                                <li className="nav-item" key={modalTab}>
                                    <a
                                        className={`nav-link text-black me-2 ${activeModalTab === modalTab ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleModalTabClick(modalTab)}
                                        style={{ cursor: 'pointer' }}>
                                        {modalTab}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className=" ">
                            {activeModalTab === 'Appointments' && <AppointmentForm Id={id} />}
                            {activeModalTab === 'Billing' && <p>Billing Content ⏳ In Progress</p>}
                            {activeModalTab === 'Eligibility' && <p>Eligibility Content ⏳ In Progress</p>}
                            {activeModalTab === 'Vitals' && <p>Vitals Content ⏳ In Progress</p>}
                            {activeModalTab === 'Growthcharts' && <p>Growthcharts Content ⏳ In Progress</p>}
                            {activeModalTab === 'Log Comm.' && <p>Log Comm. Content ⏳ In Progress</p>}
                            {activeModalTab === 'Revisions' && <p>Revisions Content ⏳ In Progress</p>}
                            {activeModalTab === 'Mu Helper' && <p>Mu Helper Content ⏳ In Progress</p>}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={encounterModal} onHide={() => setEncounterModal(false)} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>Full Encounter Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>This takes up the whole screen!</h4>
                    <p>You can add forms, tables, whatever here.</p>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NewPatient;
