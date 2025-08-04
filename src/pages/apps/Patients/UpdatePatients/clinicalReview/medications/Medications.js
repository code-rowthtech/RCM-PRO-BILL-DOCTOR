import Paginations from 'helpers/Paginations';
import { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { deleteMedicationAction, getMedicationAction } from 'redux/actions';
import MedicationsModal from './MedicationsModal';
import DeletionModal from 'helpers/DeletionModal';

const Medications = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);

    // STATE VARIABLES
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [medicationModal, setMedicationModal] = useState(false);
    const [skip, setSkip] = useState(1);
    const [deletionId, setDeletionId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);

    // VARIABLES DECLARATIONS
    const medicationList = store?.getMedicationReducer?.data?.medicationRequests;
    const createSuccess = store?.createMedicationReducer?.data?.status;
    const deleteSuccess = store?.deleteMedicationReducer?.data?.status;

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

    // USEEFFECTS
    useEffect(() => {
        if (createSuccess === 201) {
            setSelectedMedication(null);
        }
    }, [createSuccess]);
    useEffect(() => {
        if (deleteSuccess === 200) {
            closeDeletionModal();
            dispatch(getMedicationAction({ patientId: patientId, skip, limit: 10 }));
        }
    }, [deleteSuccess]);

    useEffect(() => {
        dispatch(getMedicationAction({ patientId: patientId, skip, limit: 10 }));
    }, [dispatch, skip]);

    // FUNCTIONS
    const handleEditClick = (data) => {
        setSelectedMedication(data);
        setMedicationModal(true);
    };

    const closeMedicationModal = () => {
        setMedicationModal(false);
        setSelectedMedication(null);
    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    const handleDeleteMedication = () => {
        dispatch(deleteMedicationAction({ medicationId: deletionId }));
    }

    const closeDeletionModal = () => {
        setDeleteModal(false);
        setDeletionId(null);
    }
    return (
        <Row>
            <Col sm={12}>
                <Table responsive className="table-centered table-nowrap mb-0">
                    <thead className="text-white bg-dark">
                        <tr key="">
                            {[
                                'S.No.',
                                'Medication',
                                'Frequency & Duration',
                                'Dosage Instruction',
                                'Start Date',
                                'End Date',
                                'Status',
                                'Action',
                            ]?.map((data, index) => (
                                <th key={index}>{data}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {store?.getMedicationReducer?.loading ? (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    <Spinner />
                                </td>
                            </tr>
                        ) : medicationList?.length > 0 ? (
                            medicationList?.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="text-capitalize">
                                                {' '}
                                                {data?.drugId?.proprietaryName || 'N/A'}
                                            </span>
                                            <small className="text-muted" title={data?.drugId?.nonProprietaryName}>
                                                {' '}
                                                {data?.drugId?.nonProprietaryName?.length > 30
                                                    ? data?.drugId?.nonProprietaryName?.slice(0, 29) + '...'
                                                    : data?.drugId?.nonProprietaryName || 'N/A'}
                                            </small>
                                        </div>
                                    </td>
                                    <td>{data?.dosageInstruction?.[0]?.timing?.code?.text}</td>
                                    <td title={data?.dosageInstruction?.[0]?.text}>
                                        {data?.dosageInstruction?.[0]?.text?.length > 30
                                            ? data?.dosageInstruction?.[0]?.text?.slice(0, 29) + '...'
                                            : data?.dosageInstruction?.[0]?.text || 'N/A'}
                                    </td>
                                    <td>
                                        {data?.startDate ? new Date(data?.startDate).toLocaleDateString('en-GB') : '-'}
                                    </td>
                                    <td>{data?.endDate ? new Date(data?.endDate).toLocaleDateString('en-GB') : '-'}</td>
                                    <td className={`${statusColorMap[data?.status] || 'text-body'} text-capitalize`}>
                                        {data?.status || 'N/A'}
                                    </td>
                                    <td>
                                        <i
                                            className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                            onClick={() => handleEditClick(data)}
                                        />
                                        <i
                                            className="bi bi-trash-fill text-danger cursor-pointer"
                                            onClick={() => {
                                                setDeleteModal(true);
                                                setDeletionId(data._id);
                                            }}
                                        />
                                        <DeletionModal isLoading={store?.deleteMedicationReducer?.loading} show={deleteModal} onConfirm={handleDeleteMedication} onHide={closeDeletionModal} item='medication' />

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    <h5 className="my-5">No data found</h5>
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
                        totalPages={store?.getMedicationReducer?.data?.pagination?.pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <MedicationsModal
                show={medicationModal}
                closeModal={closeMedicationModal}
                selectedMedication={selectedMedication}
            />
        </Row>
    );
};

export default Medications;
