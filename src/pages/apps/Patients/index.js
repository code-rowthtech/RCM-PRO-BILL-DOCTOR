import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { LuFileText, LuFileEdit } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { getPatientsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../constants/Spinner'
const Patients = () => {

    const dispatch = useDispatch();
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const store = useSelector((state) => state);
    const patientsData = store?.getPatientsReducer?.data?.patients || [];
    console.log(patientsData, 'patientsData')
    useEffect(() => {
        const data = {
            doctorId: doctorId,
        }
        dispatch(getPatientsAction({ key: encryptMessage(data) }));

    }, [dispatch]);



    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>

                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={12} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput type="text" placeholder="Search..." />
                                            <Button className="custom-buttons " as={Link} to={'/apps/patients/add-new-patient'}>Add New Patient</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="text-white bg-dark">
                                            <tr>
                                                <th className='text-white'>Patients ID</th>
                                                <th className='text-white'>Patients Name</th>
                                                <th className='text-white'>Phone Number</th>
                                                <th className='text-white'>Last Appointment</th>
                                                <th className='text-white'>Action</th>
                                            </tr>
                                        </thead>
                                        {store?.getPatientsReducer?.loading ? (
                                            <tr>
                                                <td className='text-center' colSpan={6}>
                                                    <Spinner className=" my-5 " />
                                                </td>
                                            </tr>
                                        ) : (
                                            <tbody>
                                                {patientsData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className='text-center'>
                                                            <h3 className='my-5'>No Patient Found !</h3>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    patientsData?.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>{data.chartNumber}</td>
                                                            <td className='text-capitalize'>
                                                                {data.firstName + ' ' + data.lastName}
                                                            </td>
                                                            <td>{data.cellPhone || 'N/A'}</td>
                                                            <td>{data.appointmentDate || 'N/A'}</td>
                                                            <td>
                                                                <Link to={`/apps/patients/new-patient?id=${data?._id}`} >
                                                                    <FiEdit className="fs-4 ms-2 cursor-pointer text-black" />
                                                                </Link>
                                                            </td>

                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        )}
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </>
    );
}

export default Patients;
