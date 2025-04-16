import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Spinner, Form, Button, Modal } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateAppointmentDetailsAction, getAppointmentByPatientProviderAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import AppointmentForm from '../../Appointments/Tabs/AppointmentForm';

const AppointmentTable = ({ patientId, doctorId, status, search }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const appointments = store?.getAppointmentByPatientProviderReducer?.data?.appointments;
    console.log(appointments, 'dataof appointment');
    const loading = store?.getAppointmentByPatientProviderReducer?.loading;
    const updateStatus = store?.updateAppointmentDetailsReducer?.data?.status;
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [appointmentId,setAppointmentId]=useState(null)
    const handleClose = () => setShowModal(false);
    const [activeModalTab, setActiveModalTab] = useState('Appointments');
    const [cancelationPopupRow, setCancelationPopupRow] = useState(null);
    const [cancelationReason, setCancelationReason] = useState('');
    const { register, handleSubmit, reset } = useForm();
    // useEffect(() => {
    //     const payload = {
    //         subject: patientId,
    //         doctorId,
    //         status,
    //         search,
    //     };
    //     dispatch(getAppointmentByPatientProviderAction(payload));
    // }, [dispatch, patientId, doctorId, status, search]);

    useEffect(() => {
        if (updateStatus === 200) {
            dispatch(getAppointmentByPatientProviderAction({ subject: patientId, doctorId, status, search }));
            setCancelationPopupRow(null);
            setCancelationReason('');
        }
    }, [updateStatus]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.cancellation-popup') && cancelationPopupRow !== null) {
                setCancelationPopupRow(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cancelationPopupRow]);

    const submitWithReason = () => {
        const payload = {
            id: cancelationPopupRow,
            cancellationReason: [
                {
                    coding: [{ system: '', code: cancelationReason, display: cancelationReason }],
                    text: cancelationReason,
                },
            ],
            status: 'Cancelled',
        };
        dispatch(updateAppointmentDetailsAction({ key: encryptMessage(payload, patientId) }));
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

    return (
        <>
            <Row>
                <Col sm={12}>
                    <Table responsive className="table-centered table-nowrap mb-0 mt-2">
                        <thead className="text-white bg-dark">
                            <tr>
                                <th className="text-white">Sr.No.</th>
                                <th className="text-white">Status</th>
                                <th className="text-white">Patient</th>
                                <th className="text-white">Type</th>
                                <th className="text-white">Time</th>
                                <th className="text-white">Reason</th>
                                <th className="text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <Spinner className="my-5" />
                                    </td>
                                </tr>
                            ) : appointments?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        <h4 className="my-5">No Appointments Found</h4>
                                    </td>
                                </tr>
                            ) : (
                                appointments?.map((data, index) => (
                                    <tr key={data._id}>
                                        <td>{index + 1}</td>
                                        <td className="position-relative">
                                            {status !== 'history' ? (
                                                <>
                                                    <Form.Select
                                                        defaultValue={data?.status}
                                                        onChange={(e) => {
                                                            const newStatus = e.target.value;
                                                            if (newStatus === 'Cancelled') {
                                                                setCancelationPopupRow(data?._id);
                                                            } else {
                                                                dispatch(
                                                                    updateAppointmentDetailsAction({
                                                                        key: encryptMessage({
                                                                            id: data?._id,
                                                                            status: newStatus,
                                                                        }),
                                                                    })
                                                                );
                                                                setCancelationPopupRow(null);
                                                            }
                                                        }}
                                                        className="schedule-status-select">
                                                        <option value="" hidden>
                                                            Status
                                                        </option>
                                                        <option value="Scheduled">Scheduled</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                        <option value="Rescheduled">Rescheduled</option>
                                                        <option value="Noshow">No-Show</option>
                                                        <option value="Arrived">Arrived</option>
                                                        <option value="Checkedin">Checked In</option>
                                                        <option value="Checkedinonline">Checked In Online</option>
                                                        <option value="Inroom">In Room</option>
                                                        <option value="Insession">In Session</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Notconfirmed">Not Confirmed</option>
                                                    </Form.Select>

                                                    {cancelationPopupRow === data?._id && (
                                                        <div
                                                            className="position-absolute cancellation-popup border bg-white p-2"
                                                            style={{
                                                                left: '90%',
                                                                top: '0%',
                                                                width: '14vw',
                                                                boxShadow:
                                                                    '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                                                                zIndex: 10,
                                                            }}>
                                                            <div className="text-end">
                                                                <IoCloseCircleOutline
                                                                    className="cursor-pointer"
                                                                    onClick={() => setCancelationPopupRow(null)}
                                                                />
                                                            </div>
                                                            <Form onSubmit={handleSubmit(submitWithReason)}>
                                                                <Form.Group>
                                                                    <Form.Label>Cancelation Reason</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Enter reason"
                                                                        onChange={(e) =>
                                                                            setCancelationReason(e.target.value)
                                                                        }
                                                                    />
                                                                </Form.Group>
                                                                <div className="text-end d-flex justify-content-end mt-2">
                                                                    <Button
                                                                        type="submit"
                                                                        className="custom-buttons"
                                                                        disabled={!cancelationReason}>
                                                                        Submit
                                                                    </Button>
                                                                </div>
                                                            </Form>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span>{data?.status || 'N/A'}</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="text-capitalize">
                                                {data?.subject?.name?.[0]?.text || 'N/A'}
                                            </div>
                                            <small>
                                                {data?.subject?.birthDate
                                                    ? new Date(data?.subject?.birthDate).toLocaleDateString()
                                                    : 'N/A'}{' '}
                                                {data?.subject?.telecom?.[0]?.value || 'N/A'}
                                            </small>
                                        </td>
                                        <td>{data?.appointmentType?.coding?.[0]?.display || 'N/A'}</td>
                                        <td>
                                            <div>{data?.date ? new Date(data.date).toLocaleDateString() : 'N/A'}</div>
                                            <div>{data?.start ? new Date(data.start).toLocaleTimeString() : 'N/A'}</div>
                                        </td>
                                        <td>
                                            {data?.reason?.[0]?.text
                                                ? data.reason[0].text.length > 15
                                                    ? `${data.reason[0].text.slice(0, 15)}...`
                                                    : data.reason[0].text
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <FiEdit className="fs-4 cursor-pointer text-black" onClick={()=>{
                                                   setShowModal(true)
                                                   setAppointmentId(data?._id)
                                            }} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
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
                                        className={`nav-link text-black me-2 ${
                                            activeModalTab === modalTab ? 'active fw-bold' : ''
                                        }`}
                                        onClick={() => handleModalTabClick(modalTab)}
                                        style={{ cursor: 'pointer' }}>
                                        {modalTab}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className=" ">
                            {activeModalTab === 'Appointments' && <AppointmentForm Id={appointmentId} />}
                            {activeModalTab === 'Billing' && <p>Billing Content In Progress...</p>}
                            {activeModalTab === 'Eligibility' && <p>Eligibility Content In Progress...</p>}
                            {activeModalTab === 'Vitals' && <p>Vitals Content In Progress...</p>}
                            {activeModalTab === 'Growthcharts' && <p>Growthcharts Content In Progress...</p>}
                            {activeModalTab === 'Log Comm.' && <p>Log Comm. Content In Progress...</p>}
                            {activeModalTab === 'Revisions' && <p>Revisions Content In Progress...</p>}
                            {activeModalTab === 'Mu Helper' && <p>Mu Helper Content In Progress...</p>}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AppointmentTable;
