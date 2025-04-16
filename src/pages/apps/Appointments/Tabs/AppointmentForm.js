import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row, InputGroup } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AddDemographics from '../../Patients/AddPatient/AddDemographics';
import {
    createAppointmentsAction,
    getAllAppointmentsAction,
    getAppointmentDetailsAction,
    getPatientsAction,
    getPatientsByIdAction,
    getPractitionerAvailabilityAction,
    stateEmptydAction,
    updateAppointmentDetailsAction,
} from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { FaPlus } from 'react-icons/fa';
import AddPatientDetails from '../../Patients/AddPatient/AddPatientDetails';
import { appointmentTypeOptions } from '../../../../utils/DataSets/apppointmenttype.data';
import AsyncSelect from 'react-select/async';
import { appointmentReasonOptions } from '../../../../utils/DataSets/appointmentreason.data';

const AppointmentForm = ({ Id, appointmentId }) => {
    console.log(Id, 'appoinmentid', appointmentId)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = Id ? Id : searchParams.get('id');

    // console.log(id, 'iddddddddddddddd')
    const store = useSelector((state) => state);
    const createResponse = store?.createPatientsReducer?.data?.status;
    // console.log(createResponse, 'createResponseStatus');
    const createPatientResponse = store?.createPatientsReducer?.data?.patient;
    const [submissionType, setSubmissionType] = useState(null);
    const [age, setAge] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [createAppointmentType, setCreateAppointmentType] = useState(null)
    const createAppointmentResponse = store?.createAppointmentsReducer?.data?.status;
    const appointmentDetails = store?.getAppointmentDetailsReducer?.data?.appointment;
    console.log(appointmentDetails, 'appointmentDetails')
    // console.log(createAppointmentResponse, 'createAppointmentResponse')
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [activeTab, setActiveTab] = useState('personalDetails');
    const [btnShow, setBtnShow] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [showModal, setShowModal] = useState(false);
    const doctorName = JSON.parse(sessionStorage.getItem('hyper_user'))?.name?.text;
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    useEffect(() => {
        if (createAppointmentResponse === 200 && createAppointmentType === 'back') {
            reset();
            navigate('/apps/appointments/list')
        } else if (createAppointmentResponse === 200 && createAppointmentType === 'save') {

        }
    }, [createAppointmentType, createAppointmentResponse])

    const handleSelectChange = (e) => {
        const value = e.target.value;

        if (value === 'new-patient') {
            setShowModal(true);
        } else {
            setSelectedOption(value);
        }
    };


    useEffect(() => {
        const data = {
            id: appointmentId ? appointmentId : id,
        };
        dispatch(getAppointmentDetailsAction(data));
    }, [dispatch, appointmentId]);

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
            handleCloseModal();
            reset();
            setActiveTab('demographicDetails');
            setPatientId(createPatientResponse?._id);
            dispatch(stateEmptydAction());
            const data = {
                doctorId: doctorId,
                page: skip,
                limit: 10,
                search: search,
            };
            dispatch(getPatientsAction(data));
        } else if (createResponse === 201 && submissionType === 'saveAndReset') {
            reset();
            setSelectedDoctor(null);
            setLogo(null);
            setLogoName(null);
            setPatientId(null);
            // dispatch(stateEmptydAction());
            const data = {
                doctorId: doctorId,
                page: skip,
                limit: 10,
                search: search,
            };
            dispatch(getPatientsAction(data));
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
        dispatch(getPatientsAction((data)));
    }, [dispatch, skip, search]);

    const selectedDate = watch("scheduled"); // Watch the selected date field

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const availabilityResponse = store?.getPractitionerAvailabilityReducer?.data
    // console.log(availabilityResponse, 'availabilityResponseavailabilityResponse')
    useEffect(() => {
        if (selectedDate) {
            const data = { date: selectedDate };

            dispatch(getPractitionerAvailabilityAction(data))

        }
    }, [dispatch, selectedDate]);

    useEffect(() => {
        if (availabilityResponse?.available === false) {
            setShowConfirmationModal(true);
        }
    }, [availabilityResponse])

    const patientsData = store?.getPatientsReducer?.data?.data || [];
    // console.log(patientsData, 'patientsDatapatientsDatapatientsDatapatientsData')
    // const patientsList =store?.getPatientsReducer?.data
    // console.log(patientsData, 'patientsData')

    useEffect(() => {
        if (createResponse === 201) {
            setPatientId(createPatientResponse?._id);
        }
    }, [createResponse]);

    useEffect(() => {

        if (appointmentDetails && patientsData?.length > 0) {
            setValue('minutesDuration', appointmentDetails?.minutesDuration);
            setValue('consultationRoom', appointmentDetails?.examRoom);
            setValue('status', appointmentDetails?.status);
            // setValue('patient', appointmentDetails?.subject?._id);
            setSelectedOption(appointmentDetails?.subject?._id)
            setValue('appointmentType', appointmentDetails?.appointmentType?.coding?.[0]?.display);
            setAppointmentReason(appointmentDetails?.reason?.[0]?.coding?.[0]);
            setValue('scheduled', appointmentDetails?.start ? new Date(appointmentDetails?.start).toISOString().split('T')[0] : '');
            setValue('startTime', appointmentDetails?.start ? new Date(appointmentDetails?.start).toISOString().split('T')[1].slice(0, 5) : '');
        }


    }, [appointmentDetails, patientsData])

    useEffect(() => {
        if (id) {
            const payload = {
                id: id,
            };
            dispatch(getPatientsByIdAction({ key: encryptMessage(payload) }));
        }
    }, [id]);

    const onSubmit = (data) => {

        const selectedAppointmentType = appointmentTypeOptions.find((option) => option.show === data.appointmentType);
        const appointmentTypePayload = {
            coding: [
                {
                    system: selectedAppointmentType.system,
                    code: selectedAppointmentType.value,
                    display: selectedAppointmentType.show,
                },
            ],
            text: selectedAppointmentType.label,
        };
        // ✅ Define startDateTime and endDateTime here, BEFORE using in payload
        const startDateTime = new Date(`${data.scheduled}T${data.startTime}:00`);
        const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);

        const payload = {
            ...(id ? { id } : { id: appointmentId }),
            subject: data?.patient,
            ...(id ? {} : { clinicId }), // Exclude `clinicId` in update case
            // doctor: doctorId,
            start: data?.startTime,
            appointmentType: appointmentTypePayload,
            date: data?.scheduled,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            created: new Date().toISOString(),
            minutesDuration: data?.duration,
            examRoom: data?.consultationRoom,
            status: data?.status,
            reason: [
                {
                    coding: appointmentReason,
                    text: appointmentReason?.display,
                },
            ],
            slot: data?.startTime,
        };

        // Dispatch update if `id` exists, otherwise create a new one
        if (id || appointmentId) {
            dispatch(updateAppointmentDetailsAction({ key: encryptMessage(payload) }));
            console.log(payload, 'payloaddddd')
        } else {
            dispatch(createAppointmentsAction({ key: encryptMessage(payload) }));
        }
        // reset();
    };

    const formattedReasonOptions = appointmentReasonOptions.map((reason) => ({
        value: reason, // Code as the value
        label: reason.display, // Display text as the label
    }));
    const [appointmentReason, setAppointmentReason] = useState(null);
    const handleReasonChange = (selectedOption) => {
        setAppointmentReason(selectedOption ? selectedOption.value : '');
    };
    const selectedReasonOption =
        formattedReasonOptions.find((option) => option?.value?.code === appointmentReason?.code) ||
        formattedReasonOptions.find((option) => option?.display === appointmentReason);
    const loadReasonOptions = (inputValue, callback) => {
        // If there's no search input, show only the first 10 options
        if (!inputValue) {
            callback(formattedReasonOptions.slice(0, 10));
            return;
        }

        // Filter options based on search input
        const filteredOptions = formattedReasonOptions.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        callback(filteredOptions.slice(0, 20)); // Return up to 20 results on search
    };

    return (
        <div>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">
                                Patient{!id && <span className="text-danger">*</span>}
                            </Form.Label>
                            <InputGroup>
                                <Form.Select
                                    {...register('patient', { required: !id && 'Patient is required' })}
                                    className="form-select"
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                    data-has-value={!!selectedOption}
                                    disabled={id}>
                                    <option value="" hidden >
                                        Select Patient
                                    </option>
                                    {patientsData?.map((patient) => (
                                        <option key={patient?._id} value={patient?._id}>
                                            {patient?.name?.[0]?.text}
                                        </option>
                                    ))}
                                </Form.Select>

                                {!id && (
                                    <InputGroup.Text onClick={handlePlusIconClick} style={{ cursor: 'pointer' }}>
                                        <FaPlus className="text-primary" />
                                    </InputGroup.Text>
                                )}
                            </InputGroup>
                            {errors?.patient && (
                                <p className="text-danger mb-0 err-font" >
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
                    {/* <Col sm={6}>
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
                    </Col> */}
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="appointmentType">
                            <Form.Label className="mb-0">Appointment Type{!id && <span className="text-danger">*</span>}</Form.Label>
                            <Form.Select
                                className="form-select"
                                {...register('appointmentType', { required: 'Appointment Type is required' })}
                                data-has-value={!!watch('appointmentType')}>
                                <option value="" hidden>
                                    Select Appointment Type
                                </option>
                                {appointmentTypeOptions.map((option) => (
                                    <option key={option.value} value={option.show}>
                                        {option.show} ( {option.label})
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.appointmentType && <p className="text-danger err-font">{errors.appointmentType.message}</p>}
                        </Form.Group>
                    </Col>
                    <Col sm={6} className="d-flex gap-2">
                        <Form.Group className="mb-1" style={{ width: "150px" }}>
                            <Form.Label className="mb-0">
                                Scheduled{!id && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control
                                type="date"
                                data-has-value={!!selectedDate}
                                {...register("scheduled", { required: "Scheduled date is required" })}
                            />
                            {/* {errors?.scheduled && (
                                <p className="text-danger mb-0" style={{ fontSize: "10px" }}>
                                    {errors?.scheduled?.message}
                                </p>
                            )} */}
                        </Form.Group>
                        <Form.Group className="mb-1" style={{ width: '100px' }}>
                            <Form.Label className="mb-0">
                                Start Time{!id && <span className="text-danger">*</span>}
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
                        <Form.Group>
                            <Form.Label className="mb-0">Reason</Form.Label>
                            <AsyncSelect
                                loadOptions={loadReasonOptions}
                                defaultOptions={formattedReasonOptions.slice(0, 10)} // Show first 10 options initially
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="&nbsp; Select"
                                value={selectedReasonOption}
                                onChange={handleReasonChange}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: '0px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                    }),
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="consultationRoom">
                            <Form.Label className="mb-0">Consultation Room</Form.Label>
                            <Form.Select
                                className="form-select"
                                data-has-value={!!watch('consultationRoom')}
                                {...register('consultationRoom')}>
                                <option value="" hidden>
                                    Select Consultation Room
                                </option>
                                <option value="Room 1">Room 1</option>
                                <option value="Room 2">Room 2</option>
                                {/* <option value="3">Room 3</option> */}
                                {/* <option value="4">Room 4</option> */}
                            </Form.Select>
                            {/* {errors.appointmentType && <p className="text-danger err-font">{errors.consultationRoom.message}</p>} */}
                        </Form.Group>
                    </Col>
                    {/* <Col sm={6}>
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
                    </Col> */}
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Status</Form.Label>
                            <Form.Select data-has-value={!!watch('status')} {...register('status')}>
                                <option value="" hidden>
                                    Status
                                </option>
                                <option value="proposed">Proposed</option>
                                <option value="pending">Pending</option>
                                <option value="booked">Booked</option>
                                <option value="arrived">Arrived</option>
                                <option value="fulfilled">Fulfilled</option>  
                                <option value="cancelled">Cancelled</option>
                                <option value="noshow">No Show</option>
                                <option value="entered-in-error">Entered in error</option>
                                <option value="checked-in">Checked In</option>
                                <option value="entered-in-error">Waitlisted</option>
                                {/* <option value="Checkedinonline">Checked In Online</option> */}
                                {/* <option value="Notconfirmed">Not Confirmed</option> */}
                            </Form.Select>
                        </Form.Group>

                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                        {!id && <Button className="custom-buttons" onClick={() => reset()}>
                            Delete
                        </Button>
                        }
                        {!id &&
                            <Button type="submit" onClick={() => setCreateAppointmentType('back')} className="custom-buttons">
                                Save and close
                            </Button>
                        }
                        <Button type="submit" onClick={() => setCreateAppointmentType('save')} className="custom-buttons">
                            {!id ? 'Save' : 'Update'}
                        </Button>
                        {/* <Button className="custom-buttons">Cancel</Button> */}
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
                                        className={`text-black nav-link fw-medium ${activeTab === 'personalDetails' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('personalDetails')}>
                                        Personal Details
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'demographicDetails' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('demographicDetails')}>
                                        Demographic
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'referringDoctor' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('referringDoctor')}>
                                        Referring Doctor
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'responsible' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('responsible')}>
                                        Responsible party
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'insurance' ? 'active fw-bold' : ''
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
                        {activeTab === 'personalDetails' && <AddPatientDetails patientId={patientId} setSubmissionType={setSubmissionType} />}
                        {activeTab === 'responsible' && <p>responsible</p>}
                        {activeTab === 'insurance' && <p>insurance...</p>}
                        {activeTab === 'demographicDetails' && <AddDemographics patientId={patientId} />}
                        {activeTab === 'referringDoctor' && <p>referringDoctor...</p>}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Confirmation Modal */}
            <Modal show={showConfirmationModal} onHide={() => { setShowConfirmationModal(false); setValue("scheduled", ""); }} centered>
                <Modal.Body>
                    <div className='text-center'>
                        <h4>Confirmation Needed</h4>

                    </div>
                    <div className='text-center mt-4'>
                        <p>
                            Doctor is on holiday. Are you sure you want to create an appointment?
                        </p>
                    </div>
                    <div className='d-flex justify-content-center gap-2 mt-4 mb-1'>
                        <Button
                            className='cancel-button'
                            onClick={() => {
                                setShowConfirmationModal(false);
                                setValue("scheduled", ""); // Reset the selected date
                            }}
                        >
                            Cancel
                        </Button>
                        <Button className='custom-buttons' onClick={() => setShowConfirmationModal(false)}>
                            Proceed
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AppointmentForm;
