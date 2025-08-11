// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React, { useEffect, useRef, useState } from 'react';

// UI Components
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';

// Form Management
import { Controller, useForm } from 'react-hook-form';

// Redux & State Management
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

// Custom Components & Utilities
import DeletionModal from 'helpers/DeletionModal';
import Spinner from 'constants/Spinner';
import { encryptMessage } from 'cryptoUtils';

// Redux Actions
import {
    createFamilyGeneticAction,
    deleteFamilyGeneticAction,
    getFamilyGeneticAction,
    updateFamilyGeneticaction
} from 'redux/socialHistory/action';

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

const FamilyHistory = () => {
    // ========================================================================
    // HOOKS & STATE INITIALIZATION
    // ========================================================================

    const dispatch = useDispatch();
    const { control } = useForm();
    const [searchParams] = useSearchParams();
    const store = useSelector((state) => state);
    const quillRef = useRef();

    // Extract patient ID from URL parameters
    const patientId = searchParams.get('id');

    // ========================================================================
    // COMPONENT STATE
    // ========================================================================

    // Form-related state
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        sex: '',
        problem: null,
        deceased: 'no',
        dateOfDeath: '',
        note: '<ul><li></li></ul>'
    });

    // Selection state
    const [rela, setRela] = useState(null); // Selected relationship
    const [selectedProblem, setSelectedProblem] = useState(null); // Selected medical condition

    // Modal and editing state
    const [toDelete, setToDelete] = useState(null); // Item to be deleted
    const [toEdit, setToEdit] = useState(null); // Item being edited
    const [deleteModal, setDeleteModal] = useState(false); // Delete modal visibility
    const [showSuggestions, setShowSuggestions] = useState(false); // Notes suggestions visibility

    // ========================================================================
    // REDUX STATE SELECTORS
    // ========================================================================

    // API response status tracking
    const createFamilyHistorySuccess = store?.createFamilyGeneticReducer?.data?.status;
    const updateFamilyHistorySuccess = store?.updateFamilyGeneticReducer?.data?.status;
    const deleteFamilyHistorySuccess = store?.deleteFamilyGenticReducer?.data?.status;

    // Family history data from store
    const familyGeneticHistory = store?.getFamilyGeneticReducer?.data?.familyMedicalHistory;

    // ========================================================================
    // SIDE EFFECTS
    // ========================================================================

    // Initial data fetch on component mount
    useEffect(() => {
        dispatch(getFamilyGeneticAction({ patientId }));
    }, [dispatch, patientId]);

    // Handle successful family history creation
    useEffect(() => {
        if (createFamilyHistorySuccess === 201) {
            dispatch(getFamilyGeneticAction({ patientId }));
            handleReset();
        }
    }, [createFamilyHistorySuccess, dispatch, patientId]);

    // Handle successful family history update
    useEffect(() => {
        if (updateFamilyHistorySuccess === 200) {
            dispatch(getFamilyGeneticAction({ patientId }));
            handleReset();
            setToEdit(null);
        }
    }, [updateFamilyHistorySuccess, dispatch, patientId]);

    // Handle successful family history deletion
    useEffect(() => {
        if (deleteFamilyHistorySuccess === 200) {
            dispatch(getFamilyGeneticAction({ patientId }));
            setDeleteModal(false);
            setToDelete(null);
        }
    }, [deleteFamilyHistorySuccess, dispatch, patientId]);

    // ========================================================================
    // CONSTANTS & STATIC DATA
    // ========================================================================

    // Family relationship options for dropdown
    const relationshipOption = [
        { value: { code: 'FTH', display: 'Father' }, label: 'Father' },
        { value: { code: 'MTH', display: 'Mother' }, label: 'Mother' },
        { value: { code: 'BRO', display: 'Brother' }, label: 'Brother' },
        { value: { code: 'SIS', display: 'Sister' }, label: 'Sister' },
        { value: { code: 'GRNDFTH', display: 'Grandfather' }, label: 'Grandfather' }
    ];

    // Gender/sex options
    const sexAssignedAtBirthOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'unknown', label: 'Unknown' }
    ];

    // Medical conditions with ICD-10 codes
    const formattedOptions = [
        {
            value: 'I25.10',
            label: 'Atherosclerotic heart disease - ICD-10',
            system: 'http://hl7.org/fhir/condition-code',
            display: 'Atherosclerotic heart disease'
        },
        {
            value: 'E11.65',
            label: 'Type 2 diabetes mellitus - ICD-10',
            system: 'http://hl7.org/fhir/condition-code',
            display: 'Type 2 diabetes mellitus'
        },
        {
            value: 'C34.90',
            label: 'Lung cancer - ICD-10',
            system: 'http://hl7.org/fhir/condition-code',
            display: 'Lung cancer'
        },
        {
            value: 'I10',
            label: 'Hypertension - ICD-10',
            system: 'http://hl7.org/fhir/condition-code',
            display: 'Hypertension'
        }
    ];

    // Form validation constants
    const MAX_WORDS = 1000;

    // ========================================================================
    // COMPUTED VALUES
    // ========================================================================

    const wordCount = formData.note ? formData.note.split(/\s+/).filter(Boolean).length : 0;
    const isDeceased = formData.deceased === 'yes';

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    /**
     * Handles form submission for creating or updating family history
     * Transforms form data into FHIR-compliant format before API call
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare FHIR-compliant data structure
        const submitData = {
            subject: patientId,
            relationship: rela ? {
                coding: [{
                    code: rela.code,
                    display: rela.display
                }],
                text: rela.display
            } : null,
            name: formData.name,
            gender: formData.sex ? formData.sex.charAt(0).toUpperCase() + formData.sex.slice(1) : null,
            bornDate: formData.dob || null,
            deceasedBoolean: isDeceased,
            deceasedDate: isDeceased ? formData.dateOfDeath : null,
            condition: selectedProblem ? [{
                code: {
                    coding: [{
                        system: selectedProblem.system,
                        code: selectedProblem.value,
                        display: selectedProblem.display
                    }],
                    text: selectedProblem.label
                }
            }] : [],
            note: formData.note ? [{ text: formData.note }] : []
        };

        if (toEdit) {
            // Update existing family history record
            const updateData = { ...submitData, id: toEdit._id };
            dispatch(updateFamilyGeneticaction({ key: encryptMessage(updateData) }));
        } else {
            // Create new family history record
            dispatch(createFamilyGeneticAction({ key: encryptMessage(submitData) }));
        }
    };

    /**
     * Resets form to initial state and clears all selections
     */
    const handleReset = () => {
        setFormData({
            name: '',
            dob: '',
            sex: '',
            problem: null,
            deceased: 'no',
            dateOfDeath: '',
            note: '<ul><li></li></ul>'
        });
        setRela(null);
        setSelectedProblem(null);
        setToEdit(null);
    };

    /**
     * Handles relationship dropdown selection change
     */
    const handleRelationChange = (selectedOption) => {
        setRela(selectedOption ? selectedOption.value : null);
    };

    /**
     * Shows notes suggestions when editor is focused
     */
    const handleEditorFocus = () => {
        setShowSuggestions(true);
    };

    /**
     * Initiates deletion of selected family history record
     */
    const deleteHistory = () => {
        dispatch(deleteFamilyGeneticAction({ id: toDelete }));
    };

    /**
     * Closes delete confirmation modal and resets delete state
     */
    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <Row className="py-0 m-auto">
            {/* ================================================================ */}
            {/* LEFT PANEL - FAMILY HISTORY FORM */}
            {/* ================================================================ */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2 scroll-container">
                <Card.Body className="p-0">
                    <Form
                        onSubmit={handleSubmit}
                        style={{
                            minHeight: 'calc(100vh - 330px)',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'end',
                        }}>
                        <Row className="g-3">
                            {/* Relationship Selection */}
                            <Col md={6}>
                                <Form.Group controlId="relationship">
                                    <Form.Label className="fw-medium mb-0">Relationship</Form.Label>
                                    <Select
                                        options={relationshipOption}
                                        isSearchable
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="Select relationship"
                                        value={rela ? relationshipOption.find((opt) => opt.value.code === rela.code) : null}
                                        onChange={handleRelationChange}
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
                                </Form.Group>
                            </Col>
                            {/* Family Member Name */}
                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label className="fw-medium mb-0">Name</Form.Label>
                                    <Form.Control
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="form-control-sm"
                                        placeholder="Enter family member name"
                                    />
                                </Form.Group>
                            </Col>

                            {/* Date of Birth */}
                            <Col md={6} className="mt-0">
                                <Form.Group controlId="dob">
                                    <Form.Label className="fw-medium mb-0">Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="form-control-sm"
                                        max={new Date().toISOString().slice(0, 10)} // Prevent future dates
                                    />
                                </Form.Group>
                            </Col>

                            {/* Gender/Sex Selection */}
                            <Col md={6} className="mt-0">
                                <Form.Group controlId="sex">
                                    <Form.Label className="fw-medium mb-0">Sex</Form.Label>
                                    <Form.Select
                                        value={formData.sex}
                                        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                        className="form-select-sm">
                                        <option value="" disabled>
                                            Select Sex
                                        </option>
                                        {sexAssignedAtBirthOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {/* Medical Condition Selection */}
                            <Col md={6} className="mt-0">
                                <Form.Group controlId="problem">
                                    <Form.Label className="fw-medium mb-0">Condition</Form.Label>
                                    <Select
                                        classNamePrefix="select"
                                        options={formattedOptions}
                                        value={selectedProblem}
                                        onChange={(selected) => {
                                            setSelectedProblem(selected);
                                            setFormData({ ...formData, problem: selected });
                                        }}
                                        placeholder="Search condition"
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
                                </Form.Group>
                            </Col>

                            {/* Deceased Status */}
                            <Col md={6} className="mt-0">
                                <Form.Group controlId="deceased">
                                    <Form.Label className="fw-medium mb-0">Deceased</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            label="Yes"
                                            type="radio"
                                            value="yes"
                                            checked={formData.deceased === 'yes'}
                                            onChange={() => setFormData({ ...formData, deceased: 'yes' })}
                                            className="form-check-inline"
                                        />
                                        <Form.Check
                                            inline
                                            label="No"
                                            type="radio"
                                            value="no"
                                            checked={formData.deceased === 'no'}
                                            onChange={() => setFormData({ ...formData, deceased: 'no' })}
                                            className="form-check-inline"
                                        />
                                    </div>
                                </Form.Group>
                            </Col>

                            {/* Conditional Date of Death Field */}
                            {isDeceased && (
                                <Col md={6}>
                                    <Form.Group controlId="dateOfDeath">
                                        <Form.Label className="fw-medium mb-0">Date of Death</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.dateOfDeath}
                                            onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                                            className="form-control-sm"
                                            max={new Date().toISOString().split('T')[0]} // Prevent future dates
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {/* Rich Text Notes Editor */}
                            <Col xs={12} className="mt-0">
                                <Form.Group controlId="notes">
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
                                            {`${wordCount} / ${MAX_WORDS} words`}
                                        </small>
                                    </Form.Label>
                                    <div className='scroll-container' style={{ height: '30vh' }}>
                                        <Controller
                                            name="note"
                                            control={control}
                                            defaultValue={formData.note}
                                            render={({ field: { onChange, value } }) => (
                                                <ReactQuill
                                                    ref={quillRef}
                                                    value={formData.note}
                                                    onChange={(content, delta, source) => {
                                                        // Only update on user input to prevent infinite loops
                                                        if (source === 'user') {
                                                            onChange(content);
                                                            setFormData({ ...formData, note: content });
                                                        }
                                                    }}
                                                    theme="snow"
                                                    placeholder="Enter detailed notes here..."
                                                    style={{ height: '100%' }}
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
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Form Action Buttons */}
                        <div className="d-flex justify-content-end align-items-end pe-1 py-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={store?.createFamilyGeneticReducer?.loading}
                                className="px-4 py-1 custom-buttons">
                                {toEdit ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Col>

            {/* ================================================================ */}
            {/* RIGHT PANEL - FAMILY HISTORY DISPLAY */}
            {/* ================================================================ */}
            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="ps-2 py-1 p-0">
                    {/* Loading State */}
                    {store?.getFamilyGeneticReducer?.loading ? (
                        <div className="row">
                            <div className="col-12 py-5 d-flex justify-content-center align-items-center">
                                <Spinner />
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        familyGeneticHistory?.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-x fs-1"></i>
                                <p className="mt-2 mb-0">No family records found</p>
                            </div>
                        ) : (
                            /* Family History Records Display */
                            <Accordion alwaysOpen flush>
                                {/* Render each family history record */}
                                {familyGeneticHistory && familyGeneticHistory?.map((item, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index} className="rounded-1">
                                        {/* Accordion Header with Summary Info */}
                                        <Accordion.Header>
                                            <div
                                                className="d-flex justify-content-between align-items-center w-100"
                                                style={{ marginRight: '-19px' }}>
                                                {/* Family Member Summary */}
                                                <div className="d-flex align-items-center gap-1 p-2 pe-0">
                                                    <span className="text-black fs-6 tab-font-family fw-semibold">
                                                        {index + 1}.
                                                    </span>
                                                    <span className="fw-normal fs-6 tab-font-family text-black">
                                                        {item.name || 'Unnamed'} (
                                                        {item.relationship?.coding?.[0]?.display || 'Unknown'})
                                                    </span>
                                                    <span className="fw-normal fs-6 tab-font-family text-black">
                                                        had {item?.condition?.[0]?.code?.coding?.[0]?.display || 'None'}
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="d-flex gap-2 px-2" onClick={(e) => e.stopPropagation()}>
                                                    {/* Delete Button */}
                                                    <i
                                                        className="bi bi-trash text-danger cursor-pointer"
                                                        onClick={() => {
                                                            setToDelete(item?._id);
                                                            setDeleteModal(true);
                                                        }}
                                                        title="Delete"
                                                    />
                                                    {/* Edit/Cancel Button */}
                                                    {toEdit && toEdit._id === item._id ? (
                                                        <i
                                                            className="bi bi-x-lg text-danger cursor-pointer"
                                                            onClick={() => handleReset()}
                                                            title="Cancel"
                                                        />
                                                    ) : (
                                                        <i
                                                            className="bi bi-pencil text-info cursor-pointer"
                                                            onClick={() => {
                                                                // Populate form with selected record data for editing
                                                                setToEdit(item);
                                                                setRela(item.relationship?.coding?.[0] || null);
                                                                setSelectedProblem(formattedOptions.find(
                                                                    opt => opt.value === item?.condition?.[0]?.code?.coding?.[0]?.code
                                                                ) || null);
                                                                setFormData({
                                                                    name: item.name || '',
                                                                    dob: item.bornDate ? item.bornDate.split('T')[0] : '',
                                                                    sex: item.gender?.toLowerCase() || '',
                                                                    problem: null,
                                                                    deceased: item.deceasedBoolean ? 'yes' : 'no',
                                                                    dateOfDeath: item.deceasedDate ? item.deceasedDate.split('T')[0] : '',
                                                                    note: item.note?.[0]?.text || '<ul><li></li></ul>'
                                                                });
                                                            }}
                                                            title="Edit"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </Accordion.Header>

                                        {/* Accordion Body with Detailed Notes */}
                                        <Accordion.Body className="pt-0 p-2">
                                            <div className="mb-2">
                                                {item.note?.[0]?.text ? (
                                                    <div
                                                        className="ql-editor p-1 rounded scroll-container"
                                                        dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                        style={{
                                                            fontSize: '0.875rem',
                                                            maxHeight: '150px',
                                                            overflowY: 'auto',
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="ms-2 text-muted fst-italic">No notes available</span>
                                                )}
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )
                    )}
                </Card.Body>
            </Col>

            {/* ================================================================ */}
            {/* DELETION CONFIRMATION MODAL */}
            {/* ================================================================ */}
            <DeletionModal
                show={deleteModal}
                onHide={closeDeleteModal}
                onConfirm={deleteHistory}
                item="family history"
                isLoading={store?.deleteFamilyGenticReducer?.loading}
            />
        </Row>
    );
};

// ============================================================================
// EXPORT
// ============================================================================

export default FamilyHistory;