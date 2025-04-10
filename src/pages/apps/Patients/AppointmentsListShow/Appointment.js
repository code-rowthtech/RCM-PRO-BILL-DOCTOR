import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FaArrowLeftLong } from 'react-icons/fa6';
import FutureAppointment from './AppointmentsTab/FutureAppointments/FutureAppointment';
import PastAppointment from './AppointmentsTab/PastAppointments/PastAppointment';
import { useNavigate } from 'react-router-dom';
import { FiPrinter } from 'react-icons/fi';

const Appointment = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Future Appointment');

    const handleMainTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="mt-2">
            <Card className="px-2" style={{ height: '70vh' }}>
                <div className="pt-2 px-2">
                    <div className="d-flex justify-content-between">
                        <h4>Appointments</h4>
                        <Button className="cancel-button" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div style={{ borderBottom: '2px solid grey' }}>
                            <ul className="nav nav-underline">
                                {['Future Appointment', 'Past Appointment'].map((tab) => (
                                    <li className="nav-item" key={tab}>
                                        <a
                                            className={`nav-link me-3 pb-0 tab-font-family ${
                                                activeTab === tab
                                                    ? 'active text-primary fw-bold'
                                                    : 'text-secondary fw-semibold'
                                            }`}
                                            onClick={() => handleMainTabChange(tab)}
                                            style={{ cursor: 'pointer' }}>
                                            {tab}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content Section */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">{activeTab}</h5>
                        {activeTab === 'Future Appointment' && (
                            <button className="custom-buttons text-white">
                                <span className='me-1'><FiPrinter /></span>
                                Print Future Appointments</button>

                        )}
                        {activeTab === 'Past Appointment' && (
                            <button className="custom-buttons text-white">
                              <span className='me-1'><FiPrinter /></span> 
                                Print History
                            </button>
                        )}
                    </div>

                    <div className="mt-2 scroll-container" style={{ height: '65vh', overflow: 'auto' }}>
                        {activeTab === 'Future Appointment' && (
                            <div>
                                <FutureAppointment />
                            </div>
                        )}
                        {activeTab === 'Past Appointment' && (
                            <div>
                                <PastAppointment />
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Appointment;
