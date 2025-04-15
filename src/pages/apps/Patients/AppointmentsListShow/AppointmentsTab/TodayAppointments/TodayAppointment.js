import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Spinner, Form } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { appointmentStatusValues } from '../../../../../../utils/DataSets/appointmentstatus';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../../../../cryptoUtils';
import { getAppointmentByPatientProviderAction, updateAppointmentDetailsAction } from '../../../../../../redux/actions';

// Dummy pagination component
const Paginations = ({ currentPage, totalPages, onPageChange }) => (
    <div>
        Page {currentPage} of {totalPages}
    </div>
);

const TodayAppointment = ({ isHistory = false }) => {
    const store = useSelector((state) => state);
    const [cancelationPopupRow, setCancelationPopupRow] = useState(null);
    const [cancelationReason, setCancelationReason] = useState('');
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const patientId = id ;
    const [search, setSearch] = useState('');
    const dispatch = useDispatch('');
    const patientsDatas = store?.getAppointmentByPatientProviderReducer?.data?.appointments;
    const updateStatus = store?.updateAppointmentDetailsReducer?.data?.status;
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        clearErrors,
        watch,
        getValues,
        reset,
    } = useForm();

    const loading = store?.getAppointmentByPatientProviderReducer?.loading;
    useEffect(()=>{
        if(updateStatus ===200){
            const payload = {
                subject: patientId,
                doctorId: doctorId,
                status :'today',
                search
            };
        dispatch(getAppointmentByPatientProviderAction(payload));
        }
    },[updateStatus])
    useEffect(()=>{
            const payload = {
                subject: patientId,
                doctorId: doctorId,
                status :'today',
                search}
        dispatch(getAppointmentByPatientProviderAction(payload));
        
    },[dispatch])
    // useEffect(() => {
    //     if (patientsDatas) {
    //         setValue('appointmentStatus', patientsDatas?.[0]?.status);
    //     }
    // }, [patientsDatas]);

    return (
        <>
            <Row>
                <Col sm={12}>
                    <Table responsive className="table-centered table-nowrap mb-0">
                        <thead className="text-white bg-dark">
                            <tr>
                                <th className="text-white">Status</th>
                                <th className="text-white">Patient</th>
                                <th className="text-white">Type</th>
                                <th className="text-white">Time</th>
                                <th className="text-white">Reason</th>
                                <th className="text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className="text-center" colSpan={6}>
                                        <Spinner className="my-5" />
                                    </td>
                                </tr>
                            ) : patientsDatas?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <h3 className="my-5">No Patient Found!</h3>
                                    </td>
                                </tr>
                            ) : (
                                patientsDatas?.map((data, index) => {
                                    return (
                                        <>
                                            <tr key={data._id}>
                                                <td>
                                                    {!isHistory ? (
                                                        <Form.Select
                                                            defaultValue={data?.status}
                                                            onChange={(e) => {
                                                                if (e.target.value === 'cancelled') {
                                                                    setCancelationPopupRow(data?._id); // or use data?._id if preferred
                                                                } else {
                                                                    dispatch(
                                                                        updateAppointmentDetailsAction({
                                                                            key: encryptMessage({
                                                                                id: data?._id,
                                                                                status: e.target.value,
                                                                            }),
                                                                        })
                                                                    );
                                                                    setCancelationPopupRow(null); // close popup if status changes again
                                                                }
                                                            }}>
                                                            <option value="" hidden>
                                                                Status
                                                            </option>
                                                            <option value="Scheduled">Scheduled</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                            <option value="Rescheduled">Rescheduled</option>
                                                            <option value="Noshow">No-Show</option> {/* Fixed typo */}
                                                            <option value="Arrived">Arrived</option>
                                                            <option value="Checkedin">Checked In</option>
                                                            <option value="Checkedinonline">Checked In Online</option>
                                                            <option value="Inroom">In Room</option>
                                                            <option value="Insession">In Session</option>
                                                            <option value="Confirmed">Confirmed</option>
                                                            <option value="Notconfirmed">Not Confirmed</option>
                                                        </Form.Select>
                                                    ) : (
                                                        <span className="text-capitalize">{data.status || 'N/A'}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <div className="text-capitalize">
                                                            {data?.subject?.name?.[0]?.text || 'N/A'}
                                                        </div>
                                                        <div className="d-flex justify-content-between text-muted fs-6">
                                                            <span>
                                                                {data?.subject?.birthDate
                                                                    ? new Date(
                                                                          data?.subject?.birthDate
                                                                      ).toLocaleDateString('en-US', {
                                                                          year: 'numeric',
                                                                          month: 'long',
                                                                          day: 'numeric',
                                                                      })
                                                                    : 'N/A'}{' '}
                                                                <span className="ms-2">
                                                                    {data?.subject?.telecom?.[0]?.value || 'N/A'}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{data?.appointmentType?.coding?.[0]?.display}</td>
                                                <td>
                                                    <div>
                                                        {data?.date
                                                            ? new Date(data.date).toLocaleDateString('en-US', {
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: 'numeric',
                                                              })
                                                            : 'N/A'}
                                                    </div>
                                                    <div>
                                                        {data?.start
                                                            ? new Date(data.start).toLocaleTimeString()
                                                            : 'N/A'}
                                                    </div>
                                                </td>
                                                <td>
                                                    {data.reason?.[0]?.text
                                                        ? data.reason[0].text.length > 15
                                                            ? `${data.reason[0].text.slice(0, 15)}...`
                                                            : data.reason[0].text
                                                        : 'N/A'}
                                                </td>{' '}
                                                <td>
                                                    <Link
                                                    // to={`/apps/appointments/newAppointment?id=${data?._id}`}
                                                    >
                                                        <FiEdit className="fs-4 ms-2 cursor-pointer text-black" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
};

export default TodayAppointment;
