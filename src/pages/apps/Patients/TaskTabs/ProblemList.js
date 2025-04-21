import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Form } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import AddProblem from './AddProblem'; // Import AddProblem Component
import { useDispatch, useSelector } from 'react-redux';
import { getPatientProblemsAction, getProblemDetailsAction } from '../../../../redux/actions';
import Spinner from '../../../../constants/Spinner';
import UpdateProblem from './UpdateTask/UpdateProblem';

const ProblemList = () => {
    const [showAddProblem, setShowAddProblem] = useState(false);
    const [showUpdateProblem, setShowUpdateProblem] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [showInactive, setShowInactive] = useState(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const problemList = store?.getPatientProblemsReducer?.data?.problems;
    const createResponse = store?.createProblemReducer?.data?.status;
    useEffect(() => {
        if (createResponse === 201) {
            const data = {
                patientId: id,
            };

            dispatch(getPatientProblemsAction(data));
        }
    }, [createResponse]);
    // const ProblemId = store?.getPatientProblemsReducer?.data?.problems?._id;

    useEffect(() => {
        const data = {
            patientId: id,
        };

        dispatch(getPatientProblemsAction(data));
    }, [id]);

    const handleEditClick = (problem) => {
        setSelectedProblem(problem);
        setShowUpdateProblem(true);
    };

    const handleShowInactiveChange = () => {
        setShowInactive((prev) => !prev);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'inactive':
                return { backgroundColor: '#88D9EB', color: '#05668D' }; // Light Blue BG, Dark Blue Text
            case 'active':
                return { backgroundColor: '#C0FF7F', color: '#3A7600' }; // Light Green BG, Dark Green Text
            default:
                return { backgroundColor: '#f8f9fa', color: '#000000' }; // Default Light Gray BG, Black Text
        }
    };

    const filteredProblemList = showInactive
        ? problemList?.filter((problem) => problem?.status === 'inactive')
        : problemList;

    return (
        <div>
            {showAddProblem ? (
                <AddProblem onCancel={() => setShowAddProblem(false)} />
            ) : showUpdateProblem ? (
                <UpdateProblem problem={selectedProblem} onCancel={() => setShowUpdateProblem(false)} />
            ) : (
                <Row>
                    <Col sm={12} className="d-flex justify-content-between">
                        <h4>Active Problem</h4>
                        <div className="d-flex gap-2">
                            <p className="mb-0 mt-1 d-flex ">
                                <input
                                    className="form-check-input bg-primary me-1"
                                    type="checkbox"
                                    checked={showInactive}
                                    onChange={handleShowInactiveChange}
                                />
                                Show Inactive Problem
                            </p>
                            <p className="mb-0 mt-1">
                                <input className="form-check-input bg-primary me-1" type="checkbox" />
                                Patient has no known active problem
                            </p>
                            <Button className="custom-buttons text-nowrap" onClick={() => setShowAddProblem(true)}>
                                <FiPlus className="fs-5 text-white" />
                                &nbsp; Problem
                            </Button>
                        </div>
                    </Col>
                    <Col sm={12}>
                        <Table responsive className="table-centered table-nowrap mb-0">
                            <thead className="text-white bg-dark">
                                <tr key="">
                                    <th className="text-white">Problem</th>
                                    <th className="text-white">Codes</th>
                                    <th className="text-white">ICD-CM Code</th>
                                    <th className="text-white">Snomed</th>
                                    <th className="text-white">Diagnosed Date</th>
                                    <th className="text-white">Date Changed</th>
                                    <th className="text-white">Status</th>
                                    <th className="text-white">Notes</th>
                                    <th className="text-white">Updates</th>
                                    <th className="text-white">Action</th>
                                </tr>
                            </thead>
                            {store?.getPatientProblemsReducer?.loading ? (
                                <tr>
                                    <td className="text-center" colSpan={10}>
                                        <Spinner className=" my-5 " />
                                    </td>
                                </tr>
                            ) : (
                                <tbody>
                                    {filteredProblemList?.length === 0 ? (
                                        <tr key="">
                                            <td colSpan={10} className="text-center">
                                                <h3 className="my-5">No Problem Found!</h3>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProblemList?.map((data) => (
                                            <tr key={data.id}>
                                                <td className="text-capitalize">{data?.problem}</td>
                                                <td>{data?.icdVersion}</td>
                                                <td>{data?.icdCode}</td>
                                                <td>{data?.snoMedCTCode || 'N/A'}</td>
                                                <td>{data?.diagnosedDate || 'N/A'}</td>
                                                <td>{data?.dateChanged || 'N/A'}</td>
                                                <td className="text-capitalize">
                                                    <span
                                                        className="badge d-flex justify-content-center align-items-center"
                                                        style={{
                                                            ...getStatusStyles(data?.status),
                                                            width: '5vw',
                                                            height: '2vh',
                                                        }}>
                                                        {data?.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <FaEye className="fs-4 ms-2 cursor-pointer text-black" />
                                                </td>
                                                <td>{data?.updates || 'N/A'}</td>
                                                <td>
                                                    <IoInformationCircleOutline className="fs-4 cursor-pointer text-black" />
                                                    &nbsp;
                                                    <FiEdit
                                                        className="fs-4 cursor-pointer text-black"
                                                        onClick={() => {
                                                            handleEditClick(data);
                                                            const requestData = {
                                                                id: data?._id,
                                                            };
                                                            dispatch(getProblemDetailsAction(requestData));
                                                        }}
                                                    />
                                                    &nbsp;
                                                    <MdDeleteOutline className="fs-4 cursor-pointer text-black" />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            )}
                        </Table>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default ProblemList;
