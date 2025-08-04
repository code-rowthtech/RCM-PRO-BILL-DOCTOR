import DeletionModal from 'helpers/DeletionModal';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { createAlcoholHistoryAction, updateAlcoholHistoryAction, getAlcoholHistoryAction, deleteAlcoholHistoryAction } from 'redux/socialHistory/action';
import { encryptMessage } from 'cryptoUtils';
import { loggedInUser } from 'helpers/loggedInUser';
import ToastHandle from 'helpers/ToastMessage';
import Spinner from 'constants/Spinner';
import useQuillWordLimit from 'helpers/quillWordLimit';
import SuggestionOffcanvas from '../../SuggestionsFile/Suggestion';
import { createSuggestionAction } from 'redux/suggestion/action';

const AlcoholHistory = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const quillRef = useRef(null);

    const [formData, setFormData] = useState({
        useStatus: '',
        alcoholType: '',
        frequency: '',
        quantityPerOccasion: '',
        hasDependenceSymptoms: false,
        heavyIntakeFrequency: '',
        note: '<ul><li></li></ul>',
        ageOfFirstUse: '',
        lastUseDate: '',
        reasonForStopping: '',
        duration: '',
        summary: ''
    });

    const MAX_WORDS = 1000;
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);

    // Redux state
    const alcoholHistory = store?.getAlcoholHistoryReducer?.data?.data || [];
    const isLoading = store?.getAlcoholHistoryReducer?.loading;
    const createSuccess = store?.createAlcoholHistoryReducer?.data?.status;
    const updateSuccess = store?.updateAlcoholHistoryReducer?.data?.status;
    const deleteSuccess = store?.deleteAlcoholHistoryReducer?.data?.status;
    const isCreating = store?.createAlcoholHistoryReducer?.loading;
    const isUpdating = store?.updateAlcoholHistoryReducer?.loading;
    const isDeleting = store?.deleteAlcoholHistoryReducer?.loading;
    // Initialize data
    useEffect(() => {
        if (patientId) {
            dispatch(getAlcoholHistoryAction({ patientId }));
        }
    }, [dispatch, patientId]);

    // Handle successful operations
    useEffect(() => {
        if (createSuccess === 201 || updateSuccess === 200) {
            dispatch(getAlcoholHistoryAction({ patientId }));
            handleReset();
        }
    }, [createSuccess, updateSuccess, patientId, toEdit]);

    // Handle successful deletion
    useEffect(() => {
        if (deleteSuccess === 200) {
            dispatch(getAlcoholHistoryAction({ patientId }));
            setToDelete(null);
            setDeleteModal(false);
        }
    }, [deleteSuccess, patientId]);

    // Handle edit mode
    useEffect(() => {
        if (toEdit) {
            setFormData({
                useStatus: toEdit.useStatus || '',
                alcoholType: toEdit.alcoholType || '',
                frequency: toEdit.frequency || '',
                quantityPerOccasion: toEdit.quantityPerOccasion || '',
                hasDependenceSymptoms: toEdit.hasDependenceSymptoms || false,
                heavyIntakeFrequency: toEdit.heavyIntakeFrequency || '',
                note: toEdit.note?.[0]?.text || '<ul><li></li></ul>',
                ageOfFirstUse: toEdit.ageOfFirstUse || '',
                lastUseDate: toEdit.lastUseDate ? new Date(toEdit.lastUseDate).toISOString().split('T')[0] : '',
                reasonForStopping: toEdit.reasonForStopping || '',
                duration: toEdit.duration || '',
                summary: toEdit.summary || ''
            });
        }
    }, [toEdit]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!formData.useStatus) {
            ToastHandle('Please select alcohol use status', 'danger');
            return;
        }

        const payload = {
            subject: patientId,
            performer: loggedInUser?._id,
            recordedBy: loggedInUser?._id,
            effectiveDateTime: new Date().toISOString(),
            issued: new Date().toISOString(),
            valueCodeableConcept: {
                text: formData.useStatus
            },
            useStatus: formData.useStatus,
            alcoholType: formData.alcoholType,
            frequency: formData.frequency,
            quantityPerOccasion: formData.quantityPerOccasion,
            hasDependenceSymptoms: formData.hasDependenceSymptoms,
            heavyIntakeFrequency: formData.heavyIntakeFrequency,
            ageOfFirstUse: formData.ageOfFirstUse ? parseInt(formData.ageOfFirstUse) : null,
            lastUseDate: formData.lastUseDate || null,
            reasonForStopping: formData.reasonForStopping,
            duration: formData.duration,
            summary: formData.summary,
            note: [{
                text: formData.note
            }]
        };

        if (toEdit) {
            dispatch(updateAlcoholHistoryAction({ key: encryptMessage({ ...payload, id: toEdit._id }) }));
        } else {
            dispatch(createAlcoholHistoryAction({ key: encryptMessage(payload) }));
        }
    }, [dispatch, formData, patientId, toEdit]);

    const handleReset = useCallback(() => {
        setFormData({
            useStatus: '',
            alcoholType: '',
            frequency: '',
            quantityPerOccasion: '',
            hasDependenceSymptoms: false,
            heavyIntakeFrequency: '',
            note: '<ul><li></li></ul>',
            ageOfFirstUse: '',
            lastUseDate: '',
            reasonForStopping: '',
            duration: '',
            summary: ''
        });
        setToEdit(null);
    }, []);

    const handleEditorFocus = useCallback(() => {
        dispatch(createSuggestionAction({ module: 'alcoholHistory' }));
        setShowSuggestions(true);
    }, [dispatch]);

    const deleteHistory = useCallback(() => {
        if (toDelete) {
            dispatch(deleteAlcoholHistoryAction({ id: toDelete }));
        }
    }, [dispatch, toDelete]);

    const closeDeleteModal = useCallback(() => {
        setToDelete(null);
        setDeleteModal(false);
    }, []);

    const handleSuggestionSelect = useCallback((suggestionText) => {
        const current = formData.note;
        setFormData(prev => ({
            ...prev,
            note: `${current}<p>${suggestionText}</p>`
        }));
    }, [formData.note]);

    const handleLimitExceed = useCallback(({ message }) => {
        ToastHandle(message, 'danger');
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleQuillChange = useCallback((content) => {
        setFormData(prev => ({
            ...prev,
            note: content
        }));
    }, []);

    // Word limit hook
    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: 45,
        onLimitExceed: handleLimitExceed,
        setValue: (value) => setFormData(prev => ({ ...prev, note: value })),
        fieldName: 'note',
    });

    return (
        <Row className="scroll-container" style={{ overflowY: 'scroll', overflowX: 'hidden', height: '100%' }}>
            {/* Left Side - Form */}
            <Col md={6} className="d-flex border-end px-0 flex-column pt-0 mt-0 pe-1 ">
                <div className="h-100 ">
                    <Card.Body className="d-flex flex-column pt-0 px-0 pb-2 mt-0">
                        <Form onSubmit={handleSubmit}>
                            <div
                                style={{ maxHeight: '48vh' }}
                                className="d-flex px-2 scroll-container flex-column justify-content-between">
                                <Row>
                                    <Col sm={12}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">Alcohol Use Status</Form.Label>
                                            <Form.Select
                                                name="useStatus"
                                                value={formData.useStatus}
                                                onChange={handleInputChange}
                                                required>
                                                <option value="">Select status</option>
                                                <option value="Current User">Current User</option>
                                                <option value="Former User">Former User</option>
                                                <option value="Never Used">Never Used</option>
                                                <option value="Unknown">Unknown</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {formData.useStatus === 'Current User' && (
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Alcohol use frequency</Form.Label>
                                                <Form.Select
                                                    name="frequency"
                                                    value={formData.frequency}
                                                    onChange={handleInputChange}
                                                    required>
                                                    <option key="" value="">
                                                        Select
                                                    </option>
                                                    {['Occasionally', 'Weekly', 'Daily', 'Heavy', 'Unknown']?.map(
                                                        (data) => {
                                                            return (
                                                                <option value={data} key={data}>
                                                                    {data}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Standard drinks per occasion</Form.Label>
                                                <Form.Select
                                                    name="quantityPerOccasion"
                                                    value={formData.quantityPerOccasion}
                                                    onChange={handleInputChange}
                                                    required>
                                                    <option key="" value="">
                                                        Select
                                                    </option>
                                                    {['1 or 2', '3 or 4', '5 or 6', '7 to 9', '10 or more']?.map(
                                                        (data) => {
                                                            return (
                                                                <option value={data} key={data}>
                                                                    {data}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        {formData.frequency === 'Heavy' && (
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">Heavy intake frequency</Form.Label>
                                                    <Form.Select
                                                        name="heavyIntakeFrequency"
                                                        value={formData.heavyIntakeFrequency}
                                                        onChange={handleInputChange}
                                                        required>
                                                        <option key="" value="">
                                                            Select
                                                        </option>
                                                        {[
                                                            'Less than monthly',
                                                            'Monthly',
                                                            'Weekly',
                                                            'Daily or almost daily',
                                                        ]?.map((data) => {
                                                            return (
                                                                <option value={data} key={data}>
                                                                    {data}
                                                                </option>
                                                            );
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        )}

                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">
                                                    What types of alcohol do you usually consume?
                                                </Form.Label>
                                                <Form.Select
                                                    name="alcoholType"
                                                    value={formData.alcoholType}
                                                    onChange={handleInputChange}
                                                    required>
                                                    <option key="" value="">
                                                        Select
                                                    </option>
                                                    {['Beer', 'Wine', 'Spirits', 'Other', 'All']?.map((data) => {
                                                        return (
                                                            <option value={data} key={data}>
                                                                {data}
                                                            </option>
                                                        );
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">
                                                    Do you experience dependence symptoms (e.g., craving, withdrawal)?
                                                </Form.Label>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Yes"
                                                    name="hasDependenceSymptoms"
                                                    checked={formData.hasDependenceSymptoms}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}

                                {formData.useStatus === 'Former User' && (
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">
                                                    Age when you started using alcohol
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="ageOfFirstUse"
                                                    value={formData.ageOfFirstUse}
                                                    onChange={handleInputChange}
                                                    min="1"
                                                    max="100"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Date of last alcohol use</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    max={new Date().toISOString().slice(0, 10)}
                                                    name="lastUseDate"
                                                    value={formData.lastUseDate}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">
                                                    Reason for stopping alcohol use
                                                </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name="reasonForStopping"
                                                    value={formData.reasonForStopping}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter reason for stopping alcohol use"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Duration of use</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="duration"
                                                    value={formData.duration}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., 5 years, Since college"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}

                                {formData.useStatus !== 'Never Used' && formData.useStatus !== '' && (
                                    <Row>
                                        <Col xs={12}>
                                            <Form.Group controlId="notes">
                                                <Form.Label className="fw-medium my-1 d-flex justify-content-between align-items-center">
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
                                                            const plainText = quillRef?.current?.getEditor()?.getText()?.trim();
                                                            const words = plainText?.split(/\s+/)?.filter(Boolean);
                                                            const wordCount = words?.length || 0;
                                                            return `${wordCount} / ${MAX_WORDS} words`;
                                                        })()}
                                                    </small>
                                                </Form.Label>
                                                <ReactQuill
                                                    ref={quillRef}
                                                    value={formData.note}
                                                    onChange={(content, delta, source) => {
                                                        if (source === 'user') {
                                                            handleQuillChange(content);
                                                        }
                                                    }}
                                                    theme="snow"
                                                    placeholder="Enter detailed notes here..."
                                                    style={{ height: '200px', backgroundColor: 'white' }}
                                                    modules={{
                                                        toolbar: [
                                                            [{ header: [1, 2, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ list: 'ordered' }, { list: 'bullet' }],
                                                            ['clean'],
                                                        ],
                                                    }}
                                                />
                                                <SuggestionOffcanvas
                                                    show={showSuggestions}
                                                    onClose={() => setShowSuggestions(false)}
                                                    onSelect={handleSuggestionSelect}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}

                                {/* Summary field for all statuses except Never Used */}
                                {/* {formData.useStatus !== 'Never Used' && formData.useStatus !== '' && (
                                    <Row>
                                        <Col xs={12}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Summary</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name="summary"
                                                    value={formData.summary}
                                                    onChange={handleInputChange}
                                                    placeholder="Doctor's interpretation or quick summary"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )} */}
                            </div>
                            <div className="d-flex justify-content-end mt-3 align-items-center gap-2">
                                {toEdit && (
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={handleReset}
                                        className="px-3 py-1"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="custom-buttons px-4 py-1"
                                >
                                    {(isCreating || isUpdating) && (
                                        <Spinner color='white' className="me-1 spinner-border-sm" />
                                    )}
                                    {toEdit ? 'Update Record' : 'Add Record'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </div>
            </Col>

            {/* Right Side - Display */}
            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="px-2 py-1 p-0">
                    {isLoading ? (
                        <div className="text-center py-4">
                            <Spinner />
                        </div>
                    ) : !alcoholHistory?.length ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-journal-x fs-1"></i>
                            <p className="mt-2 mb-0">No alcohol use records found</p>
                        </div>
                    ) : (
                        <Accordion alwaysOpen flush>
                            {alcoholHistory?.map((item, index) => (
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
                                                    {item?.useStatus?.length > 35
                                                        ? item?.useStatus?.slice(0, 34) + '...'
                                                        : item?.useStatus || 'No status'}{' '}
                                                    <span className="fs-6 text-muted fw-semibold">
                                                        {item?.alcoholType && `(${item?.alcoholType})`}
                                                    </span>
                                                </span>
                                                <small className="text-black" style={{ fontSize: '12px' }}>
                                                    (
                                                    {item?.effectiveDateTime
                                                        ? new Date(item?.effectiveDateTime).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
                                                        : 'No date'}
                                                    -
                                                    {item?.effectiveDateTime
                                                        ? new Date(item?.effectiveDateTime).toLocaleTimeString()
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
                                                        setToDelete(item?._id);
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

                                    <Accordion.Body className="pt-0 p-0 ">
                                        {item?.note?.[0]?.text ? (
                                            <div
                                                className="ql-editor p-1 rounded scroll-container notes-scroll"
                                                dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                style={{ fontSize: '0.875rem', overflowY: 'scroll', height: '150px' }}
                                            />
                                        ) : (
                                            <div className="text-muted fst-italic p-2">No notes available</div>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                </Card.Body>
            </Col>

            <DeletionModal
                show={deleteModal}
                onHide={closeDeleteModal}
                onConfirm={deleteHistory}
                item="alcohol history record"
                isLoading={isDeleting}
            />
        </Row>
    );
};

export default AlcoholHistory;
