import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { clinicalReviewTabs } from '../../../../../utils/patientChartUiData';
import Allergy from './allergy/Allergy';
import Medications from './medications/Medications';
import Vitals from './vitals/Vitals';
import Problems from './problems/Problems';
import { MdAddCircleOutline } from 'react-icons/md';
import AllergyModal from './allergy/AllergyModal';
import ProblemsModal from './problems/ProblemsModal';
import MedicationsModal from './medications/MedicationsModal';
import { useDispatch } from 'react-redux';
import { handlePrintVitals } from 'helpers/printVitals';
import { useSelector } from 'react-redux';
import { defaultVitals } from 'utils/DataSets/commonData2';
import { getVitalsByPatientIdAction } from 'redux/actions';
import { useSearchParams } from 'react-router-dom';

const ClinicalReview = ({ selectedMainTab ,activeKey }) => {
    const convertToImperial = (value, vitalName) => {
        if (vitalName === 'Height') return (value / 2.54).toFixed(2); // cm to in
        if (vitalName === 'Weight') return (value * 2.20462).toFixed(2); // kg to lbs
        if (vitalName === 'Temperature') return ((value * 9) / 5 + 32).toFixed(2); // C to F
        if (vitalName === 'Head Circumference') return (value / 2.54).toFixed(2);
        return value;
    };
    const convertFromImperial = (value, vitalName) => {
        if (vitalName === 'Height') return (value * 2.54).toFixed(2); // in to cm
        if (vitalName === 'Weight') return (value / 2.20462).toFixed(2); // lbs to kg
        if (vitalName === 'Temperature') return (((value - 32) * 5) / 9).toFixed(2); // F to C
        if (vitalName === 'Head Circumference') return (value * 2.54).toFixed(2);
        return value;
    };
    const [unitSystem, setUnitSystem] = useState('imperial');
    const [vitals, setVitals] = useState(defaultVitals);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [activeTab, setActiveTab] = useState('Allergy List');
    const patientId = searchParams.get('id');
    const handleTabClick = (tab) => setActiveTab(tab);
    const [currentPage, setCurrentPage] = useState(1);
    const [allergyModal, setAllergyModal] = useState(false);
    const [problemsModal, setProblemsModal] = useState(false);
    const [medicationModal, setMedicationModal] = useState(false);
    const [vitalsModal, setVitalsModal] = useState(false);
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data || [];
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    const handleAddIconClick = () => {
        if (activeTab === 'Allergy List') {
            setAllergyModal(true);
        } else if (activeTab === 'Problem List') {
            setProblemsModal(true);
        } else if (activeTab === 'Medication List') {
            setMedicationModal(true);
        } else if (activeTab === 'Vitals List') {
            setVitalsModal(true);
        }
    };

    const handleCloseModal = () => {
        if (activeTab === 'Allergy List') {
            setAllergyModal(false);
        } else if (activeTab === 'Problem List') {
            setProblemsModal(false);
        } else if (activeTab === 'Medication List') {
            setMedicationModal(false);
        } else if (activeTab === 'Medication List') {
            setVitalsModal(false);
        }
    };

    useEffect(() => {
        if (selectedMainTab && selectedMainTab !== activeTab) {
            setActiveTab(selectedMainTab);
        }
    }, [selectedMainTab]);
    const handleUnitChange = (newSystem) => {
        // Convert all displayed values when unit system changes
        setVitals((prevVitals) => {
            return prevVitals.map((vital) => {
                if (!vital.unitKey) return vital; // Skip vitals that don't need conversion

                // For BP, we don't convert the values (mmHg is standard)
                if (vital.type === 'bp') return vital;

                // For BMI, we don't convert (it's unitless)
                if (vital.name === 'BMI') return vital;

                // Convert the displayed value
                let newValue = vital.value;

                if (unitSystem === 'imperial' && newSystem === 'metric') {
                    // Convert from imperial to metric
                    newValue = convertFromImperial(parseFloat(vital.value), vital.name);
                } else if (unitSystem === 'metric' && newSystem === 'imperial') {
                    // Convert from metric to imperial
                    newValue = convertToImperial(parseFloat(vital.value), vital.name);
                }
                return {
                    ...vital,
                    value: newValue.toString(),
                };
            });
        });
        setUnitSystem(newSystem);
    };

    useEffect(() => {
        if (currentPage !== 1) {
            dispatch(getVitalsByPatientIdAction({ patientId, page: currentPage, limit: 7 }));
        }
    }, [currentPage]);

    const paginationData = store?.getVitalsByPatientIdReducer?.data?.pagination;

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (paginationData && currentPage < paginationData?.totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
        <Row>
            <Col sm={12} className="d-flex align-items-center justify-content-between">
                <ul className="nav nav-underline d-flex gap-2">
                    {clinicalReviewTabs?.map((data, index) => (
                        <li key={index}>
                            <span
                                className={`nav-link text-secondary fs-6 pb-1 ${
                                    activeTab === data ? 'active fw-bold' : ''
                                }`}
                                onClick={() => {
                                    handleTabClick(data);
                                }}
                                style={{ cursor: 'pointer' }}>
                                {data}
                            </span>
                        </li>
                    ))}
                </ul>
                {activeTab !== 'Vitals List' && (
                    <MdAddCircleOutline
                        size={22}
                        className="text-primary cursor-pointer"
                        onClick={handleAddIconClick}
                        style={{ flexShrink: 0 }}
                    />
                )}
                {activeTab === 'Vitals List' && (
                    <div className="col-md-3 d-flex gap-2 align-items-center">
                        <i
                            title="Previous"
                            className={`bi cursor-pointer  ${currentPage === paginationData?.totalPages ? 'text-muted' : 'text-primary'} fw-bold fs-4 bi-skip-backward-circle`}
                            onClick={handleNextPage}
                            disabled={currentPage === paginationData?.totalPages}
                        />
                        <i
                            title="Next"
                            className={`bi cursor-pointer  ${currentPage === 1 ? 'text-muted' : 'text-primary'} fw-bold fs-4 bi-skip-forward-circle`}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        />

                        <span
                            title="Print all vitals"
                            onClick={() => handlePrintVitals({ vitals: patientVitals, patientDetails: patientDetails })}
                            className="uil-print text-primary fs-4 cursor-pointer "
                        />
                        <div className="d-flex gap-1  border-start  ps-2 align-items-center w-100">
                            <span className="fw-semibold fs-6">Units:</span>
                            <Form.Select
                                onChange={(e) => handleUnitChange(e.target.value)}
                                value={unitSystem}
                                className="w-100">
                                <option value="imperial">Imperial</option>
                                <option value="metric">Metric</option>
                            </Form.Select>
                        </div>
                    </div>
                )}
            </Col>
            <Col sm={12} className="py-1">
                {activeTab === 'Allergy List' && <Allergy />}
                {activeTab === 'Medication List' && <Medications />}
                {activeTab === 'Vitals List' && (
                    <Vitals
                        convertToImperial={convertToImperial}
                        convertFromImperial={convertFromImperial}
                        activeKey={activeKey}
                        unitSystem={unitSystem}
                        setUnitSystem={setUnitSystem}
                    />
                )}

                {activeTab === 'Problem List' && <Problems />}
            </Col>
            <AllergyModal show={allergyModal} closeModal={handleCloseModal} />
            <ProblemsModal show={problemsModal} closeModal={handleCloseModal} />
            <MedicationsModal show={medicationModal} closeModal={handleCloseModal} />
        </Row>
    );
};

export default ClinicalReview;
