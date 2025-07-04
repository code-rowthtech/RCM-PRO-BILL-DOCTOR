import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { deleteProblemsAction, getProblemById, getProblemsAction } from 'redux/actions';
import Spinner from '../../../../../../constants/Spinner';
import Paginations from 'helpers/Paginations';
import DeletionModal from 'helpers/DeletionModal';
import { useSelector } from 'react-redux';
import ProblemsModal from './ProblemsModal';

const Problems = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const [problemModal, setProblemModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletionId, setDeletionId] = useState(null);
    const [skip, setSkip] = useState(1);
    const store = useSelector((state) => state);
    const problemList = store?.getProblemsReducer?.data?.problems;
    console.log(store?.getProblemsReducer,'store?.getProblemListReducer')
    const isLoading = store?.getProblemsReducer?.loading;
    const deleteResponse = store?.deleteProblemsReducer?.data?.status;

    useEffect(() => {
        dispatch(getProblemsAction({ patientId, skip }));
    }, [dispatch, patientId, skip]);

    const handleEditClick = (problem) => {
        setSelectedProblem(problem);
        setIsEditMode(true);
        setProblemModal(true);
    };

    // delete function
    const handleDelete = () => {
        dispatch(deleteProblemsAction({ id: deletionId }));
    };
    
 const handleCloseModal = () => {
        setProblemModal(false);
        setSelectedProblem(null);
    };
    useEffect(() => {
        if (deleteResponse === 200) {
            dispatch(getProblemsAction({ patientId, skip: 1 }));
            setDeleteModal(false);
        }
    }, [deleteResponse, dispatch, patientId]);

    const closeDeleteModal = () => {
        setDeleteModal(false);
    };
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
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
                            problemList?.map((data, index) => (
                                <tr key={data.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{data?.code?.coding?.[0]?.display || 'N/A'}</td>
                                    <td>{data?.code?.coding?.[0]?.code || 'N/A'}</td>
                                    <td>{new Date(data?.onsetDateTime).toLocaleDateString('en-GB')}</td>
                                    <td>{data.clinicalStatus?.coding?.[0]?.display || 'N/A'}</td>
                                    <td>
                                        <i
                                            className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                            onClick={() => {
                                                handleEditClick(data);
                                                const requestData = {
                                                    id: data?._id,
                                                };
                                                dispatch(getProblemById(requestData));
                                            }}
                                        />
                                        &nbsp;
                                        <i
                                            className="bi bi-trash-fill text-danger cursor-pointer"
                                            onClick={() => {
                                                setDeletionId(data?._id);
                                                setDeleteModal(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))
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
                        totalPages={store?.getProblemListReducer?.data?.pagination?.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <ProblemsModal show={problemModal} closeModal={handleCloseModal} problemId = {selectedProblem}/>
            <DeletionModal
                show={deleteModal}
                onHide={closeDeleteModal}
                onConfirm={handleDelete}
                item={'problem'}
                isLoading={store?.deleteProblemsReducer?.loading}
            />
        </Row>
    );
};

export default Problems;
