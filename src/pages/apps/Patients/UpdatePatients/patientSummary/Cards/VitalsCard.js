import React, { useCallback, useEffect, useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { MdAddCircleOutline, MdOutlinePrint } from 'react-icons/md';
import { FaHeartbeat } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { handlePrintVitals } from 'helpers/printVitals';
import { useSelector, useDispatch } from 'react-redux';
import { getVitalsByPatientIdAction } from 'redux/actions';
import Spinner from 'constants/Spinner';
import VitalsModal from './VitalsModal';

// Helper function to get vital value
const getVitalValue = (data) => {
    if (data.valueString) return data.valueString;
    if (data.valueQuantity?.value) {
        return `${data.valueQuantity.value} ${data.valueQuantity.unit || ''}`;
    }
    if (data.valueBoolean !== undefined) {
        return data.valueBoolean ? 'Yes' : 'No';
    }
    return null;
};

// Helper function to get blood pressure reading
const getBPReading = (component) => {
    if (!component?.length) return null;

    const systolic = component.find(c => c.code?.coding?.[0]?.code === '8480-6')?.valueQuantity?.value;
    const diastolic = component.find(c => c.code?.coding?.[0]?.code === '8462-4')?.valueQuantity?.value;

    return `${systolic || 'N/A'} / ${diastolic || 'N/A'}`;
};

// Vitals display component
const VitalsDisplay = ({ vitalsData }) => {
    const vitals = vitalsData?.vitals;

    if (!vitals?.length) {
        return (
            <div className="h-100 d-flex align-items-center justify-content-center bg-white fs-6">
                <div className="fw-bold text-nowrap">No Vitals Found</div>
            </div>
        );
    }

    return (
        <div className="vitals-grid fs-6">
            {vitals.map((data) => {
                const codeDisplay = data.code?.coding?.[0]?.display || 'Unknown Vital';
                const value = getVitalValue(data);
                const bpReading = !value ? getBPReading(data.component) : null;

                return (
                    <div key={data._id} className="vital-item">
                        <span className="text-muted">{codeDisplay}</span>
                        <div className="fw-bold">{value || bpReading || 'N/A'}</div>
                    </div>
                );
            })}
        </div>
    );
};

const VitalsCard = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [effectiveDateTime, setEffectiveDateTime] = useState('');
    const [vitalsModal, setVitalsModal] = useState(false);

    const patientId = searchParams.get('id');

    const {
        getVitalsByPatientIdReducer,
        getPatientByIdReducer,
        createVitalsReducer,
        updateVitalsReducer
    } = useSelector((state) => state);

    const patientVitalsData = getVitalsByPatientIdReducer?.data?.data?.[0];
    const patientDetails = getPatientByIdReducer?.data?.data;
    const isLoading = getVitalsByPatientIdReducer?.loading;
    const createVitalsStatus = createVitalsReducer?.data?.status;
    const updateVitalsStatus = updateVitalsReducer?.data?.status;

    // Set initial effectiveDateTime from patientVitals data
    useEffect(() => {
        if (!effectiveDateTime) {
            const today = new Date().toISOString().split('T')[0];
            setEffectiveDateTime(today);
        }
    }, [effectiveDateTime]);

    useEffect(() => {
        if (patientVitalsData?.effectiveDateTime && !effectiveDateTime) {
            const formattedDate = new Date(patientVitalsData.effectiveDateTime).toISOString().split('T')[0];
            setEffectiveDateTime(formattedDate);
        }
    }, [patientVitalsData?.effectiveDateTime, effectiveDateTime]);

    useEffect(() => {
        if (patientId && effectiveDateTime) {
            dispatch(getVitalsByPatientIdAction({
                patientId,
                limit: 5,
                effectiveDateTime
            }));
        }
    }, [dispatch, patientId, effectiveDateTime]);

    // Monitor vitals creation and update success
    useEffect(() => {
        if (createVitalsStatus === 201 || updateVitalsStatus === 200) {
            // Refresh vitals data when vitals are created or updated
            setTimeout(() => {
                dispatch(getVitalsByPatientIdAction({
                    patientId,
                    limit: 5,
                    effectiveDateTime
                }));
            }, 1000);
        }
    }, [createVitalsStatus, updateVitalsStatus, dispatch, patientId, effectiveDateTime]);

    const closeVitalsModal = useCallback(() => {
        setVitalsModal(false);
        // Refresh vitals data when modal closes using current effectiveDateTime
        dispatch(getVitalsByPatientIdAction({
            patientId,
            limit: 5,
            effectiveDateTime
        }));
    }, [dispatch, patientId, effectiveDateTime]);
    
    const handleModalDateChange = useCallback((newDate) => {
        setEffectiveDateTime(newDate);
        // Refresh vitals data for the new date
        dispatch(getVitalsByPatientIdAction({
            patientId,
            limit: 5,
            effectiveDateTime: newDate
        }));
    }, [dispatch, patientId]);

    const handleDateChange = useCallback((e) => {
        const selectedDate = e.target.value;
        setEffectiveDateTime(selectedDate);
    }, []);

    const handlePrint = useCallback(() => {
        handlePrintVitals({
            vitals: getVitalsByPatientIdReducer?.data?.data,
            patientDetails,
        });
    }, [getVitalsByPatientIdReducer?.data?.data, patientDetails]);

    const handleAddVitals = useCallback(() => {
        setVitalsModal(true);
    }, []);
    return (
        <>
            <Card className="h-100 shadow-sm">
                <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                    <div className="d-flex align-items-center">
                        <FaHeartbeat className="me-2 text-secondary" />
                        <span className="fw-bold fs-6">Vitals</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <input
                            className="fs-6 fw-semibold bg-white px-1 me-1 border border-1 border-muted"
                            type="date"
                            value={effectiveDateTime}
                            onChange={handleDateChange}
                            title="Filter vitals by date"
                        />
                        <MdAddCircleOutline
                            onClick={handleAddVitals}
                            className="text-primary me-2 cursor-pointer"
                            title="Add new vitals"
                        />
                        <MdOutlinePrint
                            onClick={handlePrint}
                            className="text-secondary cursor-pointer"
                            title="Print vitals"
                        />
                    </div>
                </Card.Header>
                <Card.Body className="  p-2 scroll-container" style={{ height: '22vh' }}>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center w-100 p-5 h-100">
                            <Spinner className="spinner-border-sm" />
                        </div>
                    ) : (
                        <VitalsDisplay vitalsData={patientVitalsData} />
                    )}
                </Card.Body>
            </Card>

            <Modal show={vitalsModal} scrollable onHide={closeVitalsModal} size="xl" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title>
                        {effectiveDateTime === new Date().toISOString().split('T')[0] ? 'Add Vitals' : 'Add/Edit Vitals'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-2">
                    <VitalsModal 
                        onClose={closeVitalsModal} 
                        initialDate={effectiveDateTime}
                        onDateChange={handleModalDateChange}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default VitalsCard;
