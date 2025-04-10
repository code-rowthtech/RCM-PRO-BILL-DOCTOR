import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddPatientDetails from './AddPatientDetails';
import AddDemographics from './AddDemographics';
import AddRefferingDoctor from './ReferringDoctor';
import AddResponsibleParty from './ResponsibleParty';
import AddInsurance from './AddInsurance';
import { useSelector } from 'react-redux';

const AddNewPatient = () => {
    const navigate = useNavigate();
    const store = useSelector((state) => state);
    const [activeTab, setActiveTab] = useState('Patient Details');
    const [patientId, setPatientId] = useState(null);
    const [visibleReffering, setVisibleReffering] = useState(true);
    const [visibleResponsible, setVisibleResponsible] = useState(true);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const createResponse = store?.createPatientsReducer?.data?.status;
    const createPatientResponse = store?.createPatientsReducer?.data?.data;
    const updateSuccess = store?.updatePatientsReducer?.data?.status;
    useEffect(() => {
        if (createResponse === 201 && createPatientResponse?._id) {
            setPatientId(createPatientResponse._id);
            setActiveTab('Demographics');
        }
    }, [createResponse, createPatientResponse]);

    useEffect(() => {
        if (updateSuccess === 200) {
            if (activeTab === 'Demographics') {
                if (visibleReffering) {
                    setActiveTab('RefferingDoctor');
                } else if (visibleResponsible) {
                    setActiveTab('ResponsibleParty');
                } else {
                    setActiveTab('Insurances');
                }
            } else if (activeTab === 'RefferingDoctor') {
                setActiveTab('ResponsibleParty');
            } else if (activeTab === 'ResponsibleParty') {
                setActiveTab('Insurances');
            } else if (activeTab === 'Insurances') {
                setActiveTab('Eligibility');
            } else if (activeTab === 'Eligibility') {
                setActiveTab('Authorizations');
            } else if (activeTab === 'Authorizations') {
                setActiveTab('Vital Status');
            } else if (activeTab === 'Vital Status') {
                setActiveTab('Balance');
            } else if (activeTab === 'Balance') {
                setActiveTab('Payment');
            }
        }
    }, [updateSuccess, activeTab, visibleReffering, visibleResponsible]);

    return (
        <div>
            <div className=" mt-2 ">
                <Card className="px-2 ">
                    <div className="d-flex justify-content-between pt-2 px-2">
                        <div style={{ borderBottom: '2px solid grey' }}>
                            <ul className="nav nav-underline">
                                {[
                                    'Patient Details',
                                    'Demographics',
                                    ...(visibleReffering ? ['RefferingDoctor'] : []),
                                    ...(visibleResponsible ? ['ResponsibleParty'] : []),
                                    'Insurances',
                                    'Eligibility',
                                    'Authorizations',
                                    'Vital Status',
                                    'Balance',
                                    'Payment',
                                ].map((tab) => (
                                    <li className="nav-item" key={tab}>
                                        <a
                                            className={`nav-link pb-0 tab-font-family me-3 ${
                                                activeTab === tab ? 'active text-primary' : 'text-black'
                                            }`}
                                            onClick={() => handleTabClick(tab)}
                                            style={{ cursor: 'pointer', fontWeight: 600 }}>
                                            {tab}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="">
                            <Button className="cancel-button " onClick={() => navigate(-1)}>
                                Back
                            </Button>
                        </div>
                    </div>

                    <div className=" px-2 scroll-container" style={{ height: '83vh', overflow: 'auto' }}>
                        {activeTab === 'Patient Details' && (
                            <AddPatientDetails
                                setVisibleReffering={setVisibleReffering}
                                visibleResponsible={visibleResponsible}
                                visibleReferring={visibleReffering}
                                setVisibleResponsible={setVisibleResponsible}
                            />
                        )}
                        {activeTab === 'Demographics' && (
                            <AddDemographics
                                patientId={patientId}
                                //  setActiveTab={setActiveTab} setVisibleResponsible={setVisibleReffering}
                            />
                        )}
                        {activeTab === 'Insurances' && <AddInsurance patientId={patientId} />}
                        {activeTab === 'RefferingDoctor' && <AddRefferingDoctor patientId={patientId}  setActiveTab={setActiveTab}/>}
                        {activeTab === 'ResponsibleParty' && <AddResponsibleParty patientId={patientId} setActiveTab={setActiveTab } />}
                        {activeTab === 'Eligibility' && <p>In Progress...</p>}
                        {activeTab === 'Authorizations' && <p>In Progress...</p>}
                        {activeTab === 'Vital Status' && <p>In Progress...</p>}
                        {activeTab === 'Balance' && <p>In Progress...</p>}
                        {activeTab === 'Payment' && <p>In Progress...</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AddNewPatient;
