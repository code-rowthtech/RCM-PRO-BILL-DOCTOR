import React, { useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { MdAddCircleOutline, MdOutlinePrint } from 'react-icons/md';
import { FaHeartbeat } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handlePrintVitals } from 'helpers/printVitals';
import { useSelector } from 'react-redux';
import { getVitalsByPatientIdAction } from 'redux/actions';
import { useDispatch } from 'react-redux';
import VitalStatus from 'pages/apps/Patients/VitalStatus';
import Spinner from 'constants/Spinner';

const VitalsCard = () => {
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data?.[0];
    const dispatch = useDispatch();
        const patientDetails = store?.getPatientByIdReducer?.data?.data;

    const [effectiveDateTime, setEffectiveDateTime] = useState('');
    const [vitalsModal, setVitalsModal] = useState(false);
    const closeVitalsModal = () => {
        setVitalsModal(false);
        dispatch(getVitalsByPatientIdAction({ patientId, effectiveDateTime: effectiveDateTime, limit: 7 }));
    };

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
                            onChange={(e) => {
                                //  setEffectiveDateTime()
                                dispatch(
                                    getVitalsByPatientIdAction({
                                        patientId,
                                        effectiveDateTime: e.target.value,
                                        limit: 5,
                                    })
                                );
                            }}
                        />
                        <MdAddCircleOutline
                            onClick={() => setVitalsModal(true)}
                            className="text-primary me-2 cursor-pointer"
                        />
                        <MdOutlinePrint
                            onClick={() =>
                                handlePrintVitals({
                                    vitals: store?.getVitalsByPatientIdReducer?.data?.data,
                                    patientDetails: patientDetails,
                                })
                            }
                            className="text-secondary cursor-pointer"
                        />
                    </div>
                </Card.Header>
                <Card.Body className="  p-2 scroll-container" style={{ height: '22vh' }}>
                    {store?.getVitalsByPatientIdReducer?.loading ? (
                        <div
                            className="d-flex justify-content-center align-items-center w-100 p-5"
                            style={{ height: '100%' }}>
                            <Spinner className="spinner-border-sm" />
                        </div>
                    ) : (
                        <div
                            className={`${!patientVitals?.vitals || patientVitals.vitals.length === 0 ? 'h-100 d-flex align-items-center justify-content-center bg-white' : 'vitals-grid'} fs-6`}>
                            {!patientVitals?.vitals || patientVitals.vitals.length === 0 ? (
                                <div
                                    className="fw-bold  w-100 h-100 text-nowrap d-flex align-items-center justify-content-center fs-6"
                                    style={{ height: '100%', width: '100%' }}>
                                    No Vitals Found
                                </div>
                            ) : (
                                patientVitals.vitals.map((data) => {
                                    const codeDisplay = data?.code?.coding?.[0]?.display || 'Unknown Vital';

                                    const value =
                                        data?.valueString ??
                                        (data?.valueQuantity?.value
                                            ? `${data.valueQuantity.value} ${data.valueQuantity.unit || ''}`
                                            : null) ??
                                        (data?.valueBoolean !== undefined ? (data.valueBoolean ? 'Yes' : 'No') : null);

                                    let bpReading = null;
                                    if (data.component && !value) {
                                        const systolic = data.component.find(
                                            (c) => c.code?.coding?.[0]?.code === '8480-6'
                                        )?.valueQuantity?.value;
                                        const diastolic = data.component.find(
                                            (c) => c.code?.coding?.[0]?.code === '8462-4'
                                        )?.valueQuantity?.value;
                                        bpReading = `${systolic || 'N/A'} / ${diastolic || 'N/A'}`;
                                    }

                                    return (
                                        <div key={data?._id} className="vital-item">
                                            <span className="text-muted">{codeDisplay}</span>
                                            <div className="fw-bold">{value || bpReading || 'N/A'}</div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={vitalsModal} onHide={closeVitalsModal} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title className="">Add Vitals</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <VitalStatus unitSystem={'imperial'} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default VitalsCard;
