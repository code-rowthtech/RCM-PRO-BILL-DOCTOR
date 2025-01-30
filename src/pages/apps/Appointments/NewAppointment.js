import React, { useState } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
// import AppointmentForm from './Tabs/AppointmentForm';
// import Vitals from './Tabs/Vitals';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from './Tabs/AppointmentForm';

const NewAppointment = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Appointments');

    const tabs = [
        'Appointments',
        'Billing',
        'Eligibility',
        'Vitals',
        'Growthcharts',
        'Log Comm.',
        'Revisions',
        'Mu Helper'
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleBack = () => {
        navigate("/apps/appointments/list");
    };

    return (
        <div>
            <Card className=" scroll-container px-2 py-2 mt-2" style={{ height: '82vh', overflow: 'scroll' }}>
                <Row className="mb-2">
                    <Col sm={10}>
                        <ul className="nav nav-underline">
                            {tabs.map((tab) => (
                                <li className="nav-item" key={tab}>
                                    <a
                                        className={`nav-link text-black me-2 ${activeTab === tab ? 'active fw-bold' : ''}`}
                                        onClick={() => handleTabClick(tab)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {tab}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Col>
                    <Col sm={2} className="d-flex justify-content-end">
                        <Button
                            className='custom-buttons'
                            style={{ height: '30px' }}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                    </Col>
                </Row>

                <div className=" ">
                    {activeTab === 'Appointments' && <AppointmentForm />}
                    {activeTab === 'Billing' && <p>Billing Content In Progress...</p>}
                    {activeTab === 'Eligibility' && <p>Eligibility Content In Progress...</p>}
                    {activeTab === 'Vitals' && <p>Vitals Content In Progress...</p>}
                    {activeTab === 'Growthcharts' && <p>Growthcharts Content In Progress...</p>}
                    {activeTab === 'Log Comm.' && <p>Log Comm. Content In Progress...</p>}
                    {activeTab === 'Revisions' && <p>Revisions Content In Progress...</p>}
                    {activeTab === 'Mu Helper' && <p>Mu Helper Content In Progress...</p>}
                </div>
            </Card>
        </div>
    );
};

export default NewAppointment;