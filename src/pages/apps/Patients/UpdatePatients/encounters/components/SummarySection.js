import React, { useEffect, useState, useMemo } from 'react';
import { Accordion, Col, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import './Encounters.css';

import {
    getAllergiesAction,
    getMedicationAction,
    getProblemsAction,
    getVitalsByPatientIdAction
} from 'redux/actions';
import { getFamilyGeneticAction, getTobaccooAction } from 'redux/socialHistory/action';

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_COLOR_MAP = {
    active: 'text-success',
    'on-hold': 'text-warning',
    cancelled: 'text-danger',
    completed: 'text-primary',
    'entered-in-error': 'text-danger',
    stopped: 'text-secondary',
    draft: 'text-muted',
    unknown: 'text-dark'
};

const DEFAULT_MENU_ITEMS = [
    { _id: '2', name: 'Allergy', order: 1, hide: true },
    { _id: '3', name: 'Problems', order: 2, hide: true },
    { _id: '4', name: 'Medications', order: 3, hide: true },
    { _id: '5', name: 'Social History', order: 4, hide: true }
];


const SummarySection = () => {
    // ========================================================================
    // HOOKS & STATE
    // ========================================================================

    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');



    // ========================================================================
    // SELECTORS & DERIVED STATE
    // ========================================================================

    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    const patienteffectiveVitals = store?.getVitalsByPatientIdReducer?.data?.data || [];
    const allergyData = store?.getAllergiesReducer?.data?.allergies;
    const problemData = store?.getProblemsReducer?.data?.problems;
    const medicationList = store?.getMedicationReducer?.data?.medicationRequests;
    const tobaccoHistory = store?.getTobaccooReducer?.data?.data?.tobaccoHistory;
    const familyGeneticHistory = store?.getFamilyGeneticReducer?.data?.familyMedicalHistory;

    // ========================================================================
    // MEMOIZED VALUES
    // ========================================================================

    const summaryItem = useMemo(() =>
        settingsDataMainItems?.find(item => item.name === 'Summary'),
        [settingsDataMainItems]
    );

    const subMenuItems = summaryItem?.subMenu || [];

    const sortedSubMenuItems = useMemo(() =>
        subMenuItems.length > 0
            ? subMenuItems.sort((a, b) => a.order - b.order)
            : DEFAULT_MENU_ITEMS,
        [subMenuItems]
    );

    const socialHistoryData = useMemo(() => ({
        tobaccoHistory: tobaccoHistory?.slice(0, 2) || [],
        familyGeneticHistory: familyGeneticHistory?.slice(0, 2) || []
    }), [tobaccoHistory, familyGeneticHistory]);



    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Initial data fetch - only when patientId is available and data is not loaded
    useEffect(() => {
        if (!patientId) return;

        const shouldFetchVitals = !patienteffectiveVitals?.length;
        const shouldFetchAllergies = !allergyData?.length;
        const shouldFetchProblems = !problemData?.length;
        const shouldFetchMedications = !medicationList?.length;
        const shouldFetchTobacco = !tobaccoHistory?.length;
        const shouldFetchFamily = !familyGeneticHistory?.length;

        if (shouldFetchVitals) {
            dispatch(getVitalsByPatientIdAction({ patientId, limit: 5 }));
        }
        if (shouldFetchAllergies) {
            dispatch(getAllergiesAction({ patientId, skip: 1 }));
        }
        if (shouldFetchProblems) {
            dispatch(getProblemsAction({ patientId }));
        }
        if (shouldFetchMedications) {
            dispatch(getMedicationAction({ patientId, skip: 1, limit: 10 }));
        }
        if (shouldFetchTobacco) {
            dispatch(getTobaccooAction({ patientId }));
        }
        if (shouldFetchFamily) {
            dispatch(getFamilyGeneticAction({ patientId }));
        }
    }, [patientId, patienteffectiveVitals?.length, allergyData?.length, problemData?.length, medicationList?.length, tobaccoHistory?.length, familyGeneticHistory?.length, dispatch]);

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    const getSeverityBadge = (severity) => {
        if (!severity?.code || !severity?.display) return null;

        const variantMap = {
            high: 'danger',
            severe: 'danger',
            moderate: 'warning',
            low: 'info',
            mild: 'info',
        };

        const variant = variantMap[severity.code.toLowerCase()] || 'secondary';
        return <span className={`ms-2 text-${variant}`}>{severity.display}</span>;
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <Col sm={12} className='mt-1'  >
            <Accordion alwaysOpen>
                {sortedSubMenuItems.map((menuItem) => {
                    if (!menuItem?.hide) return null;

                    let content;
                    switch (menuItem.name) {
                        case 'Allergy':
                            content = (
                                <Accordion.Body className='p-2 scroll-container' style={{ height: '20vh' }}>
                                    {allergyData?.length > 0 ? (
                                        <div style={{ height: '30vh' }} className="scroll-container">
                                            {store?.getAllergiesReducer?.loading ? (
                                                <div className="d-flex justify-content-center align-items-center w-100 p-5" style={{ height: '100%' }}>
                                                    <Spinner className="spinner-border-sm" />
                                                </div>
                                            ) : (
                                                <ul className="list-unstyled pb-0 mb-0">
                                                    {allergyData.slice(0, 4).map((allergy, index) => (
                                                        <li key={index} className="mb-2 d-flex justify-content-between align-items-start cursor-pointer" onClick={() => window.populateEncounterField?.('Social History', `Allergy: ${allergy.code?.text || ''} (${allergy.clinicalStatus?.text || 'Status not available'})`)}>
                                                            <div className="fs-6">
                                                                <strong title={allergy.code?.text}>
                                                                    {allergy?.code?.text?.length > 30
                                                                        ? allergy?.code?.text.slice(0, 29) + '...'
                                                                        : allergy?.code?.text || 'Unknown Allergy'}
                                                                </strong>
                                                                <div className="text-muted small">
                                                                    {allergy?.clinicalStatus?.text || 'Status not available'}
                                                                </div>
                                                            </div>
                                                            <span className="fs-6 fw-semibold text-nowrap">
                                                                {getSeverityBadge(allergy?.criticality)}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-muted">No allergies recorded</div>
                                    )}
                                    <div className="row">
                                        <div className="col-12 text-end">
                                            <small className='text-info cursor-pointer'>Add new allergy</small>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            );
                            break;
                        case 'Problems':
                            content = (
                                <Accordion.Body className='p-2 scroll-container' style={{ height: '20vh' }}>
                                    {problemData?.length > 0 ? (
                                        <div style={{ height: '30vh' }} className='scroll-container'>
                                            {store?.getProblemsReducer?.loading ? (
                                                <div className="d-flex justify-content-center align-items-center w-100 p-5" style={{ height: '100%' }}>
                                                    <Spinner className="spinner-border-sm" />
                                                </div>
                                            ) : problemData?.length > 0 ? (
                                                <ul className="list-unstyled pb-0 mb-0">
                                                    {problemData?.slice(0, 4)?.map((problem, index) => (
                                                        <li
                                                            key={index}
                                                            className="mb-2 d-flex justify-content-between align-items-start cursor-pointer"
                                                            onClick={() => window.populateEncounterField?.('Reason for Visit', problem?.code?.text || '')}>
                                                            <div className="fs-6">
                                                                <strong title={problem?.code?.text}>
                                                                    {problem?.code?.text?.length > 30
                                                                        ? problem.code.text.slice(0, 30) + '...'
                                                                        : problem?.code?.text || 'Unknown Problem'}
                                                                </strong>
                                                                <div className="text-muted small">
                                                                    {problem?.clinicalStatus?.text || 'Status not available'}
                                                                </div>
                                                            </div>
                                                            <span className="fs-6 fw-semibold text-success">
                                                                {new Date(problem?.onsetDateTime).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                })}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <ul className="list-unstyled d-flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                                                    <li className="mb-2">
                                                        <div className="fs-6  d-flex justify-content-between align-items-center">
                                                            <strong>No Problems Found</strong>
                                                        </div>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='text-muted'>No problems recorded</div>
                                    )}
                                    <div className="row">
                                        <div className="col-12 text-end">
                                            <small className='text-info cursor-pointer'>Add new problem</small>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            );
                            break;
                        case 'Medications':
                            content = (
                                <Accordion.Body className='p-2 scroll-container' style={{ height: '20vh' }}>
                                    {medicationList?.length > 0 ? (
                                        <div style={{ height: '30vh' }} className='scroll-container'>
                                            {store?.getMedicationReducer?.loading ?
                                                <div className='d-flex justify-content-center align-items-center w-100 p-5' style={{ height: '100%' }}>
                                                    <Spinner className='spinner-border-sm' />
                                                </div>
                                                :
                                                <ul className="list-unstyled h-100">
                                                    {medicationList?.length === 0 || !medicationList ? (
                                                        <li className="list-unstyled d-flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                                                            <div className="fs-6  d-flex justify-content-between align-items-center">
                                                                <strong>No Medications Found</strong>
                                                            </div>
                                                        </li>
                                                    ) : medicationList?.slice(0, 4)?.map((medication, index) => (
                                                        <li key={index} className="mb-2 d-flex justify-content-between align-items-start cursor-pointer" onClick={() => {
                                                            const medicationInfo = `${medication?.drugId?.proprietaryName || ''} ${medication?.drugId?.nonProprietaryName ? '(' + medication?.drugId?.nonProprietaryName + ')' : ''} - ${medication?.dosageInstruction?.[0]?.text || ''} [Status: ${medication?.status || 'Unknown'}]`;
                                                            window.populateEncounterField?.('Prescriptions (Medications)', medicationInfo);
                                                        }}>
                                                            <div className="fs-6">
                                                                <strong className="text-capitalize" title={medication?.drugId?.proprietaryName}>{medication?.drugId?.proprietaryName?.length > 30 ? medication?.drugId?.proprietaryName?.slice(0, 29) + '...' : medication?.drugId?.proprietaryName}</strong>
                                                                <div className="text-muted" title={medication?.drugId?.nonProprietaryName}>
                                                                    {medication?.drugId?.nonProprietaryName?.length > 40 ? medication?.drugId?.nonProprietaryName?.slice(0, 39) + '...' : medication?.drugId?.nonProprietaryName}
                                                                </div>
                                                                <div className="text-muted " title={medication?.dosageInstruction?.[0]?.text}>
                                                                    {medication?.dosageInstruction?.[0]?.text?.length > 40 ? medication?.dosageInstruction?.[0]?.text?.slice(0, 39) + '...' : medication?.dosageInstruction?.[0]?.text || ''}
                                                                </div>
                                                            </div>
                                                            <div className={`fw-semibold fs-6 text-capitalize ${STATUS_COLOR_MAP[medication.status] || 'text-body'}`}>
                                                                <p>{medication?.status}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            }
                                        </div>
                                    ) : (
                                        <div className='text-muted'>No medications recorded</div>
                                    )}
                                    <div className="row">
                                        <div className="col-12 text-end">
                                            <small className='text-info cursor-pointer'>Add new medication</small>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            );
                            break;
                        case 'Social History':
                            content = (
                                <Accordion.Body className='p-2 scroll-container' style={{ height: '20vh' }}>
                                    <div>
                                        <ul className="list-unstyled h-100">
                                            {socialHistoryData?.tobaccoHistory?.length === 0 && socialHistoryData?.familyGeneticHistory?.length === 0 ? (
                                                <li className="list-unstyled d-flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                                                    <div className="fs-6  d-flex justify-content-between align-items-center">
                                                        <strong>No Social History Found</strong>
                                                    </div>
                                                </li>
                                            ) : (
                                                <>
                                                    {socialHistoryData?.tobaccoHistory?.length > 0 && (
                                                        socialHistoryData?.tobaccoHistory?.map((data, index) => (
                                                            <li key={index} className="mb-2 d-flex justify-content-between align-items-start cursor-pointer" onClick={() => window.populateEncounterField?.('Social History', `Tobacco: ${data?.tobaccoUse || ''}`)}>
                                                                <div className="fs-6">
                                                                    <strong className="text-capitalize" title={data?.tobaccoUse}>{data?.tobaccoUse?.length > 40 ? data?.tobaccoUse?.slice(0, 39) + '...' : data?.tobaccoUse}</strong>
                                                                    <div className="text-muted fs-6" >
                                                                        {data?.effectiveDateTime ? new Date(data?.effectiveDateTime)?.toISOString().split('T')[0] : ''}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))
                                                    )}
                                                    {socialHistoryData?.familyGeneticHistory?.length > 0 && (
                                                        socialHistoryData?.familyGeneticHistory?.map((data, index) => (
                                                            <li title='Family Genetics' key={index} className="mb-2 d-flex justify-content-between align-items-start cursor-pointer" onClick={() => window.populateEncounterField?.('Social History', `Family History: ${data?.name || ''} (${data?.relationship?.coding?.[0]?.display || ''})`)}>
                                                                <div className="fs-6">
                                                                    <strong className="text-capitalize" title={data?.name}>{data?.name?.length > 40 ? data?.name?.slice(0, 39) + '...' : data?.name}
                                                                        <span className='ms-1'>
                                                                            {data?.relationship?.coding?.[0]?.display && '(' + data?.relationship?.coding?.[0]?.display + ')'}
                                                                        </span>
                                                                    </strong>
                                                                    <div className="text-muted fs-6" title={data?.condition?.[0]?.code?.text} >
                                                                        {data?.condition?.[0]?.code?.text?.length > 30 ? data?.condition?.[0]?.code?.text?.slice(0, 29) + '...' : data?.condition?.[0]?.code?.text}
                                                                    </div>
                                                                </div>
                                                                <span className={`fw-semibold fs-6 text-capitalize ${STATUS_COLOR_MAP[data.status] || 'text-body'}`}>
                                                                    {data?.status}
                                                                </span>
                                                            </li>
                                                        ))
                                                    )}
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </Accordion.Body>
                            );
                            break;
                        default:
                            return null;
                    }

                    return (
                        <Accordion.Item
                            key={menuItem._id}
                            eventKey={menuItem.order.toString()}
                            className="border-0 mb-2"
                        >
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold fs-6'>{menuItem.name}</span>
                            </Accordion.Header>
                            {content}
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </Col>
    );
};

export default SummarySection;