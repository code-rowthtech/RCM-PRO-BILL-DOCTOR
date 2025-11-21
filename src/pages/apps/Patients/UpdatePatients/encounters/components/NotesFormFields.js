import ToastHandle from 'helpers/ToastMessage';
import React, { createRef, useEffect, useRef } from 'react'
import { Form, Row, Accordion, Table, Button, Col } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { MdPrint } from 'react-icons/md';
import { Trash } from 'lucide-react';
import { FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import { handlePrintVitals } from 'helpers/printVitals';
import { handlePrintAutopopulatedFields } from 'helpers/printAutopopulatedFields';
import VitalsChart from './VitalsChart';

const NotesFormFields = ({
    data,
    excludedFields = [],
    control,
    expanded = true,
    isAccordionOpen = true,
    selectedFromList = {},
    populatedFields = {},
    removePopulatedData = () => { },
    patientDetails,
    attachedRecords = [],
    setAttachedRecords = () => { },
    handleFileUpload = () => { },
    uploadLoading = false,
    accordionState = {},
    setAccordionState = () => { },
    getValues = () => '',
    encounterData = null,
    patientVitals = []
}) => {
    const quillRefs = useRef({
        Subjective: createRef(),
        Objective: createRef(),
        Assessment: createRef(),
        Plan: createRef(),
        CarePlan: createRef(),
        Notes: createRef(),
    });
    const MAX_WORDS = 700;
    const MAX_WORD_LENGTH = 45;

    useEffect(() => {
        const sections = ['Subjective', 'Objective', 'Assessment', 'Plan', 'CarePlan', 'Notes'];

        sections.forEach(section => {
            const editor = quillRefs.current[section]?.current?.getEditor?.();
            if (!editor) return;

            let lastValidDelta = editor.getContents();

            editor.on('text-change', (delta, oldDelta, source) => {
                if (source !== 'user') return;

                setTimeout(() => {
                    const contents = editor.getContents();
                    const text = editor.getText().trim();
                    const words = text.split(/\s+/).filter(Boolean);

                    const longWord = words.find(word => word.length > MAX_WORD_LENGTH);

                    if (longWord || words.length > MAX_WORDS) {
                        editor.setContents(lastValidDelta);
                        ToastHandle(
                            longWord
                                ? `Word "${longWord}" exceeds max ${MAX_WORD_LENGTH} characters`
                                : `Maximum word limit of ${MAX_WORDS} exceeded`,
                            'danger'
                        );
                    } else {
                        lastValidDelta = contents;
                    }
                }, 0);
            });
        });
    }, []);

    useEffect(() => {
        Object.entries(selectedFromList).forEach(([fieldName, content]) => {
            if (content) {
                const sections = ['Subjective', 'Objective', 'Assessment', 'Plan', 'CarePlan', 'Notes'];
                if (sections.includes(fieldName)) {
                    const editor = quillRefs.current[fieldName]?.current?.getEditor?.();
                    if (editor) {
                        const currentContent = editor.getText().trim();
                        const newContent = currentContent ? `${currentContent}\n${content}` : content;
                        editor.setText(newContent);
                    }
                }
            }
        });
    }, [selectedFromList]);

    const getFieldsToRender = () => {
        return (data || [])
            .filter(field => field.isShown && !excludedFields.includes(field.name))
            .sort((a, b) => a.order - b.order);
    };

    const handlePrintEncounterItems = (fieldName, event) => {
        event.stopPropagation();
        if (fieldName?.name === 'Monitoring Chart (Vitals)' || fieldName?.name?.toLowerCase().includes('vital')) {
            handlePrintVitals({ vitals: patientVitals, patientDetails: patientDetails });
        } else {
            const fieldSpecificData = populatedFields[fieldName?.name] || [];
            const fieldContent = getValues(fieldName?.name) || '';

            handlePrintAutopopulatedFields({
                populatedFields: { [fieldName?.name]: fieldSpecificData },
                patientDetails,
                encounterData,
                fieldLabels: { [fieldName?.name]: fieldName?.name },
                fieldContent: { [fieldName?.name]: fieldContent }
            });
        }
    };

    const renderField = (field) => {
        const { name, inputType = 'textarea' } = field;
        const countWords = (text) => {
            return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        };

        const getWordCount = (text) => {
            return countWords(text?.replace(/<[^>]*>/g, ' ') || '');
        };

        const getWordCountColor = (count, max) => {
            const percentage = (count / max) * 100;
            if (percentage >= 90) return 'text-danger';
            if (percentage >= 75) return 'text-warning';
            return 'text-muted';
        };

        // Handler for text change with word limit
        const handleTextChange = (onChange, value, maxWords) => (content) => {
            const wordCount = countWords(content.replace(/<[^>]*>/g, ' ')); // Strip HTML tags for counting
            if (wordCount <= maxWords) {
                onChange(content);
            } else {
                ToastHandle(`Maximum word limit of ${maxWords} exceeded`, 'warning');
            }
        };

        // Render Vitals field with chart/table
        if (name === 'Monitoring Chart (Vitals)' || name?.toLowerCase().includes('vital')) {
            return (
                <div key={name}>
                    <VitalsChart />
                </div>
            );
        }

        // Render Attached Records field with file upload
        if (name === 'Attached Records') {
            return (
                <Form.Group key={name} className='row'>
                    <div className="col-12">
                        <Form.Label className="mb-0 d-flex align-items-center">{name}
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                onChange={(e) => handleFileUpload(e.target.files)}
                                className="d-none"
                                accept='.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx, .csv'
                                disabled={uploadLoading}
                            />
                            <label
                                htmlFor="file-upload"
                                className={` ${uploadLoading ? 'disabled' : ''} text-primary ms-2 cursor-pointer rounded-circle`}
                                title="Allowed file types: PDF, DOC, DOCX, JPG, JPEG, PNG, XLS, XLSX, CSV"
                            >
                                <FaCloudUploadAlt size={14} />
                            </label>
                        </Form.Label>
                        {uploadLoading && (
                            <div className="d-flex align-items-center">
                                <small className="text-muted">Uploading files...</small>
                            </div>
                        )}
                    </div>
                    {attachedRecords?.length > 0 && (
                        attachedRecords?.map((file, index) => (
                            <div key={index} className=" col-4 mt-1  p-1">
                                <div className='d-flex align-items-center justify-content-between  p-1 px-2 rounded bg-light'>
                                    <small className="text-truncate" title={file?.fileName}>{file?.fileName}</small>
                                    <div className="d-flex align-items-center gap-1">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="p-0"
                                            style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                            onClick={() => window.open(file.url, '_blank')}
                                            title="Preview file"
                                        >
                                            <FaEye size={12} />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="p-0"
                                            style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                            onClick={() => setAttachedRecords(prev => prev.filter((_, i) => i !== index))}
                                            title="Remove file"
                                        >
                                            <Trash size={12} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </Form.Group>
            );
        }

        if (name === 'Notes (SOAP)') {
            return (
                <div key={name}>
                    <h5>{name}</h5>
                    {['Subjective', 'Objective', 'Assessment', 'Plan', 'CarePlan', 'Notes'].map(section => (
                        <Form.Group className="mb-2" key={section} id={section}>
                            <Form.Label className="mb-1 d-flex justify-content-between align-items-center gap-2">
                                <div className='col-10 d-flex align-items-center gap-1'>
                                    <span>{section === 'CarePlan' ? 'Care Plan' : section}</span>
                                    <Form.Select className="w-25 text-black"
                                        onChange={e => {
                                            const value = e.target.value;
                                            if (value && quillRefs.current[section]?.current) {
                                                const editor = quillRefs.current[section].current.getEditor();
                                                const range = editor.getSelection(true);
                                                editor.insertText(range ? range.index : 0, value);
                                                e.target.value = '';
                                            }
                                        }}
                                    >
                                        <option value="">Add Patient Info</option>
                                        {['Address', 'Age', 'Date of Birth', 'Email', 'Patient Name', 'Phone'].map((label, idx) => {
                                            const getValue = () => {
                                                switch (label) {
                                                    case 'Address':
                                                        return patientDetails?.address?.[0]?.line?.[0] || '';
                                                    case 'Age':
                                                        return patientDetails?.approxAge ? `${patientDetails.approxAge} years old` : '';
                                                    case 'Date of Birth':
                                                        return patientDetails?.birthDate
                                                            ? new Date(patientDetails.birthDate).toISOString().split('T')[0]
                                                            : '';
                                                    case 'Email':
                                                        return patientDetails?.telecom?.find(t => t.system === 'email')?.value || '';
                                                    case 'Patient Name':
                                                        return patientDetails?.name?.find(n => n.use === 'official')?.text || '';
                                                    case 'Phone':
                                                        return patientDetails?.telecom?.find(t => t.system === 'phone')?.value || '';
                                                    default:
                                                        return '';
                                                }
                                            };
                                            return (
                                                <option key={idx} value={getValue()}>
                                                    {label}
                                                </option>
                                            );
                                        })}
                                    </Form.Select>
                                </div>
                                <Controller
                                    name={section}
                                    control={control}
                                    render={({ field: { value } }) => {
                                        const wordCount = getWordCount(value);
                                        return (
                                            <div className={`col-2 text-end pe-2 ${getWordCountColor(wordCount, MAX_WORDS)}`}>
                                                {wordCount}/{MAX_WORDS} words
                                            </div>
                                        );
                                    }}
                                />
                            </Form.Label>
                            {/* Show populated data with remove options for SOAP sections */}
                            {populatedFields[section] && populatedFields[section].length > 0 && (
                                <div className="mb-2">
                                    <small className="text-muted">{`Auto-populated data:`}</small>
                                    <div style={{ maxHeight: '15vh', overflowY: 'hidden' }}>
                                        <Table responsive className="table-centered table-nowrap mb-0 rounded">
                                            <thead className="text-white" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                <tr>
                                                    <th className="text-white py-2" style={{ fontSize: '13px', width: '8%' }}>Sr.</th>
                                                    <th className="text-white py-2" style={{ fontSize: '13px', width: '82%' }}>Data</th>
                                                    <th className="text-white py-2" style={{ fontSize: '13px', width: '10%' }}>Action</th>
                                                </tr>
                                            </thead>
                                        </Table>
                                        <div style={{ maxHeight: 'calc(15vh - 40px)', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                                            <Table responsive className="table-centered table-nowrap mb-0">
                                                <tbody>
                                                    {populatedFields[section].map((data, index) => (
                                                        <tr key={index} className="border-bottom">
                                                            <td className="py-1" style={{ fontSize: '13px', fontWeight: '400', width: '8%' }}>{index + 1}</td>
                                                            <td className="py-1 text-truncate" style={{ fontSize: '13px', fontWeight: '400', width: '82%' }} title={data}>{data}</td>
                                                            <td className="py-1 text-center" style={{ fontSize: '13px', fontWeight: '400', width: '10%' }}>
                                                                <Trash
                                                                    size={14}
                                                                    className="text-danger cursor-pointer"
                                                                    onClick={() => removePopulatedData(section, data)}
                                                                    title="Remove this data"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Controller
                                name={section}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <ReactQuill ref={quillRefs.current[section]}
                                        theme="snow"
                                        value={selectedFromList[section] || value || '<p><br></p>'}
                                        onChange={handleTextChange(onChange, value, MAX_WORDS)}
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ list: 'ordered' }, { list: 'bullet' }],
                                                ['link'],
                                                ['clean'],
                                            ],
                                        }}
                                    />
                                )}
                            />
                        </Form.Group>
                    ))}
                </div>
            );
        }

        return (
            <Form.Group key={name}>
                <Form.Label className="mb-0 d-flex align-items-center justify-content-between">
                    <p className='mb-0'></p>
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { value } }) => {
                            const wordCount = inputType === 'text-editor' ? getWordCount(value) : countWords(value || '');
                            return (
                                <p className={`mb-0 ${getWordCountColor(wordCount, MAX_WORDS)}`}>
                                    {wordCount}/{MAX_WORDS} words
                                </p>
                            );
                        }}
                    />
                </Form.Label>
                <Row>
                    <Col sm={12} className='mb-2'>
                        {inputType === 'text-editor' ? (
                            <Controller
                                name={name}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <ReactQuill
                                        theme="snow"
                                        value={value || ''}
                                        onChange={onChange}
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ list: 'ordered' }, { list: 'bullet' }],
                                                ['link'],
                                                ['clean'],
                                            ],
                                        }}
                                    />
                                )}
                            />
                        ) : (
                            <Controller
                                name={name}
                                control={control}
                                render={({ field: { value = '', onChange } }) => (
                                    <Form.Control
                                        as={inputType === 'text' ? 'input' : 'textarea'}
                                        rows={4}
                                        value={value}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const words = input.match(/\S+/g) || [];
                                            const wordCount = words.length;
                                            const lastWordMatch = input.match(/(\S+)$/);
                                            const lastWord = lastWordMatch ? lastWordMatch[0] : '';

                                            if (wordCount < MAX_WORDS) {
                                                onChange(input);
                                                return;
                                            }

                                            if (wordCount === MAX_WORDS) {
                                                if (lastWord.length <= MAX_WORD_LENGTH && /\S$/.test(input)) {
                                                    onChange(input);
                                                } else if (lastWord.length > MAX_WORD_LENGTH) {
                                                    ToastHandle(`Word "${lastWord}" exceeds max ${MAX_WORD_LENGTH} characters`, 'warning');
                                                }
                                            } else {
                                                ToastHandle(`Maximum word limit of ${MAX_WORDS} exceeded`, 'warning');
                                            }
                                        }}
                                    />
                                )}
                            />
                        )}
                    </Col>
                    {populatedFields[name] && populatedFields[name].length > 0 && (
                        <Col sm={12}>
                            <div className="mb-2">
                                <div style={{ maxHeight: '15vh', overflowY: 'hidden' }}>
                                    <Table responsive className="table-centered table-nowrap mb-0 rounded">
                                        <thead className="text-white" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            <tr>
                                                <th className="text-white py-2" style={{ fontSize: '13px', width: '8%' }}>Sr.</th>
                                                <th className="text-white py-2" style={{ fontSize: '13px', width: '82%' }}>Data</th>
                                                <th className="text-white py-2" style={{ fontSize: '13px', width: '10%' }}>Action</th>
                                            </tr>
                                        </thead>
                                    </Table>
                                    <div style={{ maxHeight: 'calc(15vh - 40px)', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                                        <Table responsive className="table-centered table-nowrap mb-0">
                                            <tbody>
                                                {populatedFields[name].map((data, index) => (
                                                    <tr key={index} className="border-bottom">
                                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400', width: '8%' }}>{index + 1}</td>
                                                        <td className="py-1 text-truncate" style={{ fontSize: '13px', fontWeight: '400', width: '82%' }} title={data}>{data}</td>
                                                        <td className="py-1 text-center" style={{ fontSize: '13px', fontWeight: '400', width: '10%' }}>
                                                            <Trash
                                                                size={14}
                                                                className="text-danger cursor-pointer"
                                                                onClick={() => removePopulatedData(name, data)}
                                                                title="Remove this data"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </Form.Group>
        );
    };

    const fieldsToRender = getFieldsToRender();

    return (
        <Row
            className="g-2 px-1 mt-1 scroll-container"
            style={{
                height: !expanded ? (isAccordionOpen ? '36vh' : '50vh') : '59.5vh',
                overflowY: 'auto',
            }}
        >
            <Accordion activeKey={Object.keys(accordionState).filter(key => accordionState[key]).map(String)} alwaysOpen>
                {fieldsToRender.map((field, index) => (
                    <Accordion.Item className='mb-3' eventKey={index.toString()} key={index}>
                        <Accordion.Header
                            className='encounter-accordion-header d-flex justify-content-between w-100'
                            onClick={() => {
                                setAccordionState(prev => ({ ...prev, [index]: !prev[index] }))
                            }}
                        >
                            <div className='d-flex justify-content-between align-items-center w-100' style={{ pointerEvents: 'none' }}>
                                <span className='text-capitalize p-2'>
                                    {field.name}
                                </span>
                                <MdPrint
                                    onClick={(e) => handlePrintEncounterItems(field, e)}
                                    size={18}
                                    className='text-dark cursor-pointer'
                                    style={{ pointerEvents: 'auto' }}
                                />
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            {renderField(field)}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Row>
    );
};

export default NotesFormFields;
