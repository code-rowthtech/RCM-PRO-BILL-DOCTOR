import Spinner from 'constants/Spinner';
import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { FaPills } from 'react-icons/fa';
import { MdAddCircleOutline, MdOutlinePrint } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getMedicationAction } from 'redux/actions';

const MedicationsCard = ({ activeKey }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const medicationList = store?.getMedicationReducer?.data?.medicationRequests;

    useEffect(() => {
        // if (!medicationList?.length) {
        dispatch(getMedicationAction({ patientId: patientId, skip: 1, limit: 10 }));
        // }
    }, [dispatch])

    const statusColorMap = {
        active: 'text-success',
        'on-hold': 'text-warning',
        cancelled: 'text-danger',
        completed: 'text-primary',
        'entered-in-error': 'text-danger',
        stopped: 'text-secondary',
        draft: 'text-muted',
        unknown: 'text-dark',
    };
    return (
        <Card className="shadow-sm" style={{ height: activeKey === '0' ? '29vh' : '37vh' }}>
            <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                    <FaPills className="me-2 text-secondary" />
                    <span className="fw-bold fs-6">Medications</span>
                </div>
                <div>
                    <MdAddCircleOutline
                        className="text-primary me-2 cursor-pointer"
                    />
                    <MdOutlinePrint
                        className="text-secondary cursor-pointer"
                        title="Print all medications"
                    />
                </div>
            </Card.Header>
            <Card.Body className="p-2 pb-0 summary-card-body scroll-container">
                {store?.getMedicationReducer?.loading ? (
                    <div
                        className="d-flex justify-content-center align-items-center w-100 p-5"
                        style={{ height: '100%' }}>
                        <Spinner className="spinner-border-sm" />
                    </div>
                ) : (
                    <ul className="list-unstyled h-100">
                        {medicationList?.length === 0 || !medicationList ? (
                            <li
                                className="list-unstyled d-flex align-items-center justify-content-center"
                                style={{ height: '100%', width: '100%' }}>
                                <div className="fs-6  d-flex justify-content-between align-items-center">
                                    <strong>No Medications Found</strong>
                                </div>
                            </li>
                        ) : (
                            medicationList?.slice(0, 4)?.map((medication, index) => (
                                <li
                                    key={index}
                                    className="mb-2 d-flex justify-content-between align-items-start">
                                    <div className="fs-6">
                                        <strong
                                            className="text-capitalize"
                                            title={medication?.drugId?.proprietaryName}>
                                            {medication?.drugId?.proprietaryName?.length > 30
                                                ? medication?.drugId?.proprietaryName?.slice(0, 29) + '...'
                                                : medication?.drugId?.proprietaryName}
                                        </strong>
                                        <div
                                            className="text-muted"
                                            title={medication?.drugId?.nonProprietaryName}>
                                            {medication?.drugId?.nonProprietaryName?.length > 40
                                                ? medication?.drugId?.nonProprietaryName?.slice(0, 39) +
                                                '...'
                                                : medication?.drugId?.nonProprietaryName}
                                        </div>
                                        <div
                                            className="text-muted "
                                            title={medication?.dosageInstruction?.[0]?.text}>
                                            {medication?.dosageInstruction?.[0]?.text?.length > 40
                                                ? medication?.dosageInstruction?.[0]?.text?.slice(0, 39) +
                                                '...'
                                                : medication?.dosageInstruction?.[0]?.text || ''}
                                        </div>
                                    </div>
                                    <span
                                        className={`fw-semibold fs-6 text-capitalize ${statusColorMap[medication.status] || 'text-body'}`}>
                                        {medication?.status}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </Card.Body>
            <div
                className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline">
                Go To Medications List
            </div>
        </Card>
    )
};

export default MedicationsCard