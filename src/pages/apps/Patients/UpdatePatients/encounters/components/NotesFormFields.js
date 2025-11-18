import ToastHandle from 'helpers/ToastMessage';
import React, { createRef, useEffect, useRef, useState } from 'react'
import { Form, Row, Accordion } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';

const NotesFormFields = ({ data, excludedFields = [], control, expanded = true, isAccordionOpen = true, selectedFromList = {} }) => {
    const [activeAccordionKey, setActiveAccordionKey] = useState(null);
    const store = useSelector((state) => state);

    const patientDetails = store?.getPatientsByIdReducer?.data?.data;
    const quillRefs = useRef({
        Subjective: createRef(),
        Objective: createRef(),
        Assessment: createRef(),
        Plan: createRef(),
        CarePlan: createRef(),
        Notes: createRef(),
    });
    const MAX_LENGTH = 700;

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

    const handleAccordionToggle = (key) => {
        setActiveAccordionKey(prev => (prev === key ? null : key));
    };
    const renderField = (field) => {
        const { name, inputType = 'textarea' } = field;
        const countWords = (text) => {
            return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        };

        // Handler for text change with word limit
        const handleTextChange = (onChange, value, maxWords) => (content) => {
            const wordCount = countWords(content.replace(/<[^>]*>/g, ' ')); // Strip HTML tags for counting
            if (wordCount <= maxWords) {
                onChange(content);
            }
        };

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
                                <div className="col-2 text-end pe-2">
                                    {MAX_WORDS + ' words'}
                                </div>
                            </Form.Label>
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
            <Form.Group key={name} className="mb-3">
                <Form.Label className="mb-1 d-flex align-items-center justify-content-between">
                    <span className='fw-medium'>
                        {name}
                    </span>
                    <small className='text-muted'>
                        {MAX_WORDS + ' words'}
                    </small>
                </Form.Label>
                {inputType === 'text-editor' ? (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <ReactQuill
                                theme="snow"
                                value={selectedFromList[name] || value || ''}
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
                                rows={inputType === 'text' ? undefined : 6}
                                value={selectedFromList[name] || value}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const words = input.match(/\S+/g) || [];
                                    const wordCount = words.length;
                                    const lastWordMatch = input.match(/(\S+)$/);
                                    const lastWord = lastWordMatch ? lastWordMatch[0] : '';

                                    if (wordCount < MAX_LENGTH) {
                                        onChange(input);
                                        return;
                                    }

                                    if (wordCount === MAX_LENGTH) {
                                        if (lastWord.length <= 45 && /\S$/.test(input)) {
                                            onChange(input);
                                        }
                                    }
                                }}
                                className="border-primary"
                            />
                        )}
                    />
                )}
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
            <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionToggle}>
                {fieldsToRender.map((field, index) => (
                    <Accordion.Item key={field.name} eventKey={index.toString()} className="border-0 mb-2">
                        <Accordion.Header className=' bg-light rounded'>
                            <span className='fw-semibold p-2     fs-6'>{field.name}</span>
                        </Accordion.Header>
                        <Accordion.Body className='p-2'>
                            {renderField(field)}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Row>
    );
};
export default NotesFormFields