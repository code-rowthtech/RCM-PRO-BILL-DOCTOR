import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientAppointmentsAction, getSearchCodesAction, updateProblemAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';

const UpdateProblem = ({ onCancel, problem }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState('');
    const [filteredICDCodes, setFilteredICDCodes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
    } = useForm();

    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const problemDetails = store?.getProblemDetailsReducer?.data?.problem;
    const patientAppointments = store?.getPatientAppointmentsReducer?.data?.appointments;
    const allCodeICDs = store?.getSearchCodesReducer?.data?.codes || [];

    useEffect(() => {
        const data = {
            patientId: patientId,
        };
        dispatch(getPatientAppointmentsAction({ key: encryptMessage(data) }));
    }, [dispatch]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`; // Format for input type="date"
    };

    useEffect(() => {
        dispatch(getSearchCodesAction({ query: search }));
    }, [dispatch, search]);

    // Watch for changes in the ICD code field
    const icdCodeValue = watch('icdCode');

    // Function to filter ICD-10 codes based on user input
    const handleICDSearch = (e) => {
        const query = e.target.value;
        setSearch(e.target.value);
        setSearchQuery(query);
        if (query.length > 0) {
            const filtered = allCodeICDs.filter(
                (code) =>
                    code.value.toLowerCase().includes(query.toLowerCase()) ||
                    code.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredICDCodes(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    // Function to select an ICD-10 code
    const selectICDCode = (code) => {
        setValue('icdCode',problemDetails?.icdCode);
        setSearchQuery(code.value);
        setShowDropdown(false);
    };
    useEffect(() => {
        if (patientAppointments?.length > 0 && problemDetails) {
            setValue(
                'appointment',
                patientAppointments &&
                    patientAppointments?.find((data) => data?._id === problemDetails?.appointmentId)?._id
            );
        }
    }, [patientAppointments, problemDetails]);

    useEffect(() => {
        setValue('problem', problemDetails?.problem);
        setValue('icdVersion', problemDetails?.icdVersion);
        setValue('icdCode', problemDetails?.icdCode);
        setValue('status', problemDetails?.status);
        setValue('appointmentId', problemDetails?.appointmentId);
        setValue('notes', problemDetails?.notes);
        setValue(
            'datetimeDiagnosis',
            problemDetails?.datetimeDiagnosis
                ? new Date(problemDetails?.datetimeDiagnosis).toISOString().split('T')[0]
                : ''
        );
        setValue(
            'datetimeOnset',
            problemDetails?.datetimeOnset ? new Date(problemDetails?.datetimeOnset).toISOString().split('T')[0] : ''
        );
        setValue(
            'datetimeChanged',
            problemDetails?.datetimeChanged ? new Date(problemDetails?.datetimeChanged).toISOString().split('T')[0] : ''
        );
    }, [problemDetails]);

    const onSubmit = (data) => {
        const updateData = { ...data };

        const payload = {
            id: problem?._id,
            ...(updateData?.problem ? { problem: updateData?.problem } : {}),
            ...(updateData?.icdVersion ? { icdVersion: updateData?.icdVersion } : {}),
            ...(updateData?.icdCode ? { icdCode: updateData?.icdCode } : {}),
            ...(updateData?.status ? { status: updateData?.status } : {}),
            ...(updateData?.appointmentId ? { appointmentId: updateData?.appointmentId } : {}),
            ...(updateData?.notes ? { notes: updateData?.notes } : {}),
            ...(updateData?.datetimeDiagnosis ? { datetimeDiagnosis: updateData?.datetimeDiagnosis } : {}),
            ...(updateData?.datetimeOnset ? { datetimeOnset: updateData?.datetimeOnset } : {}),
            ...(updateData?.datetimeChanged ? { datetimeChanged: updateData?.datetimeChanged } : {}),
        };

        dispatch(updateProblemAction({ key: encryptMessage(payload) }));
        // reset();
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12} className="d-flex justify-content-between">
                    <h4>Update Problem</h4>
                    <Button className="custom-buttons" onClick={onCancel} type="button">
                        Back
                    </Button>
                </Col>

                {/* {/ Problem /} */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Problem</Form.Label>
                        <Form.Control
                            type="text"
                            data-has-value={!!watch('problem')}
                            placeholder="Enter Problem"
                            {...register('problem', { required: 'Problem is required' })}
                        />
                        {errors.problem && <small className="text-danger">{errors.problem.message}</small>}
                    </Form.Group>
                </Col>

                {/* {/ ICD Version /} */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD Version</Form.Label>
                        <Form.Select {...register('icdVersion')} data-has-value={!!watch('icdVersion')}>
                            <option value="">Select ICD Version</option>
                            <option value="ICDVersion1">ICD Version 1</option>
                            <option value="ICDVersion2">ICD Version 2</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* {/ ICD 10 Code /} */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD 10 Code</Form.Label>
                        <div style={{ position: 'relative' }}>
                            <Form.Control
                                type="text"
                                placeholder="Enter ICD 10 Code"
                                data-has-value={!!watch('icdCode')}
                                {...register('icdCode', { required: 'ICD 10 Code is required' })}
                                // value={searchQuery}
                                onChange={handleICDSearch}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            />
                            {/* {errors.icdCode && <small className="text-danger">{errors.icdCode.message}</small>} */}

                            {/* {/ Dropdown for ICD Code Search /} */}
                            {showDropdown && filteredICDCodes.length > 0 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        width: '100%',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        zIndex: 111,
                                        backgroundColor: '#fff',
                                        border: '1px solid #ced4da',
                                        borderTop: 'none',
                                    }}
                                    className="scroll-container">
                                    {filteredICDCodes.map((code) => (
                                        <p
                                            key={code._id}
                                            onClick={() => selectICDCode(code)}
                                            style={{
                                                margin: 0,
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                            }}
                                            className="hover-bg-change text-black">
                                            {code.value} - {code.title} - {code.codeType}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Form.Group>
                </Col>

                {/* {/ Status /} */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Status</Form.Label>
                        <Form.Select {...register('status')} data-has-value={!!watch('status')}>
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* {/ Appointment /} */}
                <Col sm={6}>
                    <Form.Group className="mb-1">
                        <Form.Label htmlFor="Appointment" className="mb-0">
                            Appointment
                        </Form.Label>
                        <Form.Select {...register('appointmentId')} data-has-value={!!watch('appointmentId')}>
                            <option hidden value="">
                                Select Appointment
                            </option>
                            {patientAppointments?.map((appointment) => {
                                // Convert ISO date to dd/mm/yyyy
                                const dateObj = new Date(appointment?.date);
                                const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(
                                    dateObj.getMonth() + 1
                                ).padStart(2, '0')}/${dateObj.getFullYear()}`;

                                return (
                                    <option key={appointment?._id} value={appointment?._id}>
                                        {formattedDate || 'No appointment Scheduled Yet'}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* {/ Datetime Diagnosis /} */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Date Diagnosis</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('datetimeDiagnosis')}
                            data-has-value={!!watch('datetimeDiagnosis')}
                        />
                    </Form.Group>
                </Col>

                {/* {/ Datetime Onset /} */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Date Onset</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('datetimeOnset')}
                            data-has-value={!!watch('datetimeOnset')}
                        />
                    </Form.Group>
                </Col>

                {/* {/ Datetime Changed /} */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Date Changed</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Datetime Changed"
                            {...register('datetimeChanged')}
                            data-has-value={!!watch('datetimeChanged')}
                        />
                    </Form.Group>
                </Col>

                {/* {/ Note /} */}
                <Col sm={12}>
                    <Form.Group>
                        <Form.Label className="mb-0">Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Note"
                            rows={4}
                            {...register('notes')}
                            data-has-value={!!watch('notes')}
                        />
                    </Form.Group>
                </Col>

                {/* {/ Buttons /} */}
                <Col sm={12} className="d-flex justify-content-end mt-3">
                    <Button className="custom-buttons" type="submit">
                        Update
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default UpdateProblem;
