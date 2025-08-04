import ToastHandle from 'helpers/ToastMessage';
import React, { createRef, useEffect, useRef } from 'react'
import { Form, Row } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';

const NotesFormFields = ({ data, excludedFields = [], control, expanded = true, isAccordionOpen = true, selectedFromList = {} }) => {
    // For SOAP sections, keep refs for each ReactQuill
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
                        editor.setContents(lastValidDelta); // Restore last valid state
                        ToastHandle(
                            longWord
                                ? `Word "${longWord}" exceeds max ${MAX_WORD_LENGTH} characters`
                                : `Maximum word limit of ${MAX_WORDS} exceeded`,
                            'danger'
                        );
                    } else {
                        lastValidDelta = contents; // Update last valid state
                    }
                }, 0);
            });
        });
    }, []);




    const getFieldsToRender = () => {
        return (data || [])
            .filter(field => field.isShown && !excludedFields.includes(field.name))
            .sort((a, b) => a.order - b.order);
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
                <div className="" key={name}>

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
                                        {['Address', 'Age', 'Date of Birth', 'Email', 'Patient Name', 'Phone'].map((label, index) => {
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
                                                <option key={index} value={getValue()}>
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
                                        value={value || '<p><br></p>'}
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

        // Handle regular fields
        return (
            <Form.Group key={name}>
                <Form.Label className="mb-0 d-flex align-items-center justify-content-between">
                    <p className='mb-0'>
                        {name}
                    </p>
                    <p className='mb-0'>
                        {MAX_WORDS + ' words'}
                    </p>
                </Form.Label>
                {inputType === 'text-editor' ? (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <ReactQuill
                                theme="snow"
                                value={value || ''} // Use form state value
                                onChange={onChange} // Update form state on change
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline'],
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        ['link'],
                                        ['clean'],
                                        ['undo', 'redo'],
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
                                rows={inputType === 'text' ? undefined : 10}
                                value={value}
                                onChange={(e) => {
                                    const input = e.target.value;

                                    const words = input.match(/\S+/g) || []; // words are non-space sequences
                                    const wordCount = words.length;

                                    const lastWordMatch = input.match(/(\S+)$/); // match last word
                                    const lastWord = lastWordMatch ? lastWordMatch[0] : '';

                                    if (wordCount < MAX_LENGTH) {
                                        onChange(input);
                                        return;
                                    }

                                    // Word count == MAX_LENGTH
                                    if (wordCount === MAX_LENGTH) {
                                        // Allow updating only if user is typing inside the last word and it's <= 45 characters
                                        if (lastWord.length <= 45 && /\S$/.test(input)) {
                                            onChange(input);
                                        }
                                        // Else block (including if trying to type space after last word)
                                    }
                                }}
                            />
                        )}
                    />

                )}
            </Form.Group>
        );
    };

    return (
        <Row
            className="g-2 px-1 mt-1 scroll-container"
            style={{
                height: !expanded ? (isAccordionOpen ? '36vh' : '50vh') : '59.5vh',
                overflowY: 'auto',
            }}
        >
            {getFieldsToRender().map(field => renderField(field))}
        </Row>
    );
};
export default NotesFormFields