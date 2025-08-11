import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { createMedicalHistoryAction, deleteMedicalHistoryAction, getMedicalHistoryAction, updateMedicalHistoryAction } from 'redux/socialHistory/action';
import { createSuggestionAction } from 'redux/suggestion/action';
import ToastHandle from 'helpers/ToastMessage';
import { encryptMessage } from 'cryptoUtils';
import useQuillWordLimit from 'helpers/quillWordLimit';
import Select from 'react-select';
import { loggedInUser } from 'helpers/loggedInUser';
import SuggestionOffcanvas from '../../SuggestionsFile/Suggestion';
import Spinner from 'constants/Spinner';
import DeletionModal from 'helpers/DeletionModal';
import { getAllCodesAction } from 'redux/actions';


const MAX_WORDS = 1000;
const MAX_WORD_LENGTH = 45;

const MedicalHistory = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null);
    const quillRef = useRef(null);
    const { register, handleSubmit, reset, getValues, control, setValue, watch } = useForm();

    // Memoized selectors for better performance
    const {
        allCodeICDs,
        createSuccess,
        medicalHistory,
        deleteResponse,
        isLoading,
        updateResponse,
        isCreating,
        isUpdating,
        isDeleting
    } = useMemo(() => ({
        allCodeICDs: store?.getAllCodeReducer?.data?.codes || [],
        createSuccess: store?.createMedicalHistoryReducer?.data?.status,
        medicalHistory: store?.getMedicalHistoryReducer?.data?.medicalHistory,
        deleteResponse: store?.deleteMedicalHistoryReducer?.data?.status,
        isLoading: store?.getMedicalHistoryReducer?.loading,
        updateResponse: store?.updateMedicalHistoryReducer?.data?.status,
        isCreating: store?.createMedicalHistoryReducer?.loading,
        isUpdating: store?.updateMedicalHistoryReducer?.loading,
        isDeleting: store?.deleteMedicalHistoryReducer?.loading
    }), [store]);

    // Initialize data on component mount
    useEffect(() => {
        if (patientId) {
            dispatch(getMedicalHistoryAction({ patientId }));
            dispatch(getAllCodesAction({ search: '' }));
        }
    }, [dispatch, patientId]);

    // Handle successful operations
    useEffect(() => {
        if (createSuccess === 201 || updateResponse === 200) {
            dispatch(getMedicalHistoryAction({ patientId }));
            handleReset();
        }
    }, [createSuccess, updateResponse, patientId, toEdit]);

    // Handle successful deletion
    useEffect(() => {
        if (deleteResponse === 200) {
            dispatch(getMedicalHistoryAction({ patientId }));
            setToDelete(null);
            setDeleteModal(false);
        }
    }, [deleteResponse, patientId]);

    // Memoized callbacks
    const deleteHistory = useCallback(() => {
        if (toDelete) {
            dispatch(deleteMedicalHistoryAction({ id: toDelete }));
        }
    }, [dispatch, toDelete]);

    const closeDeleteModal = useCallback(() => {
        setToDelete(null);
        setDeleteModal(false);
    }, []);

    const handleReset = useCallback(() => {
        setToEdit(null);
        setSelectedProblem(null);
        reset({
            problem: null,
            startDate: '',
            endDate: '',
            note: '<ul><li></li></ul>'
        });
    }, [reset]);

    // Memoized formatted options
    const formattedOptions = useMemo(() =>
        allCodeICDs.map((code) => ({
            value: code.value,
            label: `${code.title} - ${code.codeType}`,
            system: 'http://hl7.org/fhir/condition-code',
            display: code.title,
        })), [allCodeICDs]
    );

    // Handle edit mode
    useEffect(() => {
        if (toEdit && formattedOptions.length > 0) {
            const conditionCode = toEdit?.code?.coding?.[0];
            const matchedProblem = formattedOptions.find(
                (opt) => opt.value === conditionCode?.code && opt.display === conditionCode?.display
            );

            setSelectedProblem(matchedProblem || null);
            setValue('problem', matchedProblem || null);
            setValue(
                'startDate',
                toEdit?.effectivePeriod?.start
                    ? new Date(toEdit?.effectivePeriod?.start)?.toISOString()?.split('T')[0]
                    : ''
            );
            setValue(
                'endDate',
                toEdit?.effectivePeriod?.end
                    ? new Date(toEdit?.effectivePeriod?.end)?.toISOString()?.split('T')[0]
                    : ''
            );
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>');
        }
    }, [toEdit, formattedOptions, setValue]);

    const onSubmit = useCallback((data) => {
        if (!data.problem || !patientId) {
            ToastHandle('Please fill all required fields', 'danger');
            return;
        }

        const selected = data.problem;
        const payload = {
            clinicId: loggedInUser?._id,
            code: {
                coding: [{
                    system: selected?.system,
                    code: selected?.value,
                    display: selected?.display,
                }],
                text: selected?.display,
            },
            effectivePeriod: {
                start: data.startDate,
                end: data.endDate,
            },
            note: [{
                text: data.note,
                time: new Date().toISOString(),
            }],
            subject: patientId,
        };

        const encryptedPayload = { key: encryptMessage(payload) };

        if (toEdit) {
            dispatch(updateMedicalHistoryAction({ ...encryptedPayload, id: toEdit._id }));
        } else {
            dispatch(createMedicalHistoryAction(encryptedPayload));
        }
    }, [dispatch, patientId, toEdit]);

    const handleEditorFocus = useCallback(() => {
        dispatch(createSuggestionAction({ module: 'medicalHistory' }));
        setShowSuggestions(true);
    }, [dispatch]);

    const handleSuggestionSelect = useCallback((suggestionText) => {
        const current = getValues('note');
        setValue('note', `${current}<p>${suggestionText}</p>`);
    }, [getValues, setValue]);

    // Debounced search for codes
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(getAllCodesAction({ search: searchQuery }));
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchQuery]);

    const startDate = watch('startDate');

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
        <Row className="g-0 m-0" style={{ height: 'calc(100vh - 150px)' }}>
            {/* Left: Form Section */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2" style={{ height: '100%' }}>
                <div className="h-100">
                    <div className="d-flex flex-column px-2 py-0" style={{ overflowY: 'auto' }}>
                        <Form onSubmit={handleSubmit(onSubmit)} className="flex-grow-1 d-flex flex-column">
                            <Row className="">
                                <Col xs={12}>
                                    <Form.Group controlId="problem">
                                        <Form.Label className="fw-medium mb-1">Medical Problem</Form.Label>
                                        <Controller
                                            name="problem"
                                            control={control}
                                            rules={{ required: 'Problem is required' }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    classNamePrefix="select"
                                                    options={formattedOptions}
                                                    value={selectedProblem || null}
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
                                                            minHeight: '30px',
                                                            border: '0px',
                                                        }),
                                                    }}
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"
                                                />
                                            )}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="startDate">
                                        <Form.Label className="fw-medium mb-1">Start Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register('startDate')}
                                            required
                                            max={new Date().toISOString().slice(0, 10)}
                                            className="form-control-sm"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="endDate">
                                        <Form.Label className="fw-medium mb-1">End Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register('endDate')}
                                            required
                                            className="form-control-sm"
                                            min={startDate || undefined}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} className="flex-grow-1 d-flex flex-column">
                                    <Form.Group controlId="notes" className="flex-grow-1 d-flex flex-column">
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
                                        <div className="flex-grow-1 d-flex flex-column">
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
                                                        style={{ height: '24vh', backgroundColor: 'white' }}
                                                        modules={{
                                                            toolbar: [
                                                                [{ header: [1, 2, false] }],
                                                                ['bold', 'italic', 'underline', 'strike'],
                                                                [{ list: 'ordered' }, { list: 'bullet' }],
                                                                ['clean'],
                                                            ],
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <SuggestionOffcanvas
                                            show={showSuggestions}
                                            onClose={() => setShowSuggestions(false)}
                                            onSelect={handleSuggestionSelect}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="mt-5 d-flex justify-content-end gap-2">
                                {toEdit && (
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={handleReset}
                                        className="px-3 py-1">
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isCreating || isUpdating}
                                    className="px-3 py-1 custom-buttons">
                                    {(isCreating || isUpdating) && (
                                        <Spinner color='white' className="spinner-border-sm" />
                                    )}
                                    {toEdit ? 'Update Record' : 'Add Record'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Col>

            {/* Right: History Section */}
            <Col md={6} className="d-flex flex-column px-0" style={{ height: '100%' }}>
                <div className="h-100">
                    <div className="p-0" style={{ overflowY: 'auto' }}>
                        {isLoading ? (
                            <div className="text-center py-4">
                                <Spinner />
                            </div>
                        ) : !medicalHistory?.length ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-x fs-1"></i>
                                <p className="mt-2 mb-0">No medical history records found</p>
                            </div>
                        ) : (
                            <Accordion alwaysOpen flush className="h-100">
                                {medicalHistory?.map((item, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index} className="rounded-1">
                                        <Accordion.Header>
                                            <div
                                                className="d-flex justify-content-between align-items-center w-100"
                                                style={{ marginRight: '-19px' }}>
                                                <div className="d-flex align-items-center gap-2 p-2 pe-0">
                                                    <span className="text-black fs-6 tab-font-family fw-semibold">
                                                        {index + 1}.
                                                    </span>
                                                    <span className="fw-normal fs-6 tab-font-family text-black">
                                                        {item?.code?.coding?.[0]?.display || 'No description'}
                                                    </span>
                                                    <small className="text-black" style={{ fontSize: '12px' }}>
                                                        (
                                                        {item?.note?.[0]?.time
                                                            ? new Date(item.note[0].time).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            })
                                                            : 'No date'}
                                                        -
                                                        {item?.note?.[0]?.time
                                                            ? new Date(item.note[0].time).toLocaleTimeString()
                                                            : 'No time'}
                                                        )
                                                    </small>
                                                </div>
                                                {/* Action Icons */}
                                                <div
                                                    className="d-flex gap-2 px-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}>
                                                    <i
                                                        className="bi bi-trash text-danger cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setToDelete(item._id);
                                                            setDeleteModal(true);
                                                        }}
                                                        title="Delete"
                                                    />
                                                    {toEdit && toEdit._id === item._id ? (
                                                        <i
                                                            className="bi bi-x-lg text-danger cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleReset();
                                                            }}
                                                            title="Cancel Edit"
                                                        />
                                                    ) : (
                                                        <i
                                                            className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setToEdit(item);
                                                            }}
                                                            title="Edit Record"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </Accordion.Header>

                                        <Accordion.Body className="pt-0 p-0">
                                            {item?.note?.[0]?.text ? (
                                                <div
                                                    className="ql-editor p-1 rounded"
                                                    dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                    style={{ fontSize: '0.875rem', maxHeight: '150px', overflowY: 'auto' }}
                                                />
                                            ) : (
                                                <div className="text-muted fst-italic p-2">No notes available</div>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}

                                <DeletionModal
                                    show={deleteModal}
                                    onHide={closeDeleteModal}
                                    onConfirm={deleteHistory}
                                    item="medical history record"
                                    isLoading={isDeleting}
                                />
                            </Accordion>
                        )}
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default MedicalHistory;