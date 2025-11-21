import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import ProfessionalInformation from './ProfessionalInformation';
import Documents from './Documents';
import DoctorQualifications from './Qualifications';
import PersonalDetails from './PersonalDetails';
import { useDispatch } from 'react-redux';
import { getStatesByCountryAction } from '../../redux/actions';

const Index = () => {
    const dispatch = useDispatch(); // Initialize dispatch for Redux actions
    const [activeTab, setActiveTab] = useState('personalDetails'); // Manage active tab state
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="pt-1 pb-2">
            <div>
                <Card className=" scroll-container page-height px-3">
                    <div className="row">
                        <div>
                            <ul className="nav nav-underline">
                                {[
                                    { id: 'personalDetails', label: 'Personal Details' },
                                    { id: 'professionalInformation', label: 'Professional Information' },
                                    { id: 'qualifications', label: 'Qualifications' },
                                    // { id: 'documents', label: 'Documents' },
                                ].map((tab) => (
                                    <li className="nav-item" key={tab.id}>
                                        <button
                                            className={`text-black nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                            onClick={() => handleTabChange(tab.id)}>
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            {activeTab === 'personalDetails' && <PersonalDetails setActiveTab={setActiveTab} />}
                            {activeTab === 'professionalInformation' && <ProfessionalInformation setActiveTab={setActiveTab} />}
                            {activeTab === 'qualifications' && (
                                <DoctorQualifications setActiveTab={setActiveTab} />
                            )}

                            {activeTab === 'documents' && <Documents />}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Index;
