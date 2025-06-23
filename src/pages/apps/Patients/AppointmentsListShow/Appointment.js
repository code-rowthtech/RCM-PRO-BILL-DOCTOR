import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiSun, FiClock, FiCalendar } from 'react-icons/fi'; // ⬅️ Icons
import { getAppointmentByPatientProviderAction } from '../../../../redux/actions';
import AppointmentTable from './AppointmentFilterList';

const Appointment = ({ isOpen, setIsOpen }) => {
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('Today');
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;

    const handleMainTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const status = activeTab.toLowerCase(); // 'today', 'upcoming', 'history'
        const payload = {
            subject: patientId,
            doctorId: doctorId,
            status,
            search,
            page: skip,
        };
        dispatch(getAppointmentByPatientProviderAction(payload));
    }, [dispatch, activeTab, search, patientId, doctorId, skip]);

    // Icon mapping for tabs
    const tabIcons = {
        Today: <FiSun className="me-1" />,
        Upcoming: <FiClock className="me-1" />,
        History: <FiCalendar className="me-1" />,
    };

    return (
        <>
            <div className="mt-2">
                <Card
                    className="px-2"
                    style={{
                        height: isOpen ? '60vh' : '79vh',
                        overflowY: 'scroll',
                        transition: 'height 0.3s ease',
                    }}>
                    <div className="pt-2 px-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <ul className="nav nav-underline">
                                {['Today', 'Upcoming', 'History'].map((tab) => (
                                    <li className="nav-item" key={tab}>
                                        <a
                                            className={`nav-link me-3 pb-0 tab-font-family d-flex align-items-center ${activeTab === tab
                                                    ? 'active text-primary fw-bold'
                                                    : 'text-secondary fw-semibold'
                                                }`}
                                            onClick={() => handleMainTabChange(tab)}
                                            style={{ cursor: 'pointer' }}>
                                            {tabIcons[tab]} {tab}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <Form.Control
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '250px',
                                    borderRadius: '8px',
                                    padding: '6px 12px',
                                    fontSize: '14px',
                                }}
                            />
                        </div>

                        {/* Main Content Section */}
                        <AppointmentTable
                            patientId={patientId}
                            doctorId={doctorId}
                            skip={skip}
                            setSkip={setSkip}
                            status={activeTab.toLowerCase()}
                            search={search}
                        />
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Appointment;
