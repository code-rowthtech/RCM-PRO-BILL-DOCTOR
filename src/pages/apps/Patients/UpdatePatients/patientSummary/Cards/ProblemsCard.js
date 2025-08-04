import React, { useEffect, useState } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { MdAddCircleOutline, MdOutlinePrint } from 'react-icons/md';
import { FaProcedures } from 'react-icons/fa';
import { handlePrintProblems } from '../../PDFfiles/problemPDF';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Spinner from 'constants/Spinner';
import { getProblemsAction } from 'redux/actions';
import ProblemsModal from '../../clinicalReview/problems/ProblemsModal';

const ProblemsCard = () => {
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const [problemModal, setProblemModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const problemData = store?.getProblemsReducer?.data?.problems;
    const handleAddProblemOpen = () => setProblemModal(true);

    useEffect(() => {
        dispatch(getProblemsAction({ patientId: patientId }));
    }, [patientId]);
    const handleCloseModal = () => {
        setProblemModal(false);
        setSelectedProblem(null);
    };
    return (
        <>
            <Card className="h-100 shadow-sm">
                <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                    <div className="d-flex align-items-center">
                        <FaProcedures className="me-2 text-secondary" />
                        <span className="fw-bold fs-6">Problems</span>
                    </div>
                    <div>
                        <MdAddCircleOutline
                            className="text-primary me-2 cursor-pointer"
                            onClick={handleAddProblemOpen}
                        />
                        <MdOutlinePrint
                            className="text-secondary cursor-pointer"
                            onClick={() => handlePrintProblems({ patientDetails, problemData })}
                        />
                    </div>
                </Card.Header>
                <Card.Body className="p-2">
                    {store?.getProblemListReducer?.loading ? (
                        <div
                            className="d-flex justify-content-center align-items-center w-100 p-5"
                            style={{ height: '100%' }}>
                            <Spinner className="spinner-border-sm" />
                        </div>
                    ) : problemData && problemData.length > 0 ? (
                        <ul className="list-unstyled pb-0 mb-0">
                            {problemData?.slice(0, 4)?.map((problem, index) => (
                                <li key={index} className="mb-2 d-flex justify-content-between align-items-start">
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
                        <ul
                            className="list-unstyled d-flex align-items-center justify-content-center"
                            style={{ height: '100%', width: '100%' }}>
                            <li className="mb-2">
                                <div className="fs-6  d-flex justify-content-between align-items-center">
                                    <strong>No Problems Found</strong>
                                </div>
                            </li>
                        </ul>
                    )}
                </Card.Body>
                {/* <div
                    className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline"
                onClick={() => setSelectedMainTab('Problem List')}
                >
                    Go To Problem List
                </div> */}
            </Card>
            <ProblemsModal show={problemModal} closeModal={handleCloseModal} problemId={selectedProblem} />
        </>
    );
};

export default ProblemsCard;
