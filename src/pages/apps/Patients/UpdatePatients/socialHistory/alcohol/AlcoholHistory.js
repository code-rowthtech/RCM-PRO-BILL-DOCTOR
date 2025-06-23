import React, { useState } from 'react';
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AlcoholHistory = () => {
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
        reasonForStopping: ''
    });

    // Static data
    const alcoholData = [
        {
            _id: '1',
            useStatus: 'Current User',
            alcoholType: 'Beer and Wine',
            frequency: 'Weekly',
            quantityPerOccasion: '3 or 4',
            note: [{ text: '<p>Patient reports drinking 3-4 beers weekly, mostly on weekends. No dependence symptoms reported.</p>' }],
            effectiveDateTime: '2023-05-15T14:30:00Z'
        },
        {
            _id: '2',
            useStatus: 'Former User',
            ageOfFirstUse: 18,
            lastUseDate: '2020-01-10',
            reasonForStopping: 'Health concerns',
            note: [{ text: '<p>Patient was a heavy drinker in their 20s but stopped in 2020 due to liver concerns.</p>' }],
            effectiveDateTime: '2023-05-10T10:15:00Z'
        }
    ];

    const MAX_WORDS = 1000;
    const wordCount = formData.note ? formData.note.split(/\s+/).filter(Boolean).length : 0;
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);

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
            useStatus: '',
            alcoholType: '',
            frequency: '',
            quantityPerOccasion: '',
            hasDependenceSymptoms: false,
            heavyIntakeFrequency: '',
            note: '<ul><li></li></ul>',
            ageOfFirstUse: '',
            lastUseDate: '',
            reasonForStopping: ''
        });
    };

    const handleReset = () => {
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
            reasonForStopping: ''
        });
        setToEdit(null);
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleQuillChange = (content) => {
        setFormData({
            ...formData,
            note: content
        });
    };

    return (
        <Row className="scroll-container" style={{ overflowY: 'scroll', overflowX: 'hidden', height: "100%" }}>
            {/* Left Side - Form */}
            <Col md={6} className="d-flex border-end px-0 flex-column pt-0 mt-0 pe-1 ">
                <div className="h-100 ">
                    <Card.Body className="d-flex flex-column pt-0 px-0 pb-2 mt-0">
                        <Form onSubmit={handleSubmit}>
                            <div style={{ maxHeight: '48vh' }} className='d-flex px-2 scroll-container flex-column justify-content-between'>
                                <Row>
                                    <Col sm={12}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Alcohol Use Status</Form.Label>
                                            <Form.Select
                                                name="useStatus"
                                                value={formData.useStatus}
                                                onChange={handleInputChange}
                                                required
                                            >
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
                                                <Form.Label className='mb-0'>Alcohol use frequency</Form.Label>
                                                <Form.Select 
                                                    name="frequency"
                                                    value={formData.frequency}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option key='' value=''>Select</option>
                                                    {['Occasionally', 'Weekly', 'Daily', 'Heavy', 'Unknown']?.map((data) => {
                                                        return <option value={data} key={data}>{data}</option>;
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Standard drinks per occasion</Form.Label>
                                                <Form.Select 
                                                    name="quantityPerOccasion"
                                                    value={formData.quantityPerOccasion}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option key='' value=''>Select</option>
                                                    {['1 or 2', '3 or 4', '5 or 6', '7 to 9', '10 or more']?.map((data) => {
                                                        return <option value={data} key={data}>{data}</option>;
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        {formData.frequency === 'Heavy' &&
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className='mb-0'>Heavy intake frequency</Form.Label>
                                                    <Form.Select 
                                                        name="heavyIntakeFrequency"
                                                        value={formData.heavyIntakeFrequency}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option key='' value=''>Select</option>
                                                        {['Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily']?.map((data) => {
                                                            return <option value={data} key={data}>{data}</option>;
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        }

                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>What types of alcohol do you usually consume?</Form.Label>
                                                <Form.Select 
                                                    name="alcoholType"
                                                    value={formData.alcoholType}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option key='' value=''>Select</option>
                                                    {['Beer', 'Wine', 'Spirits', 'Other', 'All']?.map((data) => {
                                                        return <option value={data} key={data}>{data}</option>;
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Do you experience dependence symptoms (e.g., craving, withdrawal)?</Form.Label>
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
                                                <Form.Label className='mb-0'>Age when you started using alcohol</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    name="ageOfFirstUse"
                                                    value={formData.ageOfFirstUse}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Date of last alcohol use</Form.Label>
                                                <Form.Control 
                                                    type="date" 
                                                    max={new Date().toISOString().slice(0, 10)} 
                                                    name="lastUseDate"
                                                    value={formData.lastUseDate}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-1">
                                                <Form.Label className='mb-0'>Reason for stopping alcohol use</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows={2} 
                                                    name="reasonForStopping"
                                                    value={formData.reasonForStopping}
                                                    onChange={handleInputChange}
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
                                                        {`${wordCount} / ${MAX_WORDS} words`}
                                                    </small>
                                                </Form.Label>
                                                <ReactQuill
                                                    value={formData.note}
                                                    onChange={handleQuillChange}
                                                    theme="snow"
                                                    placeholder="Enter detailed notes here..."
                                                    style={{ height: '270px', backgroundColor: 'white' }}
                                                    modules={{
                                                        toolbar: [
                                                            [{ header: [1, 2, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ list: 'ordered' }, { list: 'bullet' }],
                                                            ['clean'],
                                                        ],
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}
                            </div>
                            <div className="d-flex justify-content-end mt-3 align-items-center">
                                <Button variant="primary" type="submit" className="custom-buttons px-4 py-1">
                                    {toEdit ? 'Update' : 'Add'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </div>
            </Col>

            {/* Right Side - Display */}
            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="px-2 py-1 p-0">
                    {alcoholData?.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-journal-x fs-1"></i>
                            <p className="mt-2 mb-0">No alcohol use records found</p>
                        </div>
                    ) : (
                        <Accordion alwaysOpen flush>
                            {alcoholData?.map((item, index) => (
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
                                                    {item?.useStatus?.length > 35 ?
                                                        item?.useStatus?.slice(0, 34) + '...' :
                                                        item?.useStatus || ''} <span className='fs-6 text-muted fw-semibold'>
                                                        {item?.alcoholType && `(${item?.alcoholType})`}
                                                    </span>
                                                </span>
                                                <small className="text-black" style={{ fontSize: '12px' }}>
                                                    {item?.effectiveDateTime
                                                        ? `${new Date(item?.effectiveDateTime).toLocaleDateString()} (${new Date(item?.effectiveDateTime).toLocaleTimeString()})`
                                                        : 'No date'}
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
                                                        className="bi bi-pencil text-info cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setToEdit(item);
                                                            setFormData({
                                                                useStatus: item.useStatus || '',
                                                                alcoholType: item.alcoholType || '',
                                                                frequency: item.frequency || '',
                                                                quantityPerOccasion: item.quantityPerOccasion || '',
                                                                hasDependenceSymptoms: item.hasDependenceSymptoms || false,
                                                                heavyIntakeFrequency: item.heavyIntakeFrequency || '',
                                                                note: item.note?.[0]?.text || '<ul><li></li></ul>',
                                                                ageOfFirstUse: item.ageOfFirstUse || '',
                                                                lastUseDate: item.lastUseDate || '',
                                                                reasonForStopping: item.reasonForStopping || ''
                                                            });
                                                        }}
                                                        title="Edit"
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
                                <p>Are you sure you want to delete this alcohol history record?</p>
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

export default AlcoholHistory;