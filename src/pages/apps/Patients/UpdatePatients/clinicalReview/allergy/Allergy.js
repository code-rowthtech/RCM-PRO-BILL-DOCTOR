import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAllergiesAction, getAllergiesAction } from '../../../../../../redux/allergies/actions';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../../../../../../constants/Spinner';
import AllergyModal from './AllergyModal';
import DeletionModal from 'helpers/DeletionModal';

const Allergy = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [deletionId, setDeletionId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [allergyModal, setAllergyModal] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState(null);
    const [skip] = useState(1);
    
    const patientId = searchParams.get('id');
    
    const { getAllergiesReducer, deleteAllergiesReducer } = useSelector((state) => state);
    const allergiesData = getAllergiesReducer?.data?.allergies;
    const deleteStatus = deleteAllergiesReducer?.data?.status;
    const isLoading = getAllergiesReducer?.loading;
    useEffect(() => {
        if (patientId) {
            dispatch(getAllergiesAction({ patientId, skip }));
        }
    }, [dispatch, patientId, skip]);

    const handleCloseModal = useCallback(() => {
        setAllergyModal(false);
        setSelectedAllergy(null);
    }, []);
    
    const handleDelete = useCallback(() => {
        dispatch(deleteAllergiesAction({ id: deletionId }));
    }, [dispatch, deletionId]);
    
    const closeDeleteModal = useCallback(() => {
        setDeleteModal(false);
    }, []);
    
    const handleEditAllergy = useCallback((allergyId) => {
        setAllergyModal(true);
        setSelectedAllergy(allergyId);
    }, []);
    
    const handleDeleteAllergy = useCallback((allergyId) => {
        setDeletionId(allergyId);
        setDeleteModal(true);
    }, []);

    useEffect(() => {
        if (deleteStatus === 200) {
            dispatch(getAllergiesAction({ patientId, skip }));
            setDeleteModal(false);
        }
    }, [deleteStatus, dispatch, patientId, skip]);


    return (
        <Row>
            <Col sm={12}>
                <Table responsive className="table-centered table-nowrap mb-0">
                    <thead className="text-white bg-dark">
                        <tr key="">
                            {['S.No.', 'Clinical Status', 'Category', 'Allergy', 'Date', 'Action']?.map(
                                (data, index) => (
                                    <th key={index}>{data}</th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center my-5">
                                    <Spinner />
                                </td>
                            </tr>
                        ) : allergiesData?.length ? (
                            allergiesData.map((data, index) => {
                                const displayText = data.code?.coding?.[0]?.display;
                                const truncatedDisplay = displayText?.length > 30 
                                    ? `${displayText.slice(0, 29)}...` 
                                    : displayText || 'N/A';
                                const formattedDate = data.onset?.onsetDateTime 
                                    ? new Date(data.onset.onsetDateTime).toISOString().split('T')[0] 
                                    : 'N/A';
                                    
                                return (
                                    <tr key={data._id || index}>
                                        <td className="text-capitalize">{index + 1}.</td>
                                        <td className="text-capitalize">
                                            {data.clinicalStatus?.coding?.[0]?.display || 'N/A'}
                                        </td>
                                        <td className="text-capitalize">{data.category?.[0]?.display || 'N/A'}</td>
                                        <td className="text-capitalize" title={displayText}>
                                            {truncatedDisplay}
                                        </td>
                                        <td className="text-capitalize">{formattedDate}</td>
                                        <td>
                                            <i
                                                className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                onClick={() => handleEditAllergy(data._id)}
                                            />
                                            &nbsp;
                                            <i
                                                className="bi bi-trash-fill text-danger cursor-pointer"
                                                onClick={() => handleDeleteAllergy(data._id)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center my-5">
                                    <h5>No Allergies Found</h5>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Col>
            <AllergyModal show={allergyModal} closeModal={handleCloseModal} allergyId={selectedAllergy} />
            <DeletionModal
                show={deleteModal}
                onHide={closeDeleteModal}
                onConfirm={handleDelete}
                item={'selected allergy'}
                isLoading={deleteAllergiesReducer?.loading}
            />
        </Row>
    );
};

export default Allergy;
