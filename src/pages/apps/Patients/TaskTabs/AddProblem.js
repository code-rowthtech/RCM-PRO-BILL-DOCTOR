import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { createProblemAction, getPatientAppointmentsAction, getSearchCodesAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';

const AddProblem = ({ onCancel }) => {
    const dispatch = useDispatch(); // Declare dispatch
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    // console.log(searchParams, patientId, 'patientId');
    // State for ICD-10 search functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState('');
    const [filteredICDCodes, setFilteredICDCodes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
    } = useForm();
    const allCodeICDs = store?.getSearchCodesReducer?.data?.codes || [];
    // console.log(allCodeICDs, 'iccccd');
    const patientAppointments = store?.getPatientAppointmentsReducer?.data?.appointments;
    // console.log(patientAppointments, 'patientAppointments');

    useEffect(() => {
        dispatch(getSearchCodesAction({ query: search }));
    }, [dispatch, search]);

    // useEffect(() => {
    //     if (patientId) {
    //         dispatch(getPatientAppointmentsAction( {key:encryptMessage({patientId})} ));
    //     }
    // }, [dispatch, patientId]);

    useEffect(() => {
        const data = {
            patientId: patientId,
        };
        dispatch(getPatientAppointmentsAction({ key: encryptMessage(data) }));
    }, [dispatch]);

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
        setValue('icdCode', code.value);
        setSearchQuery(code.value);
        setShowDropdown(false);
    };

    const handleAppointmentChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedAppointment(selectedValue);

        // Find the selected appointment object
        const selectedAppointmentObj = patientAppointments.find((appointment) => appointment._id === selectedValue);

        // Set diagnosis date to the selected appointment date
        if (selectedAppointmentObj) {
            setValue('datetimeDiagnosis', selectedAppointmentObj.date.split('T')[0]);
        }
    };

    const onSubmit = (data) => {
        const createData = { ...data };

        const payload = {
            patientId: patientId,
            ...(createData?.problem ? { problem: createData?.problem } : {}),
            ...(createData?.icdVersion ? { icdVersion: createData?.icdVersion } : {}),
            ...(createData?.icdCode ? { icdCode: createData?.icdCode } : {}),
            ...(createData?.status ? { status: createData?.status } : {}),
            ...(createData?.appointmentId ? { appointmentId: createData?.appointmentId } : {}),
            ...(createData?.notes ? { notes: createData?.notes } : {}),
            ...(createData?.datetimeDiagnosis ? { datetimeDiagnosis: createData?.datetimeDiagnosis } : {}),
            ...(createData?.datetimeOnset ? { datetimeOnset: createData?.datetimeOnset } : {}),
            // ...(createData?.datetimeChanged ? { datetimeChanged: createData?.datetimeChanged } : {}),
        };

        dispatch(createProblemAction({ key: encryptMessage(payload) }));
        // reset();
        console.log(payload, 'Final Payload');
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12} className="d-flex justify-content-between">
                    <h4>Add Problem</h4>
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
                            placeholder="Enter Problem"
                            {...register('problem', { required: 'Problem is required' })}
                            data-has-value={!!watch('problem')}
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
                                value={searchQuery}
                                onChange={handleICDSearch}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            />
                            {errors.icdCode && <small className="text-danger">{errors.icdCode.message}</small>}

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
                        <Form.Select
                            {...register('appointmentId')}
                            data-has-value={!!watch('appointmentId')}
                            value={selectedAppointment}
                            onChange={handleAppointmentChange} // Handle selection change
                        >
                            <option value="">Select Appointment</option>
                            {patientAppointments?.length === 0 ? (
                                <option value="" disabled>
                                    {store?.getPatientAppointmentsReducer?.data?.message}
                                </option>
                            ) : (
                                patientAppointments?.map((appointment) => {
                                    const dateObj = new Date(appointment?.date);
                                    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(
                                        dateObj.getMonth() + 1
                                    ).padStart(2, '0')}/${dateObj.getFullYear()}`;

                                    return (
                                        <option key={appointment?._id} value={appointment?._id}>
                                            {formattedDate}
                                        </option>
                                    );
                                })
                            )}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Date Diagnosis</Form.Label>
                        <Form.Control
                            type="date"
                            data-has-value={!!watch('datetimeDiagnosis')}
                            {...register('datetimeDiagnosis', { required: 'Diagnosis Date is required' })}
                            value={watch('datetimeDiagnosis') || ''}
                            onChange={(e) => setValue('datetimeDiagnosis', e.target.value)}
                            disabled={selectedAppointment !== ''} // Disable if an appointment is selected
                        />
                        {/* {errors.datetimeDiagnosis && <small className="text-danger">{errors.datetimeDiagnosis.message}</small>} */}
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
                {/* <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Datetime Changed</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Datetime Changed"
                            {...register('datetimeChanged')}
                            data-has-value={!!watch('datetimeChanged')}
                        />
                    </Form.Group>
                </Col> */}

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
                <Col sm={12} className="d-flex justify-content-end gap-1 mt-3">
                    <Button className="custom-buttons" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        className="custom-buttons"
                        type="submit"
                        onClick={() => reset()} // Resets the form after submission
                    >
                        Save and Add Another
                    </Button>
                    <Button className="custom-buttons" type="submit">
                        Save
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddProblem;
