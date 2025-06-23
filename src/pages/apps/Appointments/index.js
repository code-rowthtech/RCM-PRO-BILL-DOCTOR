// @flow
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { FiFilter } from 'react-icons/fi';
import AppointmentCalendar from './AppointmentCalendar';
import { FaRegListAlt } from 'react-icons/fa';
import { CiCalendar } from 'react-icons/ci';
import AppointmentList from './AppointmentList';

// Main Appointments Component
const Appointments = () => {
    const [activeTab, setActiveTab] = useState('appointmentCalendar');

    const toggleTabs = (data) => {
        setActiveTab(data);
    }

    const tabOptions = [
        {
            key: 'appointmentCalendar',
            label: 'Appointment Calendar',
            icon: <CiCalendar />,
        },
        {
            key: 'appointments',
            label: 'Appointment List',
            icon: <FaRegListAlt />,
        },
    ];
    return (
        <>
            <Row className="">
                <Col xs={12}>
                    <Card className="page-height">
                        <Card.Body className='px-2 py-1'>
                            <Row className="mb-2">
                                <Col sm={4}>
                                    <ul className="nav nav-underline d-flex gap-3">
                                        {tabOptions.map(({ key, label, icon }, index) => (
                                            <li className='n' key={key}>
                                                <span
                                                    className={classNames(
                                                        'nav-link fw-bold text-secondary cursor-pointer fs-6 pb-1',
                                                        {
                                                            active: activeTab === key,
                                                        }
                                                    )}
                                                    onClick={() => toggleTabs(key)}
                                                >
                                                    {icon} {label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                                <Col sm={8} className="text-end mt-2 mt-md-0">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col
                                            xs={12}
                                            sm="auto"
                                            className="d-flex flex-wrap gap-2 align-items-center text-start justify-content-between responnsible-party-select">
                                            {activeTab === 'appointments' && (
                                                <>
                                                    <Button className="custom-buttons">
                                                        <FiFilter className="fs-5" />
                                                    </Button>
                                                    <Button
                                                        as={Link}
                                                        to="/apps/appointments/newAppointment"
                                                        className="custom-buttons">
                                                        New Appointment
                                                    </Button>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {activeTab === 'appointments' ? (
                                <AppointmentList />
                            ) : (
                                <AppointmentCalendar />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Appointments;
