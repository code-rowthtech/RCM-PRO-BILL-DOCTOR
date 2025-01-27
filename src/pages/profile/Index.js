import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import ProfessionalInformation from './ProfessionalInformation';
import Documents from './Documents';
import PersonalDetails from './PersonalDetails';

const Index = () => {
    const [activeTab, setActiveTab] = useState('personalDetails'); // Manage active tab state

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='pt-1 pb-2'>
            <div className=" mt-2">
                <Card className='px-3 py-1' style={{height:'87vh'}}>
                    <div className="row">
                        {/* <div>
                            <p className="fw-bold">PROFILE</p>
                        </div> */}
                        <div>
                            <ul className="nav nav-underline">
                                {[
                                    { id: 'personalDetails', label: 'Personal Details' },
                                    { id: 'professionalInformation', label: 'Professional Information' },
                                    // { id: 'documents', label: 'Documents' },
                                ].map((tab) => (
                                    <li className="nav-item" key={tab.id}>
                                        <button
                                            className={`text-black nav-link ${activeTab === tab.id ? 'active' : ''
                                                }`}
                                            onClick={() => handleTabChange(tab.id)}
                                        >
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            {activeTab === 'personalDetails' && <PersonalDetails />}
                            {activeTab === 'professionalInformation' && <ProfessionalInformation />}
                            {/* {activeTab === 'documents' && <Documents />} */}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Index;
