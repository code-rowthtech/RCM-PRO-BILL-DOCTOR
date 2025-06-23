import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { socialHistoryTabs } from '../../../../../utils/patientChartUiData';
import TobaccoHistory from './tobacco/TobaccoHistory';
import MedicalHistory from './medical/MedicalHistory';
import SurgicalHistory from './surgical/SurgicalHistory';
import FamilyHistory from './familyGenertics/FamilyHistory';
import AlcoholHistory from './alcohol/AlcoholHistory';

const SocialHistory = ({ selectedMainTab, setSelectedMainTab }) => {
    const [activeTab, setActiveTab] = useState('Tobacco');
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectedMainTab(tab);
    }

    useEffect(() => {
        if (selectedMainTab && selectedMainTab !== activeTab) {
            setActiveTab(selectedMainTab);
        }
    }, [selectedMainTab]);
    return (
        <Row>
            <Col sm={12}>
                <ul className="nav nav-underline d-flex gap-2">
                    {socialHistoryTabs?.map((data, index) => (
                        <li key={index}>
                            <span
                                className={`nav-link text-secondary fs-6 pb-1 ${activeTab === data ? 'active fw-bold' : ''
                                    }`}
                                onClick={() => {
                                    handleTabClick(data)
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                {data} History
                            </span>
                        </li>
                    ))}
                </ul>
            </Col>
            <Col sm={12} className='py-1'>
                {activeTab === 'Tobacco' && <TobaccoHistory />}
                {activeTab === 'Medical' && <MedicalHistory />}
                {activeTab === 'Surgical' && <SurgicalHistory />}
                {activeTab === 'Family / Genetic' && <FamilyHistory />}
                {activeTab === 'Alcohol' && <AlcoholHistory />}
            </Col>
        </Row>
    )
}

export default SocialHistory;