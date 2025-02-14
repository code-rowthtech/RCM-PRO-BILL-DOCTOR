import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row, InputGroup } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AddDemographics from '../../Patients/AddPatient/AddDemographics';
import {
    createAppointmentsAction,
    getAllAppointmentsAction,
    getPatientsAction,
    getPatientsByIdAction,
    stateEmptydAction,
} from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { FaPlus } from 'react-icons/fa';
import AddPatientDetails from '../../Patients/AddPatient/AddPatientDetails';

const AppointmentForm = ({ Id }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const store = useSelector((state) => state);
    const createResponse = store?.createPatientsReducer?.data?.status;
    const createPatientResponse = store?.createPatientsReducer?.data?.patient;
    const [submissionType, setSubmissionType] = useState(null);
    const [smShow, setSmShow] = useState(false);
    const [age, setAge] = useState(null);
    const [patientId, setPatientId] = useState(null);

    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [activeTab, setActiveTab] = useState('personalDetails');
    const [btnShow, setBtnShow] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [showModal, setShowModal] = useState(false);
    const doctorName = JSON.parse(sessionStorage.getItem('hyper_user'))?.firstName;
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const handleSelectChange = (e) => {
        const value = e.target.value;

        if (value === 'new-patient') {
            setShowModal(true);
        } else {
            setSelectedOption(value);
        }
    };

    const handlePlusIconClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        setSelectedOption(Id);
    }, [Id]);

    useEffect(() => {
        if (age) {
            setValue('approxAge', age);
        }
    }, [age]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'personalDetails') {
            setBtnShow(true);
        } else {
            setBtnShow(false);
        }
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
    } = useForm({
        defaultValues: {
            duration: 30,
        },
    });
    useEffect(() => {
        if (createResponse === 201 && submissionType === 'saveAndNext') {
            reset();
            setActiveTab('demographicDetails');
            setPatientId(createPatientResponse?._id);
            dispatch(stateEmptydAction());
        } else if (createResponse === 201 && submissionType === 'saveAndReset') {
            reset();
            setSelectedDoctor(null);
            setLogo(null);
            setLogoName(null);
            setPatientId(null);
            dispatch(stateEmptydAction());
        } else if (createResponse === 201 && submissionType === 'save') {
            setPatientId(createPatientResponse?._id);
        }
    }, [createResponse, submissionType]);

    useEffect(() => {
        setValue('primaryProvider', doctorName);
    }, [doctorName, setValue]);

    useEffect(() => {
        const data = {
            doctorId: doctorId,
            page: skip,
            limit: 10,
            search: search,
        };
        dispatch(getPatientsAction({ key: encryptMessage(data) }));
    }, [dispatch, skip, search]);

    const patientsData = store?.getPatientsReducer?.data?.patients || [];
    const updateAppointment = store?.createAppointmentsReducer?.data?.status;

    useEffect(() => {
        if (createResponse === 201) {
            setPatientId(createPatientResponse?._id);
        }
    }, [createResponse]);

    useEffect(() => {
        const data = {
            doctorId: doctorId,
            clinicId: clinicId,
            status: activeTab,
        };
        if (updateAppointment === 200) {
            dispatch(getAllAppointmentsAction({ key: encryptMessage(data) }));
        }
    }, [updateAppointment]);

    useEffect(() => {
        if (id) {
            const payload = {
                id: id,
            };
            dispatch(getPatientsByIdAction({ key: encryptMessage(payload) }));
        }
    }, [id]);

    const onSubmit = (data) => {
        const payload = {
            patient: Id ? Id : data?.patient,
            clinic: clinicId,
            doctor: doctorId,
            startTime: data?.startTime,
            office: data?.office,
            date: data?.scheduled,
            duration: data?.duration,
            examRoom: data?.consultationRoom,
            reason: data?.reason,
            status: data?.status,
            profile: data?.profile,
            slot: data?.startTime,
        };
        dispatch(createAppointmentsAction({ key: encryptMessage(payload) }));
        console.log({ payload }, 'hello');
        reset();
    };

    return (
        <div>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">
                                Patient{!Id && <span className="text-danger">*</span>}
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    {...register('patient', { required: !Id && 'Patient is required' })}
                                    as="select"
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                    data-has-value={!!selectedOption}
                                    disabled={Id}>
                                    <option value="" hidden hidden>
                                        Select Patient
                                    </option>
                                    {patientsData?.map((patient) => (
                                        <option key={patient?._id} value={patient?._id}>
                                            {patient?.firstName} {patient?.lastName}
                                        </option>
                                    ))}
                                </Form.Control>

                                {!Id && (
                                    <InputGroup.Text onClick={handlePlusIconClick} style={{ cursor: 'pointer' }}>
                                        <FaPlus className="text-primary" />
                                    </InputGroup.Text>
                                )}
                            </InputGroup>
                            {errors?.patient && (
                                <p className="text-danger mb-0" style={{ fontSize: '10px' }}>
                                    {errors?.patient?.message}
                                </p>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Doctor</Form.Label>
                            <Form.Control
                                id="doctor"
                                type="text"
                                {...register('doctor')}
                                value={doctorName}
                                data-has-value={!!watch('doctor')}
                                readOnly
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Office</Form.Label>
                            <Form.Control as="select" {...register('office')} data-has-value={!!watch('office')}>
                                <option value="" hidden>
                                    Select Office
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Reason</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Reason"
                                data-has-value={!!watch('reason')}
                                {...register('reason', { required: 'Reason is required' })}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6} className="d-flex gap-2">
                        <Form.Group className="mb-1" style={{ width: '150px' }}>
                            <Form.Label className="mb-0">
                                Scheduled<span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="date"
                                data-has-value={!!watch('scheduled')}
                                {...register('scheduled', { required: 'Scheduled date is required' })}
                            />
                            {errors?.scheduled && (
                                <p className="text-danger mb-0" style={{ fontSize: '10px' }}>
                                    {errors?.scheduled?.message}
                                </p>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-1" style={{ width: '100px' }}>
                            <Form.Label className="mb-0">
                                Start Time<span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="time"
                                data-has-value={!!watch('startTime')}
                                {...register('startTime', { required: 'Time is required' })}
                            />
                            {errors?.startTime && (
                                <p className="text-danger mb-0" style={{ fontSize: '10px' }}>
                                    {errors?.startTime?.message}
                                </p>
                            )}
                        </Form.Group>

                        <div className="d-flex">
                            <Form.Group className="mb-1" style={{ width: '100px' }}>
                                <Form.Label className="mb-0">Duration</Form.Label>
                                <Form.Control
                                    type="number"
                                    defaultValue={30} // Set default value to 30
                                    data-has-value={!!watch('duration')}
                                    {...register('duration', { required: 'Duration is required' })}
                                />
                            </Form.Group>

                            <span className="text-secondary fs-6 fw-bold mt-3 pt-1 ps-2">minutes</span>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Profile</Form.Label>
                            <Form.Control as="select" data-has-value={!!watch('profile')} {...register('profile')}>
                                <option value="" hidden>
                                    Select Profile
                                </option>
                                <option value="New Patient Visit">New Patient Visit</option>
                                <option value="Followup Visit">Follow up Visit</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Consultation Room</Form.Label>
                            <Form.Control
                                as="select"
                                data-has-value={!!watch('consultationRoom')}
                                {...register('consultationRoom')}>
                                <option value="" hidden>
                                    Select Consultation Room
                                </option>
                                <option value="1">Room 1</option>
                                <option value="2">Room 2</option>
                                <option value="3">Room 3</option>
                                <option value="4">Room 4</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Consent Forms</Form.Label>
                            <Form.Control
                                as="select"
                                data-has-value={!!watch('consentForms')}
                                {...register('consentForms')}>
                                <option value="" hidden>
                                    Select Consent Forms
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Status</Form.Label>
                            <Form.Control as="select" data-has-value={!!watch('status')} {...register('status')}>
                                <option value="" hidden hidden>
                                    Status
                                </option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rescheduled">Rescheduled</option>
                                <option value="Noshow'">No-Show</option>
                                <option value="Arrived">Arrived</option>
                                <option value="Checkedin">Checked In</option>
                                <option value="Checkedinonline">Checked In Online</option>
                                <option value="Inroom">In Room</option>
                                <option value="Insession">In Session</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Notconfirmed">Not Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                        <Button className="custom-buttons" onClick={() => reset()}>
                            Delete
                        </Button>

                        <Button type="submit" className="custom-buttons">
                            Save and close
                        </Button>
                        <Button type="submit" className="custom-buttons">
                            Save
                        </Button>
                        <Button className="custom-buttons">Cancel</Button>
                    </Col>
                </Row>
            </Form>
            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body
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
                    <div className="d-flex justify-content-between">
                        <div>
                            <ul className="nav nav-underline">
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${
                                            activeTab === 'personalDetails' ? 'active fw-bold' : ''
                                        }`}
                                        onClick={() => handleTabChange('personalDetails')}>
                                        Personal Details
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${
                                            activeTab === 'demographicDetails' ? 'active fw-bold' : ''
                                        }`}
                                        onClick={() => handleTabChange('demographicDetails')}>
                                        Demographic
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${
                                            activeTab === 'referringDoctor' ? 'active fw-bold' : ''
                                        }`}
                                        onClick={() => handleTabChange('referringDoctor')}>
                                        Referring Doctor
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${
                                            activeTab === 'responsible' ? 'active fw-bold' : ''
                                        }`}
                                        onClick={() => handleTabChange('responsible')}>
                                        Responsible party
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${
                                            activeTab === 'insurance' ? 'active fw-bold' : ''
                                        }`}
                                        onClick={() => handleTabChange('insurance')}>
                                        Insurance
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex">
                            {activeTab === 'responsible' && (
                                <Button className="me-2 custom-buttons" onClick={() => handleTabChange('responsible')}>
                                    Payment
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="px-2">
                        {activeTab === 'personalDetails' && <AddPatientDetails patientId={patientId} />}
                        {activeTab === 'responsible' && <p>responsible</p>}
                        {activeTab === 'insurance' && <p>insurance...</p>}
                        {activeTab === 'demographicDetails' && <AddDemographics patientId={patientId} />}
                        {activeTab === 'referringDoctor' && <p>referringDoctor...</p>}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AppointmentForm;
