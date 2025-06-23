import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { PatientDemographicTabs } from '../../../../../utils/patientChartUiData';
import PatientDetails from './PatientDetails';
import Demographics from './Demographics';
import ResponsibleParty from './ResponsibleParty';
import ReferringDoctor from './ReferringDoctor';

const PatientDemographics = () => {
    const [activeTab, setActiveTab] = useState('Patient Details');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    }
    return (
        <Row>
            <Col sm={12}>
                <ul className="nav nav-underline d-flex gap-2">
                    {PatientDemographicTabs?.map((data, index) => (
                        <li key={index}>
                            <span
                                className={`nav-link text-secondary fs-6 pb-1 ${activeTab === data ? 'active fw-bold' : ''
                                    }`}
                                onClick={() => {
                                    handleTabClick(data)
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                {data}
                            </span>
                        </li>
                    ))}
                </ul>
            </Col>
            <Col sm={12} className='mt-1 px-0' style={{ height: '62vh' }}>
                {activeTab === 'Patient Details' && <PatientDetails />}
                {activeTab === 'Demographics' && <Demographics />}
                {activeTab === 'Responsible Party' && <ResponsibleParty />}
                {activeTab === 'Reffering Doctor' && <ReferringDoctor />}
            </Col>
        </Row>
    )
}

export default PatientDemographics;