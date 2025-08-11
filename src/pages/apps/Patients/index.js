import React, { useEffect, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { LuFileText, LuFileEdit } from 'react-icons/lu';
import { FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getPatientsAction } from '../../../redux/actions';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../constants/Spinner';
import Paginations from '../../../helpers/Paginations';

let loggedInUser = null;

try {
    const encryptedUser = sessionStorage.getItem('loggedInUser');
    if (encryptedUser) {
        const decryptedUser = decryptMessage(encryptedUser);
        loggedInUser = JSON.parse(decryptedUser);
    }
} catch (error) {
    console.error("Failed to retrieve or parse loggedInUser:", error);
    loggedInUser = null;
}
const Patients = () => {
    // DECLARATIONS
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    // VARIABLE AND STATE INITIALIZATIONS
    const patientsData = store?.getPatientsReducer?.data?.data || [];
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(false);
    // USEEFFECTS

    useEffect(() => {

        if (patientsData?.length < 1) {
            fetchPatients()
        }
    }, [dispatch, skip, search]);

    const fetchPatients = (page = 1, query = search) => {
        dispatch(getPatientsAction({
            doctorId: loggedInUser?.doctorId || store?.Auth?.user?.doctorId,
            page: page,
            limit: 10,
            search: query,
            clinicId: loggedInUser?.clinicId || store?.Auth?.user?.clinicId,
        }));
    }

    // FUNCTIONS
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
        fetchPatients(pageNumber, search)
    };

    return (
        <>
            <Card className='page-height'>
                <Card.Body>
                    <Row className="mb-2">
                        <Col sm={12} className="text-end">
                            <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">

                                <Col xs={6} className='d-flex gap-2' title='In-progress'>
                                    {['Active', 'Inactive'].map((label, index) => {
                                        const isActive = label === 'Active';
                                        const isSelected = status === isActive;
                                        return (
                                            <Button
                                                key={index}
                                                disabled
                                                title='In progress'
                                                onClick={() => setStatus(isActive)}
                                                className={`active_inactive_buttons ${isSelected
                                                    ? 'bg-primary text-white py-1'
                                                    : 'bg-white border-primary text-dark py-1'
                                                    }`}
                                            >
                                                {label}
                                            </Button>
                                        );
                                    })}

                                </Col>
                                <Col xs={6} className="d-flex gap-2 justify-content-end">
                                    <FormInput
                                        type="text"
                                        onChange={(e) => {
                                            setSearch(e.target.value)
                                            fetchPatients(1, e.target.value)
                                        }}
                                        placeholder="Search..."
                                    />
                                    <Button
                                        className="custom-buttons "
                                        as={Link}
                                        to={'/apps/patients/add-new-patient'}>
                                        New Patient
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className='px-2 scroll-container' style={{ height: '71vh' }}>
                            <Table responsive className="table-centered table-nowrap mb-0">
                                <thead className="text-white bg-dark">
                                    <tr key="">
                                        {['Patient', "Demographics", "Contact", "Address", "Action"]?.map((data, index) => (
                                            <th key={index}>{data}</th>
                                        ))}
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
                                            <td colSpan={6} className="text-center">
                                                <h5 className="my-5">No Patient Found</h5>
                                            </td>
                                        </tr>
                                    ) : (
                                        patientsData?.map((data, index) => (
                                            <tr
                                                key={data?._id}>
                                                <td className="text-capitalize">
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            height={35}
                                                            width={35}
                                                            className="rounded-circle me-2 object-fit-cover"
                                                            src={data?.photo?.[0]?.url}
                                                            alt=""
                                                        />
                                                        <div>
                                                            {(data?.name?.[0]?.prefix?.[0]
                                                                ? data?.name?.[0]?.prefix?.[0] + ' '
                                                                : '') + (data?.name?.[0]?.text || 'N/A')}
                                                            <div className="text-info fw-bold fs-6">
                                                                <span className="text-dark">MRN: </span>
                                                                {data?.chartNumber}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-capitalize">
                                                        {data?.gender || 'N/A'}
                                                        <div
                                                            className={`${data?.birthDate
                                                                ? ''
                                                                : 'text-danger fs-6 fw-semibold'
                                                                }`}>
                                                            {data?.birthDate
                                                                ? new Date(data?.birthDate)
                                                                    .toISOString()
                                                                    .split('T')[0]
                                                                : 'Missing'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        {'+1-' +
                                                            (data?.telecom?.find(
                                                                (item) =>
                                                                    item?.system === 'phone' &&
                                                                    item?.use === 'home'
                                                            )?.value || 'N/A')}

                                                        <div
                                                            className={`${data?.telecom?.find(
                                                                (item) => item?.system === 'email'
                                                            )?.value
                                                                ? ''
                                                                : 'text-danger'
                                                                }`}>
                                                            {data?.telecom?.find(
                                                                (item) => item?.system === 'email'
                                                            )?.value || 'Email (Missing)'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    data-toggle="tooltip"
                                                    data-placement="left"
                                                    title={data?.address?.[0]?.line?.[0]}>
                                                    {data?.address?.[0]?.line?.[0]?.length > 30
                                                        ? data?.address?.[0]?.line?.[0]?.slice(0, 29) + '...'
                                                        : data?.address?.[0]?.line?.[0] || (
                                                            <span className="text-danger fw-semibold fs-6">
                                                                Missing
                                                            </span>
                                                        )}

                                                    <div className="fw-semibold fs-6">
                                                        {[data?.address?.[0]?.city, data?.address?.[0]?.state]
                                                            .filter(Boolean)
                                                            .join(' | ')}

                                                        {data?.address?.[0]?.postalCode &&
                                                            ` (${data?.address?.[0]?.postalCode})`}
                                                        {!data?.address?.[0]?.city &&
                                                            !data?.address?.[0]?.state &&
                                                            !data?.address?.[0]?.postalCode && (
                                                                <span className="text-danger">Missing</span>
                                                            )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/apps/patients/patientChart?id=${data?._id}`}
                                                        className="action-icon">
                                                        <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                        {patientsData?.length &&
                            <Col className="mt-2 d-flex justify-content-end">
                                <Paginations
                                    currentPage={skip}
                                    totalPages={store?.getPatientsReducer?.data?.pagination?.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </Col>
                        }
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
};

export default Patients;
