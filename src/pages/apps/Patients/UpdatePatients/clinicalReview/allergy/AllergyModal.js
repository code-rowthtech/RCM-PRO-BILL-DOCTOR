import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { category, criticality } from '../../../../../../utils/DataSets/Allergy/category';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { allergyCode } from '../../../../../../utils/DataSets/Allergy/allergyCode';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDateToISO, today } from '../../../../../../helpers/helperFunctions';
import { clinicalStatus } from '../../../../../../utils/DataSets/Allergy/clinicalStatus';
import { useDispatch } from 'react-redux';
import {
    createAllergiesAction,
    getAllergiesAction,
    getAllergyById,
    getFoodAllergiesAction,
    updateAllergiesAction,
} from '../../../../../../redux/allergies/actions';
import {    getPatientAppointmentsAllAction,
} from '../../../../../../redux/problems/action'
import { encryptMessage } from '../../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import { allergyType } from '../../../../../../utils/DataSets/Allergy/allergyType';
import { loggedInUser } from '../../../../../../helpers/loggedInUser';
import { getAllergyDetails } from '../../../../../../helpers/api/apiEndpoints';
import Spinner from '../../../../../../constants/Spinner';
import ReactQuill from 'react-quill';
import useQuillWordLimit from 'helpers/quillWordLimit';
import SuggestionOffcanvas from '../../SuggestionsFile/Suggestion';
import ToastHandle from 'helpers/ToastMessage';
import { createSuggestionAction } from 'redux/suggestion/action';
const AllergyModal = ({ show, closeModal, allergyId }) => {
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        watch,
        getValues,
        reset,
        setValue,
    } = useForm();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const quillRef = useRef(null);
    const patientId = searchParams.get('id');
    const appointments = store?.getPatientAppointmentReducer?.data?.appointments;
    const allergyDetails = store?.getAllergyByIdReducer?.data?.allergy;
    const foodAllergyData = store?.getFoodAllergiesReducer?.data;
    const [code, setCode] = useState(null);
    const [selectedMode, setSelectedMode] = useState('date');
    useEffect(() => {
        dispatch(getPatientAppointmentsAllAction({ patientId: patientId }));
    }, [dispatch]);
    const formattedCodeOption = useMemo(
        () =>
            allergyCode?.map((reason) => ({
                value: reason,
                label: reason.display,
            })),
        []
    );
    const createResponseStatus = store?.createAllergiesReducer?.data?.status;

    useEffect(() => {
        if (createResponseStatus === 201) {
            dispatch(getAllergiesAction({ patientId: patientId, skip: 1 }));
            closeModal();
            reset();
        }
    }, [createResponseStatus]);

    useEffect(() => {
        if (allergyId) {
            dispatch(getAllergyById({ id: allergyId }));
        }
    }, [allergyId, show]);
    const MAX_WORDS = 1000;
    const WAX_WORD_LENGTH = 45;
    useEffect(() => {
        if (allergyId && allergyDetails) {
            setValue('allergyType', allergyDetails?.type?.coding[0]?.code);
            setValue('category', allergyDetails?.category?.[0]?.code);
            setValue('criticality', allergyDetails?.criticality?.code);
            setValue('verificationStatus', allergyDetails?.verificationStatus?.coding[0]?.code);
            setValue('reaction', allergyDetails?.reaction[0]?.manifestation[0]?.concept?.coding[0]?.code);
            setValue('status', allergyDetails?.clinicalStatus?.coding[0]?.code);
            setValue('severity', allergyDetails?.reaction[0]?.severity?.coding[0]?.code);
            setValue('allergyCode', allergyDetails?.code?.coding[0]);

            setValue('note', allergyDetails?.note[0]?.text);
            setCode(allergyDetails?.code?.coding[0]);
            if (allergyDetails?.appointmentId) {
                setSelectedMode('appointment');
                const selected = (appointments || []).find(
                    (appt) => appt?._id === allergyDetails?.appointmentId || appt?.id === allergyDetails?.appointmentId
                );
                if (selected) {
                    setValue('appointment', JSON.stringify(selected));
                }
                setValue('appointmentDate', null);
            } else if (allergyDetails?.onset?.onsetDateTime) {
                setSelectedMode('date');
                setValue('appointmentDate', new Date(allergyDetails.onset.onsetDateTime).toISOString().split('T')[0]);
                setValue('appointment', null);
            }
        }
    }, [allergyId, allergyDetails]);

    const loadCodeOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedCodeOption.slice(0, 10));
                return;
            }

            const filteredOptions = formattedCodeOption.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            callback(filteredOptions.slice(0, 20));
        },
        [formattedCodeOption]
    );

    const submitAllergiesData = (data) => {
        const selectedStatus = clinicalStatus.find((item) => item?.code === data?.status);
        const selectedCategory = category.find((item) => item?.code === data?.category);
        const selectedCriticalityOption = criticality.find((option) => option?.code === data?.criticality);

        const payload = {
            patientId: patientId,
            clinicId: loggedInUser?.clinicId,
            recorderId: loggedInUser?.doctorId,
            resourceType: 'AllergyIntolerance',
            clinicalStatus: {
                coding: [
                    {
                        system: selectedStatus?.system,
                        code: selectedStatus?.code,
                        display: selectedStatus?.display,
                    },
                ],
                text: selectedStatus?.display,
            },
            category: [
                {
                    system: selectedCategory?.system,
                    code: selectedCategory?.code,
                    display: selectedCategory?.display,
                },
            ],
            criticality: {
                system: selectedCriticalityOption?.system,
                code: selectedCriticalityOption?.code,
                display: selectedCriticalityOption?.display,
            },
            code: {
                coding: code,
                text: code?.display, // use display text
            },
            note: [
                {
                    text: data?.note,
                    time: '',
                    authorReference: {
                        reference: '',
                        type: '',
                        identifier: {
                            use: '',
                            system: '',
                            value: '',
                        },
                        display: '',
                    },
                },
            ],
        };
        if (selectedMode === 'appointment' && data.appointment) {
            let appData = JSON.parse(data.appointment);
            payload.appointmentId = appData?._id;
            payload.onset = {
                onsetDateTime: appData?.date, // optionally use actual date
            };
        } else if (selectedMode === 'date' && data.appointmentDate) {
            payload.onset = {
                onsetDateTime: data.appointmentDate,
            };
        }
        if (allergyId) {
            payload.id = allergyId;
            dispatch(updateAllergiesAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createAllergiesAction({ key: encryptMessage(payload) }));
        }
    };
    const handleSuggestionSelect = (suggestionText) => {
        // Append suggestion to existing note
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };

    const allergyCategoryChange = (data) => {
        dispatch(getFoodAllergiesAction({ query: '', skip: 1 }));
    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'allergy' }));
        setShowSuggestions(true);
    };
    const handleLimitExceed = ({ type, message }) => {
        ToastHandle(message, 'danger');
    };
    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: WAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });

    return (
        <Modal show={show} onHide={closeModal} size="lg" centered>
            <Modal.Header closeButton className="px-2 py-0 ">
                <Modal.Title className="mb-0"> {allergyId ? 'Update Allergy' : 'Add Allergy'} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {store?.getAllergyByIdReducer?.loading ? (
                    <Row>
                        <Col sm={12} className="d-flex align-items-center justify-content-center p-5">
                            <Spinner />
                        </Col>
                    </Row>
                ) : (
                    <Form onSubmit={handleSubmit(submitAllergiesData)}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Allergy Category</Form.Label>
                                    <Form.Select
                                        {...register('category', { required: 'Allergy Category is required' })}
                                        onChange={(e) => allergyCategoryChange(e.target.value)}>
                                        <option key={''} value={''}>
                                            Select allergy category
                                        </option>
                                        {category?.map((item) => (
                                            <option key={item?.code} value={item?.code}>
                                                {item?.display}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Select Allergy <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Controller
                                        name="allergyCode"
                                        control={control}
                                        rules={{ required: 'Allergy selection is required' }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <AsyncSelect
                                                    // ref={selectRef}
                                                    loadOptions={loadCodeOptions}
                                                    defaultOptions={formattedCodeOption.slice(0, 10)}
                                                    isSearchable
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    placeholder="Select"
                                                    value={
                                                        formattedCodeOption.find(
                                                            (option) => option.value.code === field.value?.code
                                                        ) || null
                                                    }
                                                    onChange={(option) => {
                                                        field.onChange(option ? option.value : null);
                                                        setCode(option ? option.value : null);
                                                    }}
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
                                                />
                                                {fieldState.error && (
                                                    <Form.Text className="text-danger">
                                                        {fieldState.error.message}
                                                    </Form.Text>
                                                )}
                                            </>
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label htmlFor="criticality" className="mb-0">
                                        Criticality
                                    </Form.Label>
                                    <Form.Select {...register('criticality', { required: 'Criticality is required' })}>
                                        <option value="" hidden>
                                            Select Criticality
                                        </option>
                                        {criticality?.map((item) => (
                                            <option selected={item?.code === 'low'} key={item?.code} value={item?.code}>
                                                {item?.display}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.criticality && (
                                        <Form.Text className="text-danger fs-6">{errors.criticality.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label htmlFor="status" className="mb-0">
                                        Clinical Status
                                    </Form.Label>
                                    <Form.Select {...register('status', { required: 'Clinical Status is required' })}>
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
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label className="mb-0">Select Mode</Form.Label>
                                    <div className="d-flex gap-3 mb-0">
                                        <Form.Check
                                            type="radio"
                                            label="By Appointment"
                                            name="selectionMode"
                                            value="appointment"
                                            checked={selectedMode === 'appointment'}
                                            onChange={() => setSelectedMode('appointment')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="By Date"
                                            name="selectionMode"
                                            value="date"
                                            checked={selectedMode === 'date'}
                                            onChange={() => setSelectedMode('date')}
                                        />
                                    </div>

                                    {selectedMode === 'appointment' ? (
                                        <>
                                            <Form.Label className="mb-0">Appointment</Form.Label>
                                            <Form.Select {...register('appointment')}>
                                                <option>Select Appointment Date </option>
                                                {appointments?.map((item) => (
                                                    <option key={item?._id} value={JSON.stringify(item)}>
                                                        {item?.date
                                                            ? new Date(item.date).toISOString().split('T')[0]
                                                            : 'N/A'}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </>
                                    ) : (
                                        <>
                                            <Form.Label className="mb-0">Select Date (till today)</Form.Label>
                                            <Form.Control type="date" max={today} {...register('appointmentDate')} />
                                        </>
                                    )}
                                </Form.Group>
                            </Col>
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
                                                const wordCount = words?.length > MAX_WORDS ? MAX_WORDS : words?.length;
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
                            <Col sm={12} className="d-flex justify-content-end gap-1 mt-2">
                                <Button className="custom-buttons" type="submit">
                                    Save & Add Another
                                </Button>
                                <Button className="custom-buttons" type="submit">
                                    Save & Exit
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AllergyModal;
