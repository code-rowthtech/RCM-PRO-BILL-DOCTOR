import React, { useState } from 'react';
import { Button, Card, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
        <Card className=" scroll-container px-2 py-1 page-height">
            <Row className="mb-2">
                <Col sm={10}>
                    <ul className="nav nav-underline d-flex gap-2">
                        {tabs.map((tab) => {
                            const showTooltip = tab !== 'Appointments';

                            const tabContent = (
                                <li key={tab}>
                                    <a
                                        className={`nav-link text-secondary fs-6 pb-1 ${activeTab === tab ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => {
                                            if (tab !== 'Appointemnts') {
                                                return;
                                            } else {
                                                handleTabClick(tab)
                                            }
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {tab}
                                    </a>
                                </li>
                            );

                            return showTooltip ? (
                                <OverlayTrigger
                                    key={tab}
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-${tab}`}>
                                            In Progress
                                        </Tooltip>
                                    }
                                >
                                    {tabContent}
                                </OverlayTrigger>
                            ) : (
                                tabContent
                            );
                        })}

                    </ul>
                </Col>
                <Col sm={2} className="d-flex justify-content-end">
                    <Button
                        className='cancel-button'
                        style={{ height: '30px' }}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </Col>
            </Row>

            <div className=" ">
                {activeTab === 'Appointments' && <AppointmentForm />}
                {activeTab === 'Billing' && <p>Billing Content ⏳ In Progress</p>}
                {activeTab === 'Eligibility' && <p>Eligibility Content ⏳ In Progress</p>}
                {activeTab === 'Vitals' && <p>Vitals Content ⏳ In Progress</p>}
                {activeTab === 'Growthcharts' && <p>Growthcharts Content ⏳ In Progress</p>}
                {activeTab === 'Log Comm.' && <p>Log Comm. Content ⏳ In Progress</p>}
                {activeTab === 'Revisions' && <p>Revisions Content ⏳ In Progress</p>}
                {activeTab === 'Mu Helper' && <p>Mu Helper Content ⏳ In Progress</p>}
            </div>
        </Card>
    );
};

export default NewAppointment;