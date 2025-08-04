import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { deleteProblemsAction, getProblemById, getProblemsAction } from 'redux/actions';
import Spinner from '../../../../../../constants/Spinner';
import Paginations from 'helpers/Paginations';
import DeletionModal from 'helpers/DeletionModal';
import ProblemsModal from './ProblemsModal';

const Problems = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [problemModal, setProblemModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletionId, setDeletionId] = useState(null);
    const [skip, setSkip] = useState(1);
    
    const patientId = searchParams.get('id');
    
    const { getProblemsReducer, deleteProblemsReducer, getProblemListReducer } = useSelector((state) => state);
    const problemList = getProblemsReducer?.data?.problems;
    const isLoading = getProblemsReducer?.loading;
    const deleteResponse = deleteProblemsReducer?.data?.status;
    const totalPages = getProblemListReducer?.data?.pagination?.totalPages;

    useEffect(() => {
        if (patientId) {
            dispatch(getProblemsAction({ patientId, skip }));
        }
    }, [dispatch, patientId, skip]);

    const handleEditClick = useCallback((problem) => {
        setSelectedProblem(problem);
        setProblemModal(true);
        dispatch(getProblemById({ id: problem._id }));
    }, [dispatch]);

    const handleDelete = useCallback(() => {
        dispatch(deleteProblemsAction({ id: deletionId }));
    }, [dispatch, deletionId]);
    
    const handleCloseModal = useCallback(() => {
        setProblemModal(false);
        setSelectedProblem(null);
    }, []);
    
    const closeDeleteModal = useCallback(() => {
        setDeleteModal(false);
    }, []);
    
    const handleDeleteClick = useCallback((problemId) => {
        setDeletionId(problemId);
        setDeleteModal(true);
    }, []);
    
    const handlePageChange = useCallback((pageNumber) => {
        setSkip(pageNumber);
    }, []);

    useEffect(() => {
        if (deleteResponse === 200) {
            dispatch(getProblemsAction({ patientId, skip: 1 }));
            setDeleteModal(false);
        }
    }, [deleteResponse, dispatch, patientId]);
    return (
        <Row>
            <Col sm={12}>
                <Table responsive className="table-centered table-nowrap mb-0">
                    <thead className="text-white bg-dark">
                        <tr key="">
                            {['S.No.', 'Problem', 'ICD-CM Code', 'Diagnosed Date', 'Status', 'Action']?.map(
                                (data, index) => (
                                    <th key={index}>{data}</th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td className="text-center" colSpan={10}>
                                    <Spinner className="my-5" />
                                </td>
                            </tr>
                        ) : problemList?.length > 0 ? (
                            problemList.map((data, index) => {
                                const formattedDate = data.onsetDateTime 
                                    ? new Date(data.onsetDateTime).toLocaleDateString('en-GB') 
                                    : 'N/A';
                                    
                                return (
                                    <tr key={data._id || index}>
                                        <td>{index + 1}</td>
                                        <td>{data.code?.coding?.[0]?.display || 'N/A'}</td>
                                        <td>{data.code?.coding?.[0]?.code || 'N/A'}</td>
                                        <td>{formattedDate}</td>
                                        <td>{data.clinicalStatus?.coding?.[0]?.display || 'N/A'}</td>
                                        <td>
                                            <i
                                                className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                onClick={() => handleEditClick(data)}
                                            />
                                            &nbsp;
                                            <i
                                                className="bi bi-trash-fill text-danger cursor-pointer"
                                                onClick={() => handleDeleteClick(data._id)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center">
                                    <h5 className="my-5">No Problems Found!</h5>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Col>
            <div className="col-12">
                <div className="mt-2 d-flex justify-content-end">
                    <Paginations
                        currentPage={skip}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <ProblemsModal show={problemModal} closeModal={handleCloseModal} problemId={selectedProblem}/>
            <DeletionModal
                show={deleteModal}
                onHide={closeDeleteModal}
                onConfirm={handleDelete}
                item={'problem'}
                isLoading={deleteProblemsReducer?.loading}
            />
        </Row>
    );
};

export default Problems;
