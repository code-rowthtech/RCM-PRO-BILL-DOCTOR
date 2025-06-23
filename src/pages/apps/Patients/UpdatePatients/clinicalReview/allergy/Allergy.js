import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { getAllergiesAction } from '../../../../../../redux/allergies/actions';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../../../../../../constants/Spinner';
import AllergyModal from './AllergyModal';

const Allergy = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const store = useSelector((state) => state);

    const [allergyModal, setAllergyModal] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState(null);

    const patientId = searchParams.get('id');
    const allergiesData = store?.getAllergiesReducer?.data?.allergies;

    const [skip, setSkip] = useState(1);

    useEffect(() => {
        dispatch(getAllergiesAction({ patientId: patientId, skip: skip }))
    }, [dispatch, skip]);

    const handleCloseModal = () => {
        setAllergyModal(false);
        setSelectedAllergy(null);
    }
    return (
        <Row>
            <Col sm={12}>
                <Table responsive className="table-centered table-nowrap mb-0">
                    <thead className="text-white bg-dark">
                        <tr key="">
                            {['S.No.', 'Clinical Status', 'Category', 'Allergy', 'Date', 'Action']?.map((data, index) => (
                                <th key={index}>{data}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {store?.getAllergiesReducer?.loading ?
                            <tr>
                                <td colSpan={6} className='text-center my-5'>
                                    <Spinner />
                                </td>
                            </tr>
                            :
                            allergiesData?.length ?
                                allergiesData?.map((data, index) => (
                                    <tr key={index}>
                                        <td className="text-capitalize">{index + 1}.</td>
                                        <td className="text-capitalize">
                                            {data?.clinicalStatus?.coding?.[0]?.display || 'N/A'}
                                        </td>
                                        <td className="text-capitalize">
                                            {data?.category?.[0]?.display || 'N/A'}
                                        </td>
                                        <td
                                            className="text-capitalize"
                                            title={data?.code?.coding?.[0]?.display}>
                                            {data?.code?.coding?.[0]?.display?.length > 30
                                                ? data?.code?.coding?.[0]?.display?.slice(0, 29) + '...'
                                                : data?.code?.coding?.[0]?.display || 'N/A'}
                                        </td>
                                        <td className="text-capitalize">
                                            {data?.onset?.onsetDateTime
                                                ? new Date(data.onset.onsetDateTime).toISOString().split('T')[0]
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <i
                                                className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                onClick={() => {
                                                    setAllergyModal(true);
                                                    setSelectedAllergy(data?._id);
                                                }}
                                            />
                                            &nbsp;
                                            <i
                                                className="bi bi-trash-fill text-danger cursor-pointer"
                                            // onClick={() => {
                                            //     setDeletionId(data?._id)
                                            //     setDeleteModal(true);
                                            // }}
                                            />
                                        </td>
                                    </tr>
                                ))
                                :
                                <tr>
                                    <td colSpan={6} className='text-center my-5'>
                                        <h5>No Allergies Found</h5>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </Table>
            </Col>
            <AllergyModal show={allergyModal} closeModal={handleCloseModal} allergyId={selectedAllergy} />
        </Row>
    )
}

export default Allergy