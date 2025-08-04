import Spinner from 'constants/Spinner';
import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap';
import { FaUserMd } from 'react-icons/fa';
import { MdAddCircleOutline, MdOutlinePrint } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getFamilyGeneticAction, getTobaccooAction } from 'redux/socialHistory/action';

const SocialHistoryCard = () => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const tobaccoHistory = store?.getTobaccooReducer?.data?.data?.tobaccoHistory || [];
    const familyGeneticHistory = store?.getFamilyGeneticReducer?.data?.familyMedicalHistory || [];
    const socialHistoryData = [...tobaccoHistory.slice(0, 2), ...familyGeneticHistory.slice(0, 2)];
    useEffect(() => {
        // if (!familyGeneticHistory?.length) {
        dispatch(getFamilyGeneticAction({ patientId }));
        // }
        // if (!tobaccoHistory?.length) {
        dispatch(getTobaccooAction({ patientId: patientId }));
        // }
    }, [dispatch])
    return (
        <Card className="h-100 shadow-sm">
            <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                    <FaUserMd className="me-2 text-secondary" />
                    <span className="fw-bold fs-6">Social History</span>
                </div>
                <div>
                    {/* <MdAddCircleOutline
                        className="text-primary me-2 cursor-pointer"
                    /> */}
                    <MdOutlinePrint
                        className="text-secondary cursor-pointer"
                        title="Print all social history"
                    />
                </div>
            </Card.Header>
            <Card.Body className="p-2 pb-0 summary-card-body scroll-container">
                {store?.getFamilyGeneticReducer?.loading && store?.getTobaccooReducer?.loading ? (
                    <div className="d-flex align-items-center justify-content-center w-100 h-100">
                        <Spinner className="spinner-border-sm" />
                    </div>
                ) : socialHistoryData?.length > 0 ? (
                    socialHistoryData?.map((data, index) => (
                        <div
                            className="social-history-item  py-2 d-flex align-items-center justify-content-between"
                            key={index}>
                            <span className="text-muted fs-6">
                                {data?.tobaccoUse || data?.condition?.[0]?.code?.coding?.[0]?.display}
                            </span>
                            <div className="fs-6 fw-semibold">
                                {data?.effectiveDateTime
                                    ? new Date(data?.effectiveDateTime)?.toLocaleDateString('en-GB')
                                    : '' || data?.deceasedDate
                                        ? new Date(data?.deceasedDate)?.toLocaleDateString('en-GB')
                                        : '' || 'N/A'}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="fs-6  d-flex h-100 justify-content-center align-items-center">
                        <strong>No Social History Found</strong>
                    </div>
                )}
            </Card.Body>
            {/* <div
                className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline">
                Go To Social History
            </div> */}
        </Card>
    )
}

export default SocialHistoryCard