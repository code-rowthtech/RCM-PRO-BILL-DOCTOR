import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { clinicalReviewTabs } from '../../../../../utils/patientChartUiData';
import Allergy from './allergy/Allergy';
import Medications from './medications/Medications';
import Vitals from './vitals/Vitals';
import Problems from './problems/Problems';
import { MdAddCircleOutline } from 'react-icons/md';
import AllergyModal from './allergy/AllergyModal';
import ProblemsModal from './problems/ProblemsModal';
import MedicationsModal from './medications/MedicationsModal';

const ClinicalReview = ({ selectedMainTab }) => {

    const [activeTab, setActiveTab] = useState('Allergy List');
    const handleTabClick = (tab) => setActiveTab(tab);
    const [allergyModal, setAllergyModal] = useState(false);
    const [problemsModal, setProblemsModal] = useState(false);
    const [medicationModal, setMedicationModal] = useState(false);
    const handleAddIconClick = () => {
        if (activeTab === 'Allergy List') {
            setAllergyModal(true);
        } else if (activeTab === 'Problems List') {
            setProblemsModal(true)
        } else if (activeTab === 'Medication List') {
            setMedicationModal(true)
        }
    }

    const handleCloseModal = () => {
        if (activeTab === 'Allergy List') {
            setAllergyModal(false);
        } else if (activeTab === 'Problems List') {
            setProblemsModal(false);
        } else if (activeTab === 'Medication List') {
            setMedicationModal(false)
        }
    }

    useEffect(() => {
        if (selectedMainTab && selectedMainTab !== activeTab) {
            setActiveTab(selectedMainTab);
        }
    }, [selectedMainTab]);
    return (
        <Row>
            <Col sm={12} className='d-flex align-items-center justify-content-between'>
                <ul className="nav nav-underline d-flex gap-2">

                    {clinicalReviewTabs?.map((data, index) => (
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
                <MdAddCircleOutline
                    size={22}
                    className="text-primary mt-1 cursor-pointer"
                    onClick={handleAddIconClick}
                    style={{ flexShrink: 0 }}
                />
            </Col>
            <Col sm={12} className='py-1'>
                {activeTab === 'Allergy List' && <Allergy />}
                {activeTab === 'Medication List' && <Medications />}
                {activeTab === 'Vitals List' && <Vitals />}
                {activeTab === 'Problem List' && <Problems />}
            </Col>
            <AllergyModal show={allergyModal} closeModal={handleCloseModal} />
            <ProblemsModal show={problemsModal} closeModal={handleCloseModal} />
            <MedicationsModal show={medicationModal} closeModal={handleCloseModal} />
        </Row>
    )
}

export default ClinicalReview;