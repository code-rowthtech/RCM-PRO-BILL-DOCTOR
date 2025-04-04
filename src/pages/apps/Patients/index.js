import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { LuFileText, LuFileEdit } from 'react-icons/lu';
import { FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getPatientsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../constants/Spinner';
import Paginations from '../../../helpers/Paginations';
const Patients = () => {
    const dispatch = useDispatch();
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const store = useSelector((state) => state);
    const patientsData = store?.getPatientsReducer?.data?.data || [];
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    console.log(store?.getPatientsReducer, 'patientsData');
    useEffect(() => {
        const data = {
            doctorId: doctorId,
            currentPage: skip,
            limit: 10,
            search: search,
        };
        dispatch(getPatientsAction(data));
    }, [dispatch ,skip, search]);
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    return (
        <>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card style={{ height: '87vh' }}>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={12} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <FormInput
                                                type="text"
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Search..."
                                            />
                                            <Button
                                                className="custom-buttons "
                                                as={Link}
                                                to={'/apps/patients/add-new-patient'}>
                                                Add New Patient
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="text-white bg-dark">
                                            <tr key="">
                                                <th className="text-white">S.No.</th>
                                                <th className="text-white">Patients ID</th>
                                                <th className="text-white">Patients Name</th>
                                                <th className="text-white">Phone Number</th>
                                                <th className="text-white">Last Appointment</th>
                                                <th className="text-white">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getPatientsReducer?.loading ? (
                                                <tr key="">
                                                    <td className="text-center" colSpan={6}>
                                                        <Spinner className=" my-5 " />
                                                    </td>
                                                </tr>
                                            ) : patientsData?.length === 0 ? (
                                                <tr key="">
                                                    <td colSpan={5} className="text-center">
                                                        <h3 className="my-5">No Patient Found !</h3>
                                                    </td>
                                                </tr>
                                            ) : (
                                                patientsData?.map((data, index) => (
                                                    <tr key={index}>
                                                        <td className="">{index + 1}</td>
                                                        <td>{data.chartNumber}</td>
                                                        <td className="text-capitalize">{data?.name?.[0]?.text}</td>
                                                        <td>{data?.telecom?.[1]?.value || 'N/A'}</td>
                                                        <td>{data.appointmentDate || 'N/A'}</td>
                                                        <td>
                                                            <Link to={`/apps/patients/new-patient?id=${data?._id}`}>
                                                                <FiEdit className="fs-4 ms-2 cursor-pointer text-black" />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col className="mt-2 d-flex justify-content-end">
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getPatientsReducer?.data?.pagination?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Patients;
