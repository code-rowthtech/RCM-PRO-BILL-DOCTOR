import React, { useRef, useState } from 'react';
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import { Controller, useForm } from 'react-hook-form';

const SurgicalHistory = () => {
    const [selectedIcdProcedure, setSelectedIcdProcedure] = useState(null);
    const [bodySiteSelected, setBodySiteSelected] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [toEdit, setToEdit] = useState(null);
    const { control } = useForm();
    const quillRef = useRef();

    const [formData, setFormData] = useState({
        effectiveDateTime: '',
        bodySite: '',
        note: '<ul><li></li></ul>'
    });

    // Static data
    const surgicalHistory = [
        {
            _id: '1',
            code: {
                coding: [{
                    system: '',
                    code: '0DBJ4ZZ',
                    display: 'Laparoscopic cholecystectomy'
                }],
                text: 'Laparoscopic cholecystectomy'
            },
            bodySite: [{
                coding: [{
                    system: 'http://snomed.info/sct',
                    code: '181216001',
                    display: 'Gallbladder structure'
                }],
                text: 'Gallbladder'
            }],
            note: [{
                text: '<p>Patient underwent laparoscopic cholecystectomy for symptomatic gallstones. Procedure was uneventful with no complications.</p>',
                time: '2022-03-15T14:30:00Z'
            }],
            performedDateTime: '2022-03-15'
        },
        {
            _id: '2',
            code: {
                coding: [{
                    system: '',
                    code: '0T9B70Z',
                    display: 'Total knee replacement'
                }],
                text: 'Total knee replacement'
            },
            bodySite: [{
                coding: [{
                    system: 'http://snomed.info/sct',
                    code: '72696002',
                    display: 'Knee joint structure'
                }],
                text: 'Right knee'
            }],
            note: [{
                text: '<p>Patient underwent total knee arthroplasty for severe osteoarthritis. Post-op recovery was good with physical therapy.</p>',
                time: '2020-08-22T10:15:00Z'
            }],
            performedDateTime: '2020-08-22'
        }
    ];

    const procedureOptions = [
        { label: 'Laparoscopic cholecystectomy', value: '0DBJ4ZZ' },
        { label: 'Total knee replacement', value: '0T9B70Z' },
        { label: 'Appendectomy', value: '0DTJ4ZZ' },
        { label: 'Coronary artery bypass', value: '021009W' },
        { label: 'Cataract surgery', value: '08R53JZ' }
    ];

    const bodySite = [
        { code: '181216001', display: 'Gallbladder structure', system: 'http://snomed.info/sct' },
        { code: '72696002', display: 'Knee joint structure', system: 'http://snomed.info/sct' },
        { code: '54066008', display: 'Appendix structure', system: 'http://snomed.info/sct' },
        { code: '80891009', display: 'Heart structure', system: 'http://snomed.info/sct' },
        { code: '81745001', display: 'Eye structure', system: 'http://snomed.info/sct' }
    ];

    const MAX_WORDS = 1000;
    const wordCount = formData.note ? formData.note.split(/\s+/).filter(Boolean).length : 0;

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
            effectiveDateTime: '',
            bodySite: '',
            note: '<ul><li></li></ul>'
        });
        setSelectedIcdProcedure(null);
        setBodySiteSelected(null);
    };

    const handleReset = () => {
        setToEdit(null);
        setSelectedIcdProcedure(null);
        setBodySiteSelected(null);
        setFormData({
            effectiveDateTime: '',
            bodySite: '',
            note: '<ul><li></li></ul>'
        });
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
            {/* Left: Form Section */}
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
                            <Col sm={12}>
                                <Form.Group>
                                    <Form.Label className="fw-medium mb-0">Diagnosis</Form.Label>
                                    <Select
                                        options={procedureOptions}
                                        isSearchable
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="&nbsp; Select "
                                        value={selectedIcdProcedure || null}
                                        onChange={(selected) => {
                                            setSelectedIcdProcedure(selected);
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
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mt-0">
                                <Form.Group controlId="effectiveDateTime">
                                    <Form.Label className="fw-medium mb-0">Date & Time</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.effectiveDateTime}
                                        onChange={(e) => setFormData({ ...formData, effectiveDateTime: e.target.value })}
                                        max={new Date().toISOString().slice(0, 10)}
                                        className="form-control-sm"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mt-0">
                                <Form.Group>
                                    <Form.Label className="fw-medium mb-0">Body Site</Form.Label>
                                    <Form.Select
                                        value={formData.bodySite}
                                        onChange={(e) => {
                                            const selectedCode = e.target.value;
                                            setFormData({ ...formData, bodySite: selectedCode });
                                            const selectedBodySite = bodySite.find(
                                                (site) => site?.code === selectedCode
                                            );
                                            setBodySiteSelected(selectedBodySite);
                                        }}>
                                        <option key="" value="" hidden>
                                            Select...
                                        </option>
                                        {bodySite?.map((data) => (
                                            <option key={data?.code} value={data?.code}>
                                                {data?.display}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col xs={12} className="mt-1">
                                <Form.Group controlId="notes">
                                    <Form.Label className="fw-medium mb-1 d-flex justify-content-between align-items-center">
                                        <div>
                                            Notes{' '}
                                            <span
                                                style={{ cursor: 'pointer' }}
                                                title="Notes Suggestions"
                                                onClick={handleEditorFocus}>
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
                    {surgicalHistory?.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-journal-x fs-1"></i>
                            <p className="mt-2 mb-0">No surgical records found</p>
                        </div>
                    ) : (
                        <Accordion alwaysOpen flush>
                            {surgicalHistory?.map((item, index) => (
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
                                                    {item.code?.coding?.[0]?.display || 'No description'}
                                                </span>
                                                <small className="text-black" style={{ fontSize: '12px' }}>
                                                    (
                                                    {item?.performedDateTime
                                                        ? new Date(item.performedDateTime).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
                                                        : 'No date'}
                                                    -{item.bodySite?.[0]?.coding?.[0]?.display || 'No site'})
                                                </small>
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
                                                            setSelectedIcdProcedure(procedureOptions.find(
                                                                opt => opt.value === item?.code?.coding?.[0]?.code
                                                            ) || null);
                                                            setBodySiteSelected(item?.bodySite?.[0]?.coding?.[0] || null);
                                                            setFormData({
                                                                effectiveDateTime: item?.performedDateTime || '',
                                                                bodySite: item?.bodySite?.[0]?.coding?.[0]?.code || '',
                                                                note: item?.note?.[0]?.text || '<ul><li></li></ul>'
                                                            });
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
                                <p>Are you sure you want to delete this surgical history record?</p>
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

export default SurgicalHistory;