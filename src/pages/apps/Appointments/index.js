// @flow
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { FormInput } from '../../../components';
import { FiArchive, FiClock, FiEdit, FiFileText, FiFilter, FiSun } from 'react-icons/fi';
import { getAppointmentsAction } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../constants/Spinner';
import AppointmentCalendar from './AppointmentCalendar';
import { useForm } from 'react-hook-form';

// Define the types for each order item
type OrderListItems = {
    orderId: string,
    avatar: string,
    name: string,
    projectName: string,
    country: string,
    city: string,
    date: string,
    orderStatus: string,
};

type OrderListProps = {
    patientsData: Array<OrderListItems>,
};

// Component for Appointments List Table
const AppointmentsList = ({ patientsData }: OrderListProps): React$Element<React$FragmentType> => {
    const dispatch = useDispatch();
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const store = useSelector((state) => state)
    // const patientsAppointment = '' || [];
    // console.log(patientsAppointment, '1234567890')
    const patientsAppointmentData = store?.getAppointmentsReducer?.data?.appointments || [];
    console.log(patientsAppointmentData, 'patientsAppointmentData')

    useEffect(() => {

        const data = {
            doctorId: doctorId,
            clinicId: clinicId,
            status: "upcoming"
        };

        dispatch(getAppointmentsAction(data));
    }, [dispatch]);


    return (
        <Table responsive className="table-centered table-nowrap mb-0">
            <thead className="text-white">
                <tr>
                    <th className='text-white'>Sr.No.</th>
                    <th className='text-white'>Patients Name</th>
                    <th className='text-white'>Reason</th>
                    <th className='text-white'>Start Time</th>
                    {/* <th className='text-white'>Doctor</th> */}
                    {/* <th className='text-white'>Doctor Department</th> */}
                    <th className='text-white ' style={{ paddingRight: '70px' }}>Date</th>
                    <th className='text-white '>Status</th>
                    <th className='text-white '>Action</th>
                </tr>
            </thead>
            {store?.getAppointmentsReducer?.loading ? (
                <tr>
                    <td className='text-center' colSpan={6}>
                        <Spinner className=" my-5 " />
                    </td>
                </tr>
            ) : (
                <tbody>
                    {patientsAppointmentData?.length === 0 ? (
                        <tr>
                            <td colSpan={6} className='text-center'>
                                <h3 className='my-5 py-5'>No scheduled appointments.</h3>
                            </td>
                        </tr>
                    ) : (
                        patientsAppointmentData?.map((data, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className='text-capitalize'>{data?.subject?.name?.[0]?.text} </td>
                                <td className="text-capitalize" title={data?.reason?.[0]?.text}>
                                    {data?.reason?.[0]?.text?.length > 40
                                        ? `${data.reason[0].text.substring(0, 40)}...`
                                        : data?.reason?.[0]?.text}
                                </td>

                                <td className='text-capitalize'>
                                    {data?.start ? new Date(data.start).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    }) : '--'}
                                </td>
                                <td>
                                    {data?.date
                                        ? new Date(data?.date).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : "N/A"}
                                </td>
                                <td><span className='px-2 fw-bold text-white bg-success rounded-2 fs-6'>{data?.status}</span></td>
                                <td>
                                    <Link to={`/apps/appointments/newAppointment?id=${data?._id}`} >
                                        <FiEdit className="fs-4 ms-2 cursor-pointer text-black" />
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            )}
        </Table>
    );
};

// Component for Appointments Transaction Table
const AppointmentsTransactionList = ({ patientsData }: OrderListProps): React$Element<React$FragmentType> => {

    const dispatch = useDispatch();
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const store = useSelector((state) => state)

    const patientsAppointmentData = store?.getAppointmentsReducer?.data?.appointments || [];
    console.log(patientsAppointmentData, 'patientsAppointmentData')

    useEffect(() => {

        const data = {
            doctorId: doctorId,
            clinicId: clinicId,
            status: "history"
        };

        dispatch(getAppointmentsAction(data));
    }, [dispatch]);
    return (
        <Table responsive className="table-centered table-nowrap mb-0">
            <thead className="text-white">
                <tr>
                    <th className='text-white'>Sr.No.</th>
                    <th className='text-white'>Patients Name</th>
                    <th className='text-white'>Reason</th>
                    <th className='text-white'>Start Time</th>
                    {/* <th className='text-white'>Doctor</th> */}
                    {/* <th className='text-white'>Doctor Department</th> */}
                    <th className='text-white ' style={{ paddingRight: '70px' }}>Date</th>
                    <th className='text-white '>Status</th>
                </tr>
            </thead>
            {store?.getAppointmentsReducer?.loading ? (
                <tr>
                    <td className='text-center' colSpan={6}>
                        <Spinner className=" my-5 " />
                    </td>
                </tr>
            ) : (
                <tbody>
                    {patientsAppointmentData?.length === 0 ? (
                        <tr>
                            <td colSpan={6} className='text-center'>
                                <h3 className='my-5 py-5'>No appointment history.</h3>
                            </td>
                        </tr>
                    ) : (
                        patientsAppointmentData?.map((data, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className='text-capitalize'>{data?.subject?.name?.[0]?.text} </td>
                                <td className="text-capitalize" title={data?.reason?.[0]?.text}>
                                    {data?.reason?.[0]?.text?.length > 40
                                        ? `${data.reason[0].text.substring(0, 40)}...`
                                        : data?.reason?.[0]?.text}
                                </td>

                                <td className='text-capitalize'>
                                    {data?.start ? new Date(data.start).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    }) : '--'}
                                </td>
                                <td>
                                    {data?.date
                                        ? new Date(data?.date).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : "N/A"}
                                </td>

                                <td><span className='px-2 fw-bold text-white bg-success rounded-2 fs-6'>{data?.status}</span></td>
                            </tr>
                        ))
                    )}
                </tbody>
            )}
        </Table>
    );
};

// Main Appointments Component
const Appointments = ({ patientsData }: { patientsData: Array<OrderListItems> }): React$Element<React$FragmentType> => {
    const {
        register,
        formState: { errors },
        setValue,
        clearErrors,
    } = useForm();
    const goto = () => {
        navigate("/apps/appointments/appointmentCalendar");
    };
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointmentPeriod, setAppointmentPeriod] = useState('today');
    const navigate = useNavigate();
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    useEffect(() => {
        if (activeTab === 'appointments') {
            dispatch(getAppointmentsAction({ clinicId: clinicId, doctorId: doctorId, status: appointmentPeriod }));
        }
    }, [dispatch, appointmentPeriod, activeTab]);
    return (
        <>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card style={{ height: '87vh' }}>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={4}>
                                    <ul className="nav nav-underline">
                                        <li className="nav-item">
                                            <a
                                                className={classNames("nav-link fw-bold text-black", { active: activeTab === 'appointments', 'fw-bold': activeTab === 'appointments' })}
                                                href="#"
                                                onClick={() => setActiveTab('appointments')}
                                            >
                                                Appointments
                                            </a>
                                        </li>
                                        {/* <li className="nav-item ms-3">
                                            <a
                                                className={classNames("nav-link fw-bold text-black", { active: activeTab === 'transactions', 'fw-bold': activeTab === 'transactions' })}
                                                href="#"
                                                onClick={() => setActiveTab('transactions')}
                                            >
                                                Appointments History
                                            </a>
                                        </li> */}
                                        <li className="nav-item ms-3">
                                            <a
                                                className={classNames("nav-link fw-bold text-black", { active: activeTab === 'appointmentCalendar', 'fw-bold': activeTab === 'appointmentCalendar' })}
                                                href="#"
                                                onClick={() => setActiveTab('appointmentCalendar')}
                                            >
                                                Appointment Calendar
                                            </a>
                                        </li>
                                    </ul>
                                </Col>

                                <Col sm={8} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            {/* Search input shown in both tabs */}
                                            <FormInput
                                                type="text"
                                                placeholder="Search..."
                                            />

                                            {/* Additional controls shown only in the "Appointments" tab */}
                                            {activeTab === 'appointments' && (
                                                <>
                                                    <Button className="custom-buttons px-2">
                                                        <FiFilter className="fs-5" />
                                                    </Button>
                                                    <FormInput
                                                        type="Date"
                                                        placeholder="Search..."
                                                    />
                                                    <Button className="custom-buttons px-2">
                                                        <FiFileText className="fs-4" onClick={goto} />
                                                    </Button>
                                                    <Button as={Link} to="/apps/appointments/newAppointment" className="custom-buttons px-2">New Appointment</Button>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                                {activeTab === 'appointments' &&
                                    <Col md={12} className='mt-2'>
                                        <div className="time-period-tabs">
                                            <ul className="nav nav-pills">
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${appointmentPeriod === 'today' ? 'active' : 'text-black'}`}
                                                        onClick={() => setAppointmentPeriod('today')}
                                                    >
                                                        <FiSun className="me-1" />
                                                        Today
                                                    </button>
                                                </li>
                                                <li className="nav-item ms-2">
                                                    <button
                                                        className={`nav-link ${appointmentPeriod === 'upcoming' ? 'active' : 'text-black'}`}
                                                        onClick={() => setAppointmentPeriod('upcoming')}
                                                    >
                                                        <FiClock className="me-1" />
                                                        Upcoming
                                                    </button>
                                                </li>
                                                <li className="nav-item ms-2">
                                                    <button
                                                        className={`nav-link ${appointmentPeriod === 'history' ? 'active' : 'text-black'}`}
                                                        onClick={() => setAppointmentPeriod('history')}
                                                    >
                                                        <FiArchive className="me-1" />
                                                        History
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                }
                            </Row>

                            {/* Render table based on active tab */}
                            {activeTab === 'appointments' ? (
                                <AppointmentsList patientsData={patientsData} />
                            ) : (
                                // <AppointmentsTransactionList patientsData={patientsData} />
                                <AppointmentCalendar patientsData={patientsData} 
                                // selectedDoctor={selectedDoctor?.value} 
                                />

                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Appointments;

