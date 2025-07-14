import React, { useRef, useState } from 'react';
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import { Controller, useForm } from 'react-hook-form';
import DeletionModal from 'helpers/DeletionModal';
import { useSelector } from 'react-redux';

const FamilyHistory = () => {
    const [rela, setRela] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { control } = useForm();
    const store = useSelector((state)=>state)
    const quillRef = useRef();
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        sex: '',
        problem: null,
        deceased: 'no',
        dateOfDeath: '',
        note: '<ul><li></li></ul>'
    });

    // Static data
    const familyGeneticHistory = [
        {
            _id: '1',
            name: 'John Doe',
            relationship: {
                coding: [{ code: 'FTH', display: 'Father' }],
                text: 'Father'
            },
            gender: 'Male',
            bornDate: '1950-05-15',
            deceasedBoolean: true,
            deceasedDate: '2020-03-10',
            condition: [{
                code: {
                    coding: [{
                        system: 'http://hl7.org/fhir/condition-code',
                        code: 'I25.10',
                        display: 'Atherosclerotic heart disease'
                    }],
                    text: 'Heart disease'
                }
            }],
            note: [{
                text: '<p>Father had a history of coronary artery disease. Had bypass surgery in 2010. Died from myocardial infarction in 2020.</p>'
            }]
        },
        {
            _id: '2',
            name: 'Mary Smith',
            relationship: {
                coding: [{ code: 'MTH', display: 'Mother' }],
                text: 'Mother'
            },
            gender: 'Female',
            bornDate: '1955-08-22',
            deceasedBoolean: false,
            condition: [{
                code: {
                    coding: [{
                        system: 'http://hl7.org/fhir/condition-code',
                        code: 'E11.65',
                        display: 'Type 2 diabetes mellitus with hyperglycemia'
                    }],
                    text: 'Diabetes'
                }
            }],
            note: [{
                text: '<p>Mother has type 2 diabetes diagnosed at age 60. Currently managed with oral medications.</p>'
            }]
        }
    ];

    const relationshipOption = [
        { value: { code: 'FTH', display: 'Father' }, label: 'Father' },
        { value: { code: 'MTH', display: 'Mother' }, label: 'Mother' },
        { value: { code: 'BRO', display: 'Brother' }, label: 'Brother' },
        { value: { code: 'SIS', display: 'Sister' }, label: 'Sister' },
        { value: { code: 'GRNDFTH', display: 'Grandfather' }, label: 'Grandfather' }
    ];

    const sexAssignedAtBirthOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'unknown', label: 'Unknown' }
    ];

    const formattedOptions = [
        { value: 'I25.10', label: 'Atherosclerotic heart disease - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Atherosclerotic heart disease' },
        { value: 'E11.65', label: 'Type 2 diabetes mellitus - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Type 2 diabetes mellitus' },
        { value: 'C34.90', label: 'Lung cancer - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Lung cancer' },
        { value: 'I10', label: 'Hypertension - ICD-10', system: 'http://hl7.org/fhir/condition-code', display: 'Hypertension' }
    ];

    const MAX_WORDS = 1000;
    const wordCount = formData.note ? formData.note.split(/\s+/).filter(Boolean).length : 0;
    const isDeceased = formData.deceased === 'yes';

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
    };

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

    const handleRelationChange = (selectedOption) => {
        setRela(selectedOption ? selectedOption.value : null);
    };

    const handleEditorFocus = () => {
        setShowSuggestions(true);
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

    return (
        <Row className="py-0 m-auto">
            {/* Left Side - Form */}
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
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label className="fw-medium mb-0">Name</Form.Label>
                                    <Form.Control
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="form-control-sm"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mt-0">
                                <Form.Group controlId="dob">
                                    <Form.Label className="fw-medium mb-0">Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="form-control-sm"
                                        max={new Date().toISOString().slice(0, 10)}
                                    />
                                </Form.Group>
                            </Col>
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
                                    />
                                </Form.Group>
                            </Col>
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

                            {isDeceased && (
                                <Col md={6}>
                                    <Form.Group controlId="dateOfDeath">
                                        <Form.Label className="fw-medium mb-0">Date of Death</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.dateOfDeath}
                                            onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                                            className="form-control-sm"
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </Form.Group>
                                </Col>
                            )}

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
                        <div className="d-flex justify-content-end align-items-end pe-1 py-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="px-4 py-1 custom-buttons">
                                {toEdit ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Col>

            {/* Right Side - Display */}
            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="ps-2 py-1 p-0">
                    {familyGeneticHistory?.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-journal-x fs-1"></i>
                            <p className="mt-2 mb-0">No family records found</p>
                        </div>
                    ) : (
                        <Accordion alwaysOpen flush>
                            {familyGeneticHistory.map((item, index) => (
                                <Accordion.Item eventKey={index.toString()} key={index} className="rounded-1">
                                    <Accordion.Header>
                                        <div
                                            className="d-flex justify-content-between align-items-center w-100"
                                            style={{ marginRight: '-19px' }}>
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

                                            <div className="d-flex gap-2 px-2" onClick={(e) => e.stopPropagation()}>
                                                <i
                                                    className="bi bi-trash text-danger cursor-pointer"
                                                    onClick={() => {
                                                        setToDelete(item?._id);
                                                        setDeleteModal(true);
                                                    }}
                                                    title="Delete"
                                                />
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
                                                            setToEdit(item);
                                                            setRela(item.relationship?.coding?.[0] || null);
                                                            setSelectedProblem(formattedOptions.find(
                                                                opt => opt.value === item?.condition?.[0]?.code?.coding?.[0]?.code
                                                            ) || null);
                                                            setFormData({
                                                                name: item.name || '',
                                                                dob: item.bornDate || '',
                                                                sex: sexAssignedAtBirthOptions.find(
                                                                    opt => opt.label === item.gender
                                                                )?.value || '',
                                                                problem: null,
                                                                deceased: item.deceasedBoolean ? 'yes' : 'no',
                                                                dateOfDeath: item.deceasedDate || '',
                                                                note: item.note?.[0]?.text || '<ul><li></li></ul>'
                                                            });
                                                        }}
                                                        title="Edit"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Accordion.Header>

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
                                                <span className="ms-2 text-muted fst-italic"> No notes available</span>
                                            )}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                </Card.Body>
            </Col>

            {/* Deletion Modal - Static version */}
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

export default FamilyHistory;