import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentsAction, updateAppointmentDetailsAction } from '../../../redux/actions';
import Paginations from '../../../helpers/Paginations';
import { Button, Col, Form, Table } from 'react-bootstrap';
import { loggedInUser } from '../../../helpers/loggedInUser';
import { FiArchive, FiClock, FiSun } from 'react-icons/fi';
import { encryptMessage } from '../../../cryptoUtils';
import { Link } from 'react-router-dom';
import Spinner from '../../../constants/Spinner';
import { appointmentStatus } from '../../../utils/DataSets/appointmentstatus';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { formatTimeWithAmPm, usDate } from '../../../helpers/helperFunctions';

const AppointmentList = () => {
    // DECLARATIONS
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const { handleSubmit } = useForm();
    // VARIABLES AND STATE VARIABLES
    const updateSuccess = store?.updateAppointmentDetailsReducer?.data?.status;
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const [cancelationPopupRow, setCancelationPopupRow] = useState(null);
    const [cancelationReason, setCancelationReason] = useState('');
    const [appointmentPeriod, setAppointmentPeriod] = useState('today');
    const [skip, setSkip] = useState(1);

    // USEEFFECTS
    useEffect(() => {
        fetchAppointments();
    }, [appointmentPeriod, skip]);

    useEffect(() => {
        if (updateSuccess === 200) {
            fetchAppointments();
            setCancelationPopupRow(null);
            setCancelationReason('');
        }
    }, [updateSuccess]);

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

    // FUNCTIONS
    const fetchAppointments = () => {
        const currentQuery = {
            clinicId: loggedInUser?.clinicId || store?.Auth?.user?.clinicId,
            doctorId: loggedInUser?.doctorId || store?.Auth?.user?.doctorId,
            status: appointmentPeriod,
            limit: 10,
            page: skip,
        };

        dispatch(getAppointmentsAction(currentQuery));
    };

    const submitWithReason = () => {
        const payload = {
            id: cancelationPopupRow,
            cancellationReason: [
                {
                    coding: [{ system: '', code: '', display: cancelationReason }],
                    text: cancelationReason,
                },
            ],
            status: 'cancelled',
        };
        dispatch(updateAppointmentDetailsAction({ key: encryptMessage(payload) }));
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== skip) setSkip(pageNumber);
    };

    const handleAppointmentPeriodToggle = (period) => {
        if (appointmentPeriod !== period) {
            setAppointmentPeriod(period);
            setSkip(1);
        }
    };

    return (
        <>
            <Col md={12} className="my-1">
                <div className="time-period-tabs">
                    <ul className="nav nav-pills">
                        {[
                            { label: 'Today', key: 'today', icon: <FiSun className="me-1" /> },
                            { label: 'Upcoming', key: 'upcoming', icon: <FiClock className="me-1" /> },
                            { label: 'History', key: 'history', icon: <FiArchive className="me-1" /> },
                        ].map(({ label, key, icon }) => (
                            <li key={key} className="nav-item ms-2">
                                <button
                                    className={`nav-link fs-6 p-1 ${appointmentPeriod === key ? 'active' : 'text-black'}`}
                                    onClick={() => handleAppointmentPeriodToggle(key)}>
                                    {icon} {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </Col>

            <Col sm={12} className='px-2 scroll-container' style={{ height: '71vh' }}>
                <Table responsive className="table-centered mb-0 rounded">
                    <thead className="text-white">
                        <tr>
                            {['Sr.No.', 'Status', 'Patient', 'Type', 'Time', 'Reason', 'Action'].map((header, idx) => (
                                <th key={idx}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {store?.getAppointmentsReducer?.loading ? (
                            <tr>
                                <td colSpan={9} className="text-center"><Spinner /></td>
                            </tr>
                        ) : appointmentsList?.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center"><h5>No Appointments Found</h5></td>
                            </tr>
                        ) : (
                            appointmentsList?.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="text-capitalize position-relative">
                                        <Form.Select
                                            defaultValue={data?.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                if (newStatus === 'cancelled') {
                                                    setCancelationPopupRow(data?._id);
                                                } else {
                                                    dispatch(updateAppointmentDetailsAction({
                                                        key: encryptMessage({ id: data?._id, status: newStatus }),
                                                    }));
                                                    setCancelationPopupRow(null);
                                                }
                                            }}
                                            className={`schedule-status-select ${data?.status?.replace(/-/g, '') + 'Color'}`}>
                                            {appointmentStatus?.map(({ code, display }, idx) => (
                                                <option key={idx} value={code}>{display}</option>
                                            ))}
                                        </Form.Select>

                                        {cancelationPopupRow === data?._id && (
                                            <div className="position-absolute cancellation-popup border bg-white"
                                                style={{
                                                    left: '84%',
                                                    top: '0%',
                                                    width: '14vw',
                                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                                                }}>
                                                <p className="fs-4 px-2 mb-0 text-end">
                                                    <IoCloseCircleOutline onClick={() => setCancelationPopupRow(null)} />
                                                </p>
                                                <div className="p-2 pt-0">
                                                    <Form onSubmit={handleSubmit(submitWithReason)}>
                                                        <Form.Group>
                                                            <Form.Label>Cancelation Reason</Form.Label>
                                                            <Form.Control
                                                                className="mb-2"
                                                                type="text"
                                                                placeholder="Enter the cancellation reason"
                                                                onChange={(e) => setCancelationReason(e.target.value)}
                                                            />
                                                        </Form.Group>
                                                        <div className="text-end">
                                                            <Button disabled={!cancelationReason} className="custom-buttons" type="submit">
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-capitalize">
                                        {(data?.subject?.name?.[0]?.prefix?.[0]
                                            ? data?.subject?.name?.[0]?.prefix?.[0] + ' '
                                            : '') +
                                            (data?.subject?.name?.[0]?.family || '') +
                                            (data?.subject?.name?.[0]?.given?.length > 0
                                                ? ' ' + data?.subject?.name?.[0]?.given?.join(' ')
                                                : '') || 'N/A'}
                                        {/* {data?.subject?.name?.[0]?.text} */}
                                        <div className="d-flex gap-2">
                                            <span>{data?.subject?.birthDate ? new Date(data.subject.birthDate).toISOString().split('T')[0] : 'N/A'}</span>
                                            <span>{data?.subject?.telecom?.find(item => item.system === 'phone')?.value || 'No phone number'}</span>
                                        </div>
                                    </td>
                                    <td>{formatTimeWithAmPm(data?.start)} - {formatTimeWithAmPm(data?.end)}</td>
                                    <td>{usDate(data?.date)}</td>
                                    <td
                                        className="text-capitalize cursor-pointer"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title={data?.reason?.[0]?.coding?.[0]?.display}>
                                        {data?.reason?.[0]?.coding?.[0]?.display?.length > 20
                                            ? `${data?.reason?.[0]?.coding?.[0]?.display.slice(0, 19)}...`
                                            : data?.reason?.[0]?.coding?.[0]?.display}
                                    </td>
                                    <td>
                                        <Link to={`/apps/appointments/newAppointment?id=${data?._id}`} className="action-icon">
                                            <i className="mdi mdi-square-edit-outline cursor-pointer" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Col>

            <Col className="mt-2 d-flex justify-content-end">
                <Paginations
                    currentPage={skip}
                    totalPages={store?.getAppointmentsReducer?.data?.totalPages}
                    onPageChange={handlePageChange}
                />
            </Col>
        </>
    );
};

export default AppointmentList;
