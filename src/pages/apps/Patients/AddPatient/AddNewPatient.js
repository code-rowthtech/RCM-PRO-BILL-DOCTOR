import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddPatientDetails from './AddPatientDetails';
import AddDemographics from './AddDemographics';
import AddInsurance from './AddInsurance';

const AddNewPatient = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Patient Details');


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className=' mt-2 '>
                <Card className='px-2 '>
                    <div className='d-flex justify-content-between pt-2 px-2'>
                        <div style={{ borderBottom: '2px solid grey' }}>
                            <ul className="nav nav-underline">
                                {[
                                    'Patient Details',
                                    'Demographics',
                                    'Insurances',
                                    'Eligibility',
                                    'Authorizations',
                                    'Vital Status',
                                    'Balance',
                                    'Payment'
                                ].map((tab) => (
                                    <li className="nav-item" key={tab}>
                                        <a
                                            className={`nav-link pb-0 tab-font-family me-3 ${activeTab === tab ? 'active text-primary' : 'text-black'}`}
                                            onClick={() => handleTabClick(tab)}
                                            style={{ cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            {tab}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className=''>
                            <Button className="cancel-button " onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className=" px-2 scroll-container" style={{ height: '83vh', overflow: 'auto' }}>
                        {activeTab === 'Patient Details' && <AddPatientDetails />}
                        {activeTab === 'Demographics' && <AddDemographics />}
                        {activeTab === 'Insurances' && <AddInsurance />}
                        {activeTab === 'Eligibility' && <p>In Progress...</p>}
                        {activeTab === 'Authorizations' && <p>In Progress...</p>}
                        {activeTab === 'Vital Status' && <p>In Progress...</p>}
                        {activeTab === 'Balance' && <p>In Progress...</p>}
                        {activeTab === 'Payment' && <p>In Progress...</p>}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AddNewPatient