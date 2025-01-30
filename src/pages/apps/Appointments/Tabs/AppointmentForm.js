import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
// import { createPatientsAction, updatePatientsAction, getPatientByIdAction, getResponsiblePartyAction, getPatientsAction } from "../../../../redux/patients/actions";
// import { getCitiesAction, getDoctorsAction, getStatesByCountryAction, getSubClinicCitiesAction, stateEmptydAction } from "../../../../redux/actions";
import { useForm } from "react-hook-form";
import { FiUploadCloud } from 'react-icons/fi';
// import { encryptMessage } from '../../../cryptoUtils';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { useDispatch, useSelector } from 'react-redux';
import us from '../../../../assets/images/flags/us.jpg';
import AddDemographics from '../../Patients/AddPatient/AddDemographics';
import { createAppointmentsAction, createPatientsAction, getCitiesAction, getPatientsAction, getPatientsByIdAction, getStatesByCountryAction, stateEmptydAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { FaPlus } from "react-icons/fa";
import AddPatientDetails from '../../Patients/AddPatient/AddPatientDetails';
// import Responsiblle from '../../Patients/Responsible';
// import Insurance from '../../Patients/Insurance/Insurance';
// import Demographicdetails from '../../Patients/Demographic';
// import ReferringDoctor from '../../Patients/referringDoctor';




const AppointmentForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const store = useSelector((state) => state);
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const createResponse = store?.createPatientsReducer?.data?.status;
    const createPatientResponse = store?.createPatientsReducer?.data?.patient;
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const patientDetails = store?.getPatientByIdReducer?.data?.patient;
    const responsibleParties = store?.getResponsiblePartyReducer?.data?.responsibleParties;
    const doctorDetails = store?.getDoctorsReducer?.data?.response;
    const [focused, setFocused] = useState(false);
    const [submissionType, setSubmissionType] = useState(null);
    const [smShow, setSmShow] = useState(false);
    const [age, setAge] = useState(null);
    const [password, setPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const [formData, setFormData] = useState({
        role: doctorRoleId,
    });
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1)
    const [partySearch, setPartySearch] = useState('')
    const [selectedParty, setSelectedParty] = useState(null)
    const [doctorSearch, setDoctorSearch] = useState('');
    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [searchedLocations, setSearchedLocations] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [activeTab, setActiveTab] = useState("personalDetails");
    const [btnShow, setBtnShow] = useState(true);
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [showModal, setShowModal] = useState(false);
    const doctorName = JSON.parse(sessionStorage.getItem('hyper_user'))?.firstName
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId


    const handleSelectChange = (e) => {
        const value = e.target.value;

        if (value === "new-patient") {
            setShowModal(true);
        } else {
            setSelectedOption(value);
        }
    };

    const handlePlusIconClick = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (age) {
            setValue('approxAge', age);
        }
    }, [age]);
    const options = responsibleParties?.map((party) => ({
        value: party._id,
        label: party.fullName,
    }));

    // const doctorOptions = doctorDetails?.map((data) => ({
    //     value: data?._id,
    //     label: data?.userDetails?.firstName + ' ' + data?.userDetails?.lastName,
    // }));
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "personalDetails") {
            setBtnShow(true);
        } else {
            setBtnShow(false);
        }
    };
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors } = useForm();
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
            setPatientId(createPatientResponse?._id)
        }
    }, [createResponse, submissionType])


    useEffect(() => {
        setValue("primaryProvider", doctorName);
    }, [doctorName, setValue]);

    useEffect(() => {
        const data = {
            doctorId: doctorId,
            page: skip,
            limit: 10,
            search: search,
        }
        dispatch(getPatientsAction({ key: encryptMessage(data) }));

    }, [dispatch, skip, search]);

    const patientsData = store?.getPatientsReducer?.data?.patients || [];
    console.log('patientsData', patientsData)

    useEffect(() => {
        if (createResponse === 201) {
            setPatientId(createPatientResponse?._id)
        }
    }, [createResponse])


    useEffect(() => {
        if (id) {
            const payload = {
                id: id,
            }
            dispatch(getPatientsByIdAction({ key: encryptMessage(payload) }));
        }
    }, [id])

    function addDurationToTime(time, duration) {
        let [hours, minutes] = time?.split(':').map(Number);
        minutes += duration;
        if (minutes >= 60) {
            hours += Math.floor(minutes / 60);  // Add the extra hours
            minutes = minutes % 60;  // Keep only the remainder of minutes
        }
        if (hours >= 24) {
            hours = hours % 24;
        }

        // Format the result to match "HH:MM"
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }


    const onSubmit = (data) => {

        const payload = {
            patient: data?.patient,
            clinic: clinicId,
            doctor: doctorId,
            startTime: data?.startTime,
            endTime: addDurationToTime(data?.startTime, data?.duration),
            office: data?.office,
            date: data?.scheduled,
            duration: data?.duration,
            examRoom: data?.consultationRoom,
            reason: data?.reason,
            status: data?.status,
            profile: data?.profile,
            slot: data?.startTime

        }
        dispatch(createAppointmentsAction({ key: encryptMessage(payload) }))
        console.log({ payload })
    }




    return (
        <div>

            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="patient">
                            <Form.Label className="mb-0">Patient<span className="text-danger">*</span></Form.Label>
                            <InputGroup>
                                <Form.Control   {...register("patient", { required: "Patient is required" })} as="select" value={selectedOption} onChange={handleSelectChange}>
                                    <option value="" hidden>Select Patient</option>
                                    {/* {/ <option value="new-patient">Add New Patient</option > /} */}
                                    {patientsData?.map((patient) => (
                                        <option key={patient?._id} value={patient?._id}>
                                            {patient?.firstName} {patient?.lastName}
                                        </option>
                                    ))}
                                </Form.Control>
                                <InputGroup.Text
                                    onClick={handlePlusIconClick}
                                    style={{ cursor: "pointer" }}
                                >
                                    <FaPlus className='text-primary' />
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="doctor">
                            <Form.Label className="mb-0">Doctor<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                id="doctor"
                                type="text"
                                {...register("doctor")}
                                value={doctorName} // Ensures the value is displayed
                                readOnly // Prevent user modification
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="office">
                            <Form.Label className="mb-0">Office</Form.Label>
                            <Form.Control as="select" {...register("office",
                                // { required: "Office is required" }
                            )}>
                                <option value="">Select Office</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="reason">
                            <Form.Label className="mb-0">Reason</Form.Label>
                            <Form.Control
                                type="text"
                                {...register("reason",
                                    //  { required: "Reason is required" }
                                )}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6} className="d-flex gap-2">
                        <Form.Group className="mb-1" style={{ width: "150px" }} controlId="scheduled">
                            <Form.Label className="mb-0">Scheduled<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                {...register("scheduled",
                                    // { required: "Scheduled date is required" }
                                )}
                            />
                        </Form.Group>
                        <Form.Group className="mb-1" style={{ width: "100px" }} controlId="starttime">
                            <Form.Label className="mb-0">Start Time<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="time"
                                {...register("startTime",
                                    //  { required: "Time is required" }
                                )}
                            />
                        </Form.Group>

                        <div className="d-flex">
                            <Form.Group className="mb-1" style={{ width: "100px" }} controlId="duration">
                                <Form.Label className="mb-0">Duration</Form.Label>
                                <Form.Control
                                    type="number"
                                    {...register("duration",
                                        // { required: "Duration is required" }
                                    )}
                                />
                            </Form.Group>
                            <span className="text-secondary fs-6 fw-bold mt-3 pt-1 ps-2">minutes</span>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="profile">
                            <Form.Label className="mb-0">Profile</Form.Label>
                            <Form.Control as="select" {...register("profile",
                                // { required: "Profile is required" }
                            )}>
                                <option value="">Select Profile</option>
                                <option value="New Patient Visit">New Patient Visit</option>
                                <option value="Followup Visit">Follow up Visit</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="consultationRoom">
                            <Form.Label className="mb-0">Consultation Room</Form.Label>
                            <Form.Control
                                as="select"
                                {...register('consultationRoom',
                                    //  { required: 'Consultation room is required' }
                                )}
                            >
                                <option value="">Select Consultation Room</option>
                                <option value="1">Room 1</option>
                                <option value="2">Room 2</option>
                                <option value="3">Room 3</option>
                                <option value="4">Room 4</option>
                            </Form.Control>
                            {/* {errors.consultationRoom && (
              <p className="text-danger">{errors.consultationRoom.message}</p>
            )} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="consentForms">
                            <Form.Label className="mb-0">Consent Forms</Form.Label>
                            <Form.Control
                                as="select"
                                {...register('consentForms',
                                    // { required: 'Consent form selection is required' }
                                )}
                            >
                                <option value="">Select Consent Forms</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </Form.Control>
                            {/* {errors.consentForms && (
              <p className="text-danger">{errors.consentForms.message}</p>
            )} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="consentForms">
                            <Form.Label className="mb-0">Status</Form.Label>
                            <Form.Control
                                as="select"
                                {...register('status',
                                    // { required: 'Consent form selection is required' }
                                )}
                            >
                                <option value="">Status</option>
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
                            {/* {errors.consentForms && (
              <p className="text-danger">{errors.consentForms.message}</p>
            )} */}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                        <Button
                            className="custom-buttons"
                        >
                            Delete
                        </Button>
                        <Button
                            type="submit"
                            className="custom-buttons"
                        >
                            Save and close
                        </Button>
                        <Button
                            type='submit'
                            className="custom-buttons"
                        >
                            Save
                        </Button>
                        <Button
                            className="custom-buttons"
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        overflowY: "scroll",
                        height: "60vh",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
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
                                        className={`text-black nav-link fw-medium ${activeTab === "personalDetails" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("personalDetails")}
                                    >
                                        Personal Details
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === "demographicDetails" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("demographicDetails")}
                                    >
                                        Demographic
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === "referringDoctor" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("referringDoctor")}
                                    >
                                        Referring Doctor
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === "responsible" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("responsible")}
                                    >
                                        Responsible party
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === "insurance" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("insurance")}
                                    >
                                        Insurance
                                    </button>
                                </li>
                            </ul>

                        </div>
                        <div className="d-flex">
                            {activeTab === "responsible" && (
                                <Button
                                    className="me-2 custom-buttons"
                                    onClick={() => handleTabChange("responsible")}
                                >
                                    Payment
                                </Button>
                            )}

                            {/* <Button className="me-2">
                                Clear
                            </Button>
                            <Button className="me-2">
                                Set Password
                            </Button> */}
                            {/* <Button className="cancel-button" onClick={() => navigate(-1)}>Back</Button> */}
                        </div>
                    </div>

                    <div className="px-2">
                        {/* Form Section */}
                        {activeTab === "personalDetails" && <AddPatientDetails patientId={patientId} />}
                        {activeTab === "responsible" && <p>responsible</p>}
                        {activeTab === "insurance" && <p>insurance...</p>}
                        {activeTab === "demographicDetails" && <AddDemographics patientId={patientId} />}
                        {activeTab === "referringDoctor" && <p>referringDoctor...</p>}
                    </div>
                </Modal.Body>
                {/* <Modal.Footer> */}
                {/* <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary">
                        Save Changes
                    </Button> */}

                {/* </Modal.Footer> */}
            </Modal>
        </div>

    );
};

export default AppointmentForm;
