import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Modal, Row, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
    createProblemsAction,
    getAllCodesAction,
    getAppointmentsAction,
    getProblemsAction,
    updateProblemsAction,
    getAppointmentByPatientIdAction,
} from 'redux/actions';
import Select from 'react-select';
import { encryptMessage } from '../../../../../../cryptoUtils';
import { createSuggestionAction } from 'redux/suggestion/action';
import { clinicalStatus } from 'utils/DataSets/Allergy/clinicalStatus';
import { IoMdClose } from 'react-icons/io';
import ToastHandle from 'helpers/ToastMessage';
import ReactQuill from 'react-quill';
import Spinner from '../../../../../../constants/Spinner';
import AppointmentForm from '../../../../Appointments/Tabs/AppointmentForm';
import SuggestionOffcanvas from '../../SuggestionsFile/Suggestion';
import useQuillWordLimit from 'helpers/quillWordLimit';
import { loggedInUser } from 'helpers/loggedInUser';

const MAX_WORDS = 1000;
const MAX_WORD_LENGTH = 45;

const ProblemsModal = ({ show, closeModal, problemId }) => {
    const dispatch = useDispatch();
    const quillRef = useRef();
    const [searchParams] = useSearchParams();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setValue,
        watch,
    } = useForm();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    const patientId = searchParams.get('id');

    const {
        getPatientAppointmentReducer,
        createProblemsReducer,
        updateProblemsReducer,
        getAllCodeReducer,
        getAppointmentByPatientIdReducer
    } = useSelector((state) => state);

    const createAppointmentResponse = getPatientAppointmentReducer?.data?.status;
    const addProblemStatus = createProblemsReducer?.data?.status;
    const updateProblemStatus = updateProblemsReducer?.data?.status;
    const allCodeICDs = getAllCodeReducer?.data?.codes || [];
    const appointments = getAppointmentByPatientIdReducer?.data?.appointments;
    const isLoading = createProblemsReducer?.loading;

    const resetForm = useCallback(() => {
        closeModal();
        reset();
        setSelectedProblem(null);
    }, [closeModal, reset]);

    useEffect(() => {
        if (createAppointmentResponse === 201) {
            dispatch(getAppointmentsAction({
                clinicId: loggedInUser?.clinicId,
                status: '',
                doctorId: '',
                limit: '',
                skip: '',
                monthYear: '',
            }));
            setSelectedProblem(null);
            setShowAppointmentModal(false);
        }
    }, [createAppointmentResponse, dispatch]);

    useEffect(() => {
        if (show) {
            dispatch(getAppointmentByPatientIdAction({ patientId }));
            dispatch(getAllCodesAction({ search: searchQuery }));
        }
    }, [dispatch, show, patientId, searchQuery]);
    useEffect(() => {
        if (problemId) {
            const coding = problemId.code?.coding?.[0];
            const selected = {
                value: coding?.code,
                label: coding?.display,
                display: coding?.display,
                system: 'http://hl7.org/fhir/condition-code',
            };

            setSelectedProblem(selected);
            setValue('problem', selected);
            setValue('icdCode', coding?.code);
            setValue('status', problemId.clinicalStatus?.coding?.[0]?.code);
            setValue('appointment', problemId.appointment);
            setValue('diagnosisDate', problemId.onsetDateTime?.split('T')[0]);
            setValue('note', problemId.note?.[0]?.text);
        }
    }, [problemId, setValue, appointments]);

    useEffect(() => {
        setValue('icdCode', selectedProblem?.value || '');
    }, [selectedProblem, setValue]);

    const closeAppointmentModal = useCallback(() => {
        setShowAppointmentModal(false);
    }, []);

    const formattedOptions = useMemo(() =>
        allCodeICDs?.map((code) => ({
            value: code.value,
            label: `${code.title} - ${code.codeType}`,
            system: 'http://hl7.org/fhir/condition-code',
            display: code.title,
        })) || [], [allCodeICDs]
    );

    const submitProblemData = useCallback((data) => {
        const selected = data.problem;
        const selectedStatus = clinicalStatus.find((item) => item.code === data.status);

        const payload = {
            code: {
                coding: [{
                    system: selected?.system,
                    code: selected?.value,
                    display: selected?.display,
                }],
                text: selected?.display,
            },
            subject: patientId,
            icdCode: data.icdCode,
            clinicalStatus: {
                coding: [{
                    system: selectedStatus?.system,
                    code: selectedStatus?.code,
                    display: selectedStatus?.display,
                }],
                text: selectedStatus?.display,
            },
            ...(data.appointment && { appointment: data.appointment }),
            ...(data.diagnosisDate && { onsetDateTime: data.diagnosisDate }),
            note: [{
                authorReference: {
                    reference: '',
                    type: '',
                    display: '',
                },
                authorString: ' ',
                time: '',
                text: data.note,
            }],
        };

        if (problemId) {
            payload.id = problemId;
            dispatch(updateProblemsAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createProblemsAction({ key: encryptMessage(payload) }));
        }
    }, [problemId, patientId, dispatch]);

    useEffect(() => {
        if (addProblemStatus === 201 || updateProblemStatus === 200) {
            dispatch(getProblemsAction({ patientId }));
            resetForm();
        }
    }, [addProblemStatus, updateProblemStatus, dispatch, patientId, resetForm]);

    const handleEditorFocus = useCallback(() => {
        dispatch(createSuggestionAction({ module: 'problem' }));
        setShowSuggestions(true);
    }, [dispatch]);

    const handleSuggestionSelect = useCallback((suggestionText) => {
        const current = getValues('note');
        setValue('note', `${current}<p>${suggestionText}</p>`);
    }, [getValues, setValue]);

    const handleLimitExceed = useCallback(({ message }) => {
        ToastHandle(message, 'danger');
    }, []);

    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: MAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });
    return (
        <Modal show={show} onHide={closeModal} size="lg" centered>
            <Modal.Header closeButton className="px-2 py-0 ">
                <Modal.Title className="mb-0">{problemId ? 'Update Problem ' : 'Add Problem'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(submitProblemData)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Problem</Form.Label>
                                <Controller
                                    name="problem"
                                    control={control}
                                    rules={{ required: 'Problem is required' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            classNamePrefix="select"
                                            options={formattedOptions}
                                            onChange={(selected) => {
                                                field.onChange(selected);
                                                setSelectedProblem(selected);
                                            }}
                                            onInputChange={(value, { action }) => {
                                                if (action === 'input-change') {
                                                    setSearchQuery(value);
                                                }
                                            }}
                                            placeholder="Search Problem"
                                            isClearable
                                            isSearchable
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: '0px',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',
                                                    paddingBottom: '5px',
                                                }),
                                            }}
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                        />
                                    )}
                                />
                                {errors.problem && (
                                    <Form.Text className="text-danger">{errors.problem.message}</Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">ICD 10 Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter ICD 10 Code"
                                    {...register('icdCode')}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="status" className="mb-0">
                                    Status
                                </Form.Label>
                                <Form.Select
                                    {...register('status', { required: 'Clinical Status is required' })}
                                    data-has-value={!!watch('status')}>
                                    <option value="" hidden>
                                        Select Clinical Status
                                    </option>
                                    {clinicalStatus?.map((status) => (
                                        <option key={status?.code} value={status?.code}>
                                            {status?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.status && (
                                    <Form.Text className="text-danger">{errors.status.message}</Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Appointment - dynamically loaded */}
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">
                                    Appointment{' '}
                                    {/* <i
                                        onClick={() => setShowAppointmentModal(true)}
                                        className="bi bi-plus-circle text-black cursor-pointer"></i> */}
                                </Form.Label>
                                <Form.Select {...register('appointment')}>
                                    <option value="">Select Appointment</option>
                                    {appointments?.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item?.date ? new Date(item?.date).toISOString().split('T')[0] : 'N/A'}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Modal centered show={showAppointmentModal} size="xl" onHide={closeAppointmentModal}>
                                <Modal.Body>
                                    <Row className="border-bottom mb-1 pb-2">
                                        <Col sm={11} className="text-center">
                                            <h4>Create New Appointment</h4>
                                        </Col>
                                        <Col sm={1}>
                                            <IoMdClose
                                                className="fs-4 cursor-pointer"
                                                onClick={closeAppointmentModal}
                                            />
                                        </Col>
                                    </Row>
                                    <AppointmentForm
                                    // selectedSlot={selectedSlot}
                                    // appointmentId={selectedEvent?.event_id}
                                    // calendarView={calendarView}
                                    />
                                </Modal.Body>
                            </Modal>
                        </Col>

                        {/* Diagnosis Date */}
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Date Diagnosis</Form.Label>
                                <Form.Control type="date" {...register('diagnosisDate')} />
                            </Form.Group>
                        </Col>

                        {/* Note */}
                        <Col xs={12}>
                            <Form.Group controlId="note">
                                <Form.Label className="fw-medium mb-1 d-flex justify-content-between align-items-center">
                                    <div>
                                        Notes{' '}
                                        <span
                                            style={{ cursor: 'pointer' }}
                                            title="Notes Suggestions"
                                            onClick={handleEditorFocus}>
                                            ✨
                                        </span>
                                    </div>
                                    <small className="text-muted">
                                        {(() => {
                                            const content = watch('note') || '';
                                            const plainText = quillRef?.current?.getEditor()?.getText()?.trim();
                                            const words = plainText?.split(/\s+/)?.filter(Boolean);
                                            const wordCount = words?.length;
                                            return (
                                                <div>
                                                    <div>{`${wordCount} / ${MAX_WORDS} words`}</div>
                                                </div>
                                            );
                                        })()}
                                    </small>
                                </Form.Label>

                                <Controller
                                    name="note"
                                    control={control}
                                    defaultValue="<ul><li></li></ul>"
                                    render={({ field: { onChange, value } }) => (
                                        <ReactQuill
                                            ref={quillRef}
                                            value={value}
                                            onChange={(content, delta, source) => {
                                                if (source === 'user') {
                                                    onChange(content);
                                                }
                                            }}
                                            theme="snow"
                                            placeholder="Enter detailed notes here..."
                                            style={{ backgroundColor: 'white' }}
                                            modules={{
                                                toolbar: [
                                                    [{ header: [1, 2, false] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                                    // ['link', 'image'],
                                                    ['clean'],
                                                ],
                                            }}
                                        />
                                    )}
                                />

                                <SuggestionOffcanvas
                                    show={showSuggestions}
                                    onClose={() => setShowSuggestions(false)}
                                    onSelect={handleSuggestionSelect}
                                    className="custom-suggestion-offcanvas"
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={12} className="d-flex justify-content-end gap-1 mt-3">
                            {/* <Button
                                className="custom-buttons"
                                style={{ width: '150px' }}
                                type="submit"
                                disabled={store?.createProblemsReducer?.loading}
                                onClick={() => setSubmissionType('saveAndReset')}>
                                {store?.createProblemsReducer?.loading && submissionType === 'saveAndReset' ? (
                                    <Spinner className="text-white spinner-border-sm" />
                                ) : (
                                    'Save & Add Another'
                                )}
                            </Button> */}
                            <Button
                                className="custom-buttons"
                                type="submit"
                                style={{ width: '120px' }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Spinner className="text-white spinner-border-sm" />
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProblemsModal;
