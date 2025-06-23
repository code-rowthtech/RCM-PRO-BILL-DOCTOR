import React, { useRef, useState } from 'react';
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import { Controller, useForm } from 'react-hook-form';

const MedicalHistory = () => {
    const { control } = useForm();
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null);
    const [formData, setFormData] = useState({
        problem: null,
        startDate: '',
        endDate: '',
        note: '<ul><li></li></ul>'
    });
    const quillRef = useRef();

    const medicalHistory = [
        {
            _id: '1',
            code: {
                coding: [{
                    system: 'http://hl7.org/fhir/condition-code',
                    code: 'E11.9',
                    display: 'Type 2 diabetes mellitus without complications'
                }],
                text: 'Type 2 diabetes mellitus without complications'
            },
            effectivePeriod: {
                start: '2020-01-15',
                end: '2023-05-20'
            },
            note: [{
                text: '<p>Patient diagnosed with Type 2 diabetes in 2020. Currently managed with metformin 500mg twice daily. Last HbA1c was 6.8%.</p>',
                time: '2023-05-20T10:30:00Z'
            }]
        },
        {
            _id: '2',
            code: {
                coding: [{
                    system: 'http://hl7.org/fhir/condition-code',
                    code: 'I10',
                    display: 'Essential (primary) hypertension'
                }],
                text: 'Essential (primary) hypertension'
            },
            effectivePeriod: {
                start: '2018-03-10',
                end: ''
            },
            note: [{
                text: '<p>Patient has history of hypertension since 2018. Currently on lisinopril 10mg daily. Blood pressure well controlled.</p>',
                time: '2023-05-20T10:32:00Z'
            }]
        }
    ];

    const formattedOptions = [
        { value: 'E11.9', label: 'Type 2 diabetes mellitus without complications - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Type 2 diabetes mellitus without complications' },
        { value: 'I10', label: 'Essential (primary) hypertension - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Essential (primary) hypertension' },
        { value: 'J18.9', label: 'Pneumonia, unspecified - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Pneumonia, unspecified' },
        { value: 'M54.5', label: 'Low back pain - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Low back pain' },
        { value: 'E78.5', label: 'Hyperlipidemia, unspecified - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Hyperlipidemia, unspecified' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Static form submission handling
        if (toEdit) {
            // Update logic would go here
            setToEdit(null);
        } else {
            // Create logic would go here
        }
        setFormData({
            problem: null,
            startDate: '',
            endDate: '',
            note: '<ul><li></li></ul>'
        });
        setSelectedProblem(null);
    };

    const handleReset = () => {
        setToEdit(null);
        setSelectedProblem(null);
        setFormData({
            problem: null,
            startDate: '',
            endDate: '',
            note: '<ul><li></li></ul>'
        });
    };

    const handleEditorFocus = () => {
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        setFormData({
            ...formData,
            note: `${formData.note}<p>${suggestionText}</p>`
        });
    };

    const deleteHistory = () => {
        // Static delete handling
        setToDelete(null);
        setDeleteModal(false);
    };

    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    };

    const wordCount = formData.note ? formData.note.split(/\s+/).filter(Boolean).length : 0;
    const MAX_WORDS = 1000;

    return (
        <Row className="py-0 m-auto mt-0">
            {/* Left: Form Section */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2 scroll-container">
                <Card.Body className="p-0 ">
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
                            <Col xs={12}>
                                <Form.Group controlId="problem">
                                    <Form.Label className="fw-medium mb-1">Medical Problem</Form.Label>
                                    {/* <Select
                                        classNamePrefix="select"
                                        options={formattedOptions}
                                        value={selectedProblem || null}
                                        onChange={(selected) => {
                                            setSelectedProblem(selected);
                                            setFormData({ ...formData, problem: selected });
                                        }}
                                        placeholder="Search Problem"
                                        isClearable
                                        isSearchable
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                            }),
                                        }}
                                    /> */}
                                    <Form.Select >
                                        <option value='' key='' hidden>Select an option</option>

                                        <option value='Option 1'>Option 1</option>
                                        <option value='Option 2'>Option 2</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mt-0'>
                                <Form.Group controlId="startDate">
                                    <Form.Label className="fw-medium mb-1">Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        max={new Date().toISOString().slice(0, 10)}
                                        className="form-control-sm"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mt-0'>
                                <Form.Group controlId="endDate">
                                    <Form.Label className="fw-medium mb-1">End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="form-control-sm"
                                        min={formData.startDate || undefined}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} className='mt-1'>
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
                                    {/* <ReactQuill
                                        value={formData.note}
                                        onChange={(content) => setFormData({ ...formData, note: content })}
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
                                    /> */}
                                    <div className='scroll-container' style={{ height: '30vh' }}>
                                        <Controller
                                            name="note"
                                            control={control}
                                            defaultValue="<ul><li></li></ul>"
                                            render={({ field: { onChange, value } }) => (
                                                <ReactQuill
                                                    ref={quillRef}
                                                    value={value}
                                                    onChange={(content, delta, source) => {
                                                        if (source === 'user') onChange(content);
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
                        <Row>
                            <Col sm={12} className="d-flex justify-content-end my-1">
                                <Button
                                    type="submit"
                                    className="custom-buttons">
                                    {toEdit ? 'Update' : 'Add Record'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Col>

            {/* Right: History Section */}
            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="ps-2 py-1 p-0">
                    {medicalHistory?.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-journal-x fs-1"></i>
                            <p className="mt-2 mb-0">No medical history records found</p>
                        </div>
                    ) : (
                        <Accordion alwaysOpen flush>
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
                                                        title="Cancel"
                                                    />
                                                ) : (
                                                    <i
                                                        className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setToEdit(item);
                                                            setFormData({
                                                                problem: formattedOptions.find(
                                                                    opt => opt.value === item?.code?.coding?.[0]?.code &&
                                                                        opt.display === item?.code?.coding?.[0]?.display
                                                                ) || null,
                                                                startDate: item?.effectivePeriod?.start || '',
                                                                endDate: item?.effectivePeriod?.end || '',
                                                                note: item?.note?.[0]?.text || '<ul><li></li></ul>'
                                                            });
                                                            setSelectedProblem(formattedOptions.find(
                                                                opt => opt.value === item?.code?.coding?.[0]?.code &&
                                                                    opt.display === item?.code?.coding?.[0]?.display
                                                            ) || null);
                                                        }}
                                                        title="Edit"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Accordion.Header>

                                    <Accordion.Body className="pt-0 p-0">
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

            {/* Deletion Modal - Static version */}
            {deleteModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this medical history record?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={deleteHistory}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Row>
    );
};

export default MedicalHistory;