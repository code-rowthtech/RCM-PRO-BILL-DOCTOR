import Spinner from 'constants/Spinner';
import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdAddCircleOutline, MdOutlinePrint } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getEncounterAction } from 'redux/actions';

const RecentEncountersCard = ({ activeKey }) => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const encounterData = store?.getEncounterReducer?.data?.encounters;
    useEffect(() => {
        // if (!encounterData?.length) {
        dispatch(getEncounterAction({ patientId: id, skip: 1 }));
        // }
    }, [dispatch]);

    return (
        <Card className="shadow-sm" style={{ height: activeKey === '0' ? '29vh' : '37vh' }}>
            <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2 text-secondary" />
                    <span className="fw-bold fs-6">Recent Encounters</span>
                </div>
                <div>
                    <MdAddCircleOutline
                        className="text-primary me-2 cursor-pointer"
                    />
                    <MdOutlinePrint
                        className="text-secondary cursor-pointer"
                        title="Print all social history"
                    />
                </div>
            </Card.Header>
            <Card.Body className="p-2 pb-0 summary-card-body scroll-container">
                <ul className="list-unstyled h-100">
                    {store?.getEncounterReducer?.loading ? (
                        <li className="d-flex align-items-center justify-content-center w-100 h-100">
                            <Spinner className="spinner-border-sm" />
                        </li>
                    ) : encounterData?.length > 0 ? (
                        encounterData.map((data, index) => (
                            <li
                                key={index}
                                className="mb-2 d-flex fs-6 justify-content-between align-items-center">
                                <div className="d-flex flex-column">
                                    <strong className="text-capitalize">
                                        {data?.type?.[0]?.coding?.[0]?.display || 'Unknown Type'}
                                    </strong>
                                    <small className="text-muted fs-6">
                                        {data?.period?.start
                                            ? new Date(data.period.start).toISOString().split('T')[0]
                                            : 'No Date'}
                                    </small>
                                </div>
                                <p className="text-muted fw-semibold text-capitalize">
                                    {data?.status || 'Unknown Status'}
                                </p>
                            </li>
                        ))
                    ) : (
                        <div className="fs-6  d-flex h-100 justify-content-center align-items-center">
                            <strong>No Encounters Found</strong>
                        </div>

                    )}
                </ul>
            </Card.Body>
            {/* <div
                className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline">
                Go To Social History
            </div> */}
        </Card>
    )
}

export default RecentEncountersCard;