// React and third-party imports
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Col, Form, Row, Accordion } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { getNoteCategoriesAction, getSettingsTabAction } from 'redux/noteCategories/action';
import { createEncounterAction, getEncounterAction, updateEncounterAction, getAllConsentActions, getAppointmentByPatientIdAction } from 'redux/actions';

// Router imports
import { useSearchParams } from 'react-router-dom';

// Utility imports
import { encryptMessage } from 'cryptoUtils';
import ToastHandle from 'helpers/ToastMessage';
import { getVitalsByPatientIdAction } from 'redux/actions';
import AsyncSelect from 'react-select/async';

// Component imports
import NotesFormFields from './NotesFormFields';
import ChangeNoteTypeModal from './ChangeNoteTypeModal';
import VitalsChart from './VitalsChart';

// Utility imports
import { scrollToEncounterField } from '../utils/scrollUtils';

// Data and hooks
import { encounterClassCodes, encounterTypes } from 'utils/DataSets/encounterData';
import useNotesTypes from 'hooks/useNotesTypes';
import { useAppointmentIntegration } from '../hooks/useAppointmentIntegration';
import { useFieldPopulation } from '../hooks/useFieldPopulation';

/**
 * EncounterForm Component
 * Manages patient encounter creation with dynamic note types and fields
 * Features: FHIR-compliant data structure, dynamic form fields, note type management, appointment integration
 */
const EncounterForm = ({
    selectedFromList = {},
    expanded,
    expandAllAccordions,
    activeHomeKey,
    appointmentData,
    onPrintRef,
    onPopulatedFieldsChange,
    scrollToAccordion
}) => {
    // Hooks initialization
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');

    // Form management
    const { handleSubmit, register, control, formState: { errors }, setValue, getValues } = useForm();

    // Custom hook for note types
    const {
        options: notesTypeOptions,
        isLoading: notesLoading,
        error: notesError
    } = useNotesTypes();

    // Load note types on component mount
    useEffect(() => {
        const clinicId = store?.Auth?.user?.clinicId;
        if (clinicId && !notesTypeOptions.length && !notesLoading) {
            dispatch(getNoteCategoriesAction({
                search: '',
                skip: 1,
                limit: 10,
                clinicId,
                active: true,
                noteType: ''
            }));
        }
    }, [dispatch, notesTypeOptions.length, notesLoading, store?.Auth?.user?.clinicId]);

    // Appointment integration
    const { getAppointmentBasedDefaults, getAppointmentFieldPopulation } = useAppointmentIntegration();

    // Field population hook
    const {
        populatedFields,
        populatedFieldIds,
        setPopulatedFields,
        setPopulatedFieldIds,
        removePopulatedData,
        markPopulatedDataComplete
    } = useFieldPopulation();

    // Redux state selectors
    const notesFields = store?.getSettingsTabsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    const encounterById = store?.getEncounterByIdReducer?.data?.encounter;
    const createSuccess = store?.createEncounterReducer?.data?.status;
    const updateSuccess = store?.updateEncounterReducer?.data?.status;
    const consentDocuments = store?.getAllConsentReducer?.data?.data;
    const appointmentsData = store?.getAppointmentByPatientIdReducer?.data?.appointments || [];

    // Component state
    const [selectedNoteType, setSelectedNoteType] = useState(null);
    const [notesTypeModal, setNotesTypeModal] = useState(false);
    const [pendingNoteType, setPendingNoteType] = useState(null);
    const [attachedRecords, setAttachedRecords] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [accordionState, setAccordionState] = useState({});
    const [selectedConsentForms, setSelectedConsentForms] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(appointmentData || null);
    const [internalScrollToAccordion, setInternalScrollToAccordion] = useState(null);

    // Global function for summary section
    useEffect(() => {
        window.populateEncounterField = (fieldName, content) => {
            if (fieldName && content) {
                setPopulatedFields(prev => ({
                    ...prev,
                    [fieldName]: [...(prev[fieldName] || []), content]
                }));

                // Find and open the accordion for this field
                const fieldIndex = notesFields?.findIndex(field => field.name === fieldName);
                if (fieldIndex !== -1) {
                    // Expand accordion first
                    setAccordionState(prev => ({ ...prev, [fieldIndex]: true }));

                    // Enhanced scroll with proper timing - matches clinic panel
                    setTimeout(() => {
                        const accordionElement = document.querySelector(`[data-accordion-index="${fieldIndex}"]`);
                        if (accordionElement) {
                            accordionElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }, 300); // Allow time for accordion to expand
                }
            }
        };

        return () => {
            delete window.populateEncounterField;
        };
    }, [setPopulatedFields, setAccordionState, notesFields]);

    // Notify parent of populated fields changes
    useEffect(() => {
        onPopulatedFieldsChange?.(populatedFields);
    }, [populatedFields, onPopulatedFieldsChange]);

    // Set default note type when options are loaded
    useEffect(() => {
        if (notesTypeOptions.length > 0 && !selectedNoteType && !encounterById) {
            const defaultNoteType = notesTypeOptions?.find((data) => data?.data?.default === true)?.value;
            setSelectedNoteType(defaultNoteType);
            dispatch(getSettingsTabAction({ noteId: defaultNoteType }));
        }
    }, [notesTypeOptions, selectedNoteType, dispatch, encounterById]);

    useEffect(() => {
        if (!encounterById && encounterTypes?.length > 0 && encounterClassCodes?.length > 0) {
            const appointmentDefaults = getAppointmentBasedDefaults();

            setValue('type', appointmentDefaults.encounterType || encounterTypes[0]?.code);
            setValue('class', encounterClassCodes[0]?.code);
            setValue('status', appointmentDefaults.status || 'planned');

            if (appointmentDefaults.startDate) {
                setValue('startDate', appointmentDefaults.startDate);
            }
        }
    }, [encounterById, encounterTypes, encounterClassCodes, setValue, getAppointmentBasedDefaults]);

    useEffect(() => {
        if (encounterById) {
            setValue('type', encounterById?.type?.[0]?.coding?.[0]?.code || '');
            setValue('class', encounterById?.class?.coding?.[0]?.code || '');
            setValue('status', encounterById?.status || '');
            setValue('startDate', encounterById?.period?.start ? new Date(encounterById.period.start).toISOString().split('T')[0] : '');

            if (encounterById?.noteType) {
                setSelectedNoteType(encounterById.noteType);
                dispatch(getSettingsTabAction({ noteId: encounterById.noteType }));
            }
            if (encounterById?.data && Array.isArray(encounterById?.data)) {
                const newPopulatedFields = {};
                const newPopulatedFieldIds = {};
                encounterById?.data?.forEach(field => {
                    if (field?.type === 'Consent Forms' && consentDocuments?.length > 0) {
                        const consentIds = field.populatedData || [];
                        const selectedForms = consentIds
                            .map((consentId) => {
                                const consentDoc = consentDocuments.find((doc) => doc._id === consentId);
                                if (consentDoc) {
                                    return {
                                        value: consentDoc._id,
                                        label: consentDoc.title,
                                        data: consentDoc,
                                    };
                                }
                                return null;
                            })
                            .filter(Boolean);
                        setSelectedConsentForms(selectedForms);
                    } else if (field?.type && field?.content?.value) {
                        setValue(field?.type, field?.content?.value);
                    }
                    if (field?.populatedData?.length > 0) {
                        newPopulatedFields[field.type] = field.populatedData;
                    }
                    if (field?.populatedIds?.length > 0) {
                        newPopulatedFieldIds[field.type] = field.populatedIds;
                    }
                });
                setPopulatedFields(newPopulatedFields);
                setPopulatedFieldIds(newPopulatedFieldIds);
            }
            if (encounterById?.attachedRecords) {
                setAttachedRecords(encounterById.attachedRecords);
            }
        }
    }, [encounterById, setValue, dispatch, consentDocuments]);

    useEffect(() => {
        Object.entries(selectedFromList).forEach(([fieldName, content]) => {
            if (content) {
                const contentItems = content.split('\n').filter(item => item.trim());
                const existingContent = populatedFields[fieldName] || [];
                const newItems = contentItems.filter(item => !existingContent.includes(item));
                if (newItems.length > 0) {
                    setPopulatedFields(prev => ({
                        ...prev,
                        [fieldName]: [...existingContent, ...newItems]
                    }));
                    const fieldIndex = notesFields?.findIndex(field => field.name === fieldName);
                    if (fieldIndex !== -1) {
                        setAccordionState(prev => ({ ...prev, [fieldIndex]: true }));

                        // Enhanced scroll with proper timing and error handling
                        setTimeout(() => {
                            const accordionElement = document.querySelector(`[data-accordion-index="${fieldIndex}"]`);
                            const scrollContainer = document.querySelector('.scroll-container');

                            if (accordionElement && scrollContainer) {
                                const elementRect = accordionElement.getBoundingClientRect();
                                const containerRect = scrollContainer.getBoundingClientRect();
                                const offset = elementRect.top - containerRect.top + scrollContainer.scrollTop - 20;

                                scrollContainer.scrollTo({
                                    top: Math.max(0, offset),
                                    behavior: 'smooth'
                                });
                            }
                        }, 300);
                    }
                    setInternalScrollToAccordion(fieldName);
                }
            }
        });
    }, [selectedFromList, populatedFields, notesFields, setAccordionState, setPopulatedFields]);

    // Scroll to accordion functionality - matches clinic panel pattern
    useEffect(() => {
        if (scrollToAccordion && notesFields) {
            const soapSections = ['Subjective', 'Objective', 'Assessment', 'Plan'];
            const targetField = soapSections.includes(scrollToAccordion) ? 'Notes (SOAP)' : scrollToAccordion;

            const accordionIndex = notesFields.findIndex(field =>
                field.name.toLowerCase().includes(targetField.toLowerCase())
            );
            if (accordionIndex !== -1) {
                // Open the accordion
                setAccordionState(prev => ({ ...prev, [accordionIndex]: true }));

                // Scroll to the accordion after a short delay
                setTimeout(() => {
                    const accordionElement = document.querySelector(`[data-accordion-index="${accordionIndex}"]`);
                    const scrollContainer = document.querySelector('.scroll-container');

                    if (accordionElement && scrollContainer) {
                        const elementRect = accordionElement.getBoundingClientRect();
                        const containerRect = scrollContainer.getBoundingClientRect();
                        const offset = elementRect.top - containerRect.top + scrollContainer.scrollTop - 20;

                        scrollContainer.scrollTo({
                            top: Math.max(0, offset),
                            behavior: 'smooth'
                        });
                    }
                }, 300);
                // Clear the scroll trigger
                setInternalScrollToAccordion(null);
            }
        }
    }, [scrollToAccordion, notesFields, setAccordionState]);

    // Handle note type selection with confirmation modal
    const handleNoteTypeChange = (selected) => {
        if (selected?.value !== selectedNoteType) {
            setPendingNoteType(selected);
            setNotesTypeModal(true);
        }
    };

    const confirmNoteTypeChange = () => {
        if (pendingNoteType) {
            setSelectedNoteType(pendingNoteType.value);
            dispatch(getSettingsTabAction({ noteId: pendingNoteType.value }));
            setPendingNoteType(null);
        }
    };

    // Close note type change modal
    const closeNoteTypeModal = () => {
        setNotesTypeModal(false);
        setPendingNoteType(null);
    };

    /**
     * Form submission handler
     * Creates FHIR-compliant encounter payload and dispatches create action
     */
    const onSubmit = (data) => {
        const selectedEncounterType = encounterTypes?.find(type => type.code === data.type);
        const selectedEncounterClass = encounterClassCodes?.find(cls => cls.code === data.class);
        const currentUser = store?.Auth?.user || {};
        const fieldsData = [];
        const fieldsToRender = (notesFields || [])
            .filter(field => field.isShown)
            .sort((a, b) => a.order - b.order);

        fieldsToRender.forEach(field => {
            const { name, inputType = 'textarea' } = field;

            if (name === 'Notes (SOAP)') {
                // Handle SOAP notes specially
                ['Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', 'Notes'].forEach(section => {
                    const value = getValues(section) || '';
                    const fieldData = {
                        type: section,
                        content: {
                            type: inputType === 'text-editor' ? 'html' : 'text',
                            value: value
                        }
                    };
                    if (populatedFieldIds[section]?.length > 0) {
                        fieldData.populatedIds = populatedFieldIds[section];
                    }
                    if (populatedFields[section]?.length > 0) {
                        fieldData.populatedData = populatedFields[section];
                    }
                    fieldsData.push(fieldData);
                });
            } else if (name === 'Consent Forms') {
                // Handle Consent Forms specially
                const fieldData = {
                    type: name,
                    content: {
                        type: 'text',
                        value: ''
                    },
                    populatedData: selectedConsentForms?.map((form) => form.value) || []
                };
                fieldsData.push(fieldData);
            } else if (name !== 'Attached Records') {
                // Handle regular fields, exclude Attached Records
                const value = getValues(name) || '';
                const fieldData = {
                    type: name,
                    content: {
                        type: inputType === 'text-editor' ? 'html' : 'text',
                        value: value
                    }
                };
                if (populatedFieldIds[name]?.length > 0) {
                    fieldData.populatedIds = populatedFieldIds[name];
                }
                if (populatedFields[name]?.length > 0) {
                    fieldData.populatedData = populatedFields[name];
                }
                fieldsData.push(fieldData);
            }
        });

        const encounterPayload = {
            status: data.status,
            class: {
                coding: [{
                    system: selectedEncounterClass?.system || '',
                    code: selectedEncounterClass?.code,
                    display: selectedEncounterClass?.display
                }],
                text: selectedEncounterClass?.display
            },
            type: [{
                coding: [{
                    system: selectedEncounterType?.system || '',
                    code: selectedEncounterType?.code,
                    display: selectedEncounterType?.display
                }],
                text: selectedEncounterType?.display
            }],
            period: {
                start: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString()
            },
            subject: patientId,
            providerId: currentUser?.doctorId,
            noteType: selectedNoteType,
            data: fieldsData,
            attachedRecords
        };
        if (encounterById) {
            const updatePayload = {
                id: encounterById._id,
                data: fieldsData,
                attachedRecords
            };
            dispatch(updateEncounterAction({ key: encryptMessage(updatePayload) }));
        } else {
            dispatch(createEncounterAction({ key: encryptMessage(encounterPayload) }));
        }
    };

    useEffect(() => {
        if (createSuccess === 201 || updateSuccess === 200) {
            dispatch(getEncounterAction({ patientId, skip: 1 }));
            setSelectedConsentForms([]);
        }
    }, [createSuccess, updateSuccess, dispatch, patientId]);

    useEffect(() => {
        if (patientId) {
            dispatch(getVitalsByPatientIdAction({ limit: 4, patientId }));
            dispatch(getAppointmentByPatientIdAction({ patientId, status: '', limit: 50, skip: 1 }));
        }
        const clinicId = store?.Auth?.user?.clinicId;
        if (clinicId) {
            dispatch(getAllConsentActions({ clinicId }));
        }
    }, [dispatch, patientId, store?.Auth?.user?.clinicId]);

    useEffect(() => {
        if (onPrintRef) {
            onPrintRef.current = () => {
                const allFieldsData = {};
                const allFieldContent = {};
                const allFieldLabels = {};
                const fieldsToRender = (notesFields || [])
                    .filter(field => field.isShown)
                    .sort((a, b) => a.order - b.order);

                fieldsToRender.forEach(field => {
                    const { name } = field;
                    if (name === 'Notes (SOAP)') {
                        ['Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', 'Notes'].forEach(section => {
                            allFieldsData[section] = populatedFields[section] || [];
                            allFieldContent[section] = getValues(section) || '';
                            allFieldLabels[section] = section;
                        });
                    } else if (name !== 'Attached Records' && name !== 'Vitals' && !name.toLowerCase().includes('vital')) {
                        allFieldsData[name] = populatedFields[name] || [];
                        allFieldContent[name] = getValues(name) || '';
                        allFieldLabels[name] = name;
                    }
                });

                const formData = getValues();
                const encounterData = {
                    providerId: { name: [{ use: 'official', text: store?.Auth?.user?.name || 'Provider' }] },
                    period: { start: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString() },
                    status: formData.status || 'in-progress',
                    type: [{ coding: [{ display: encounterTypes?.find(t => t.code === formData.type)?.display || 'Standard Visit' }] }]
                };

                const patientDetails = store?.getPatientsByIdReducer?.data?.data;
                const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data || [];

                import('../helpers/printAutopopulatedFields').then(({ handlePrintAutopopulatedFields }) => {
                    handlePrintAutopopulatedFields({
                        populatedFields: allFieldsData,
                        patientDetails,
                        encounterData,
                        fieldLabels: allFieldLabels,
                        fieldContent: allFieldContent,
                        vitals: patientVitals
                    });
                });
            };
        }
    }, [onPrintRef, notesFields, populatedFields, getValues, store?.Auth?.user?.name, store?.getPatientsByIdReducer?.data?.data, store?.getVitalsByPatientIdReducer?.data?.data, encounterTypes]);

    useEffect(() => {
        if (notesFields) {
            const initialState = {};
            notesFields.forEach((field, index) => {
                initialState[index] = expandAllAccordions || false;
            });
            setAccordionState(initialState);
        }
    }, [notesFields, expandAllAccordions]);

    const handleFileUpload = async (files) => {
        const { handleUpload } = await import('helpers/HandleUpload');
        const fileArray = Array.from(files);
        const uploadedFiles = [];
        for (const file of fileArray) {
            const uploadResult = await handleUpload(file, setUploadLoading);
            if (uploadResult) {
                uploadedFiles.push({
                    url: uploadResult?.url ? uploadResult.url.split('?')[0] : '',
                    fileName: uploadResult?.fileName || file.name
                });
            }
        }
        setAttachedRecords(prev => [...prev, ...uploadedFiles]);
    };

    const handleConsentFormChange = (selectedOptions) => {
        setSelectedConsentForms(selectedOptions || []);
    };

    const handleViewConsentForm = (formData) => {
        if (formData?.consentDocument?.url) {
            window.open(formData?.consentDocument?.url?.split('?')[0], '_blank');
        }
    };

    return (
        <div className='bg-in'>
            <Form id="encounter-form" onSubmit={handleSubmit(onSubmit)}>
                <Row style={{ height: '16vh' }} className="g-2 mt-0 bg-light rounded-top p-1">
                    <Col sm={3} className='mt-0'>
                        <Form.Group className='encounterHeaderGroup'>
                            <Form.Label className='mb-0 fw-bold small'>
                                Encounter Type <span className='text-danger'>*</span>
                            </Form.Label>
                            <Form.Select
                                {...register('type', { required: 'This field is required' })}
                                className='border-primary'>
                                <option value='' hidden>Select...</option>
                                {encounterTypes?.map((data, index) => (
                                    <option key={index} value={data?.code}>
                                        {data?.code + '-' + data?.display}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.type && (
                                <div className="text-danger small mt-0">{errors.type.message}</div>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={3} className='mt-0'>
                        <Form.Group className='encounterHeaderGroup'>
                            <Form.Label className='mb-0 fw-bold small'>
                                Encounter Class <span className='text-danger'>*</span>
                            </Form.Label>
                            <Form.Select
                                {...register('class', { required: 'This field is required.' })}
                                className='border-primary'>
                                <option value='' hidden>Select...</option>
                                {encounterClassCodes?.map((data, index) => (
                                    <option key={index} value={data?.code}>
                                        {data?.code + ' (' + data?.display + ')'}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.class && (
                                <div className="text-danger small mt-0">{errors.class.message}</div>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={3} className='mt-0'>
                        <Form.Group className='encounterHeaderGroup'>
                            <Form.Label className='mb-0 fw-bold small'>
                                Note Type <span className='text-danger'>*</span>
                            </Form.Label>
                            <Select
                                options={notesTypeOptions}
                                value={notesTypeOptions?.find(option => option?.value === selectedNoteType) || null}
                                onChange={handleNoteTypeChange}
                                isSearchable
                                isLoading={notesLoading}
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder={notesLoading ? "Loading..." : "Search note types..."}
                                noOptionsMessage={({ inputValue }) => {
                                    if (notesError) return "Error loading note types";
                                    return inputValue ? `No note types found for "${inputValue}"` : "No note types available";
                                }}
                                onInputChange={(value, { action }) => {
                                    if (action === 'input-change') {
                                        const clinicId = store?.Auth?.user?.clinicId;
                                        if (clinicId) {
                                            dispatch(getNoteCategoriesAction({
                                                search: value,
                                                skip: 1,
                                                limit: 25,
                                                clinicId,
                                                active: true,
                                                noteType: ''
                                            }));
                                        }
                                    }
                                }}
                                filterOption={null}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: '1px solid rgba(186, 185, 185, 0.762)',
                                        background: "white !important",
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                                menuPlacement="auto"
                                menuPosition="fixed"
                            />
                            {notesError && (
                                <div className="text-danger small mt-1">
                                    Failed to load note types.
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 ms-1 small text-decoration-underline"
                                        onClick={() => {
                                            const clinicId = store?.Auth?.user?.clinicId;
                                            if (clinicId) {
                                                dispatch(getNoteCategoriesAction({
                                                    search: '',
                                                    skip: 1,
                                                    limit: 10,
                                                    clinicId,
                                                    active: true,
                                                    noteType: ''
                                                }));
                                            }
                                        }}
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}
                        </Form.Group>
                        <ChangeNoteTypeModal
                            showModal={notesTypeModal}
                            closeModal={closeNoteTypeModal}
                            onConfirm={confirmNoteTypeChange}
                        />
                    </Col>
                    {/* Start Date Field */}
                    <Col sm={3} className='mt-0'>
                        <Form.Group className='encounterHeaderGroup'>
                            <Form.Label className='mb-0 fw-bold small'>
                                Start Date <span className='text-danger'>*</span>
                            </Form.Label>
                            <Form.Control
                                type="date"
                                {...register('startDate', { required: 'This field is required' })}
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className='border-primary'
                            />
                            {errors.startDate && (
                                <div className="text-danger small mt-0">{errors.startDate.message}</div>
                            )}
                        </Form.Group>
                    </Col>
                    {/* Status Field */}
                    <Col sm={3} className='mt-0'>
                        <Form.Group className='encounterHeaderGroup'>
                            <Form.Label className='mb-0 fw-bold small'>
                                Status <span className='text-danger'>*</span>
                            </Form.Label>
                            <Form.Select
                                {...register('status', { required: 'This field is required' })}
                                className='text-capitalize'>
                                <option value=''>Select Status</option>
                                {['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled'].map((status, index) => (
                                    <option value={status} className='text-capitalize' key={index}>
                                        {status}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.status && (
                                <div className="text-danger small mt-0">{errors.status.message}</div>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={3} className='mt-0'>
                        <Form.Group className='encounterHeaderGroup'>
                            <Form.Label className='mb-0 fw-bold small'>Provider</Form.Label>
                            <Form.Control
                                type='text'
                                value={`${store?.Auth?.user?.name?.family || ''} ${store?.Auth?.user?.name?.given?.[0] || ''}` || 'Current Provider'}
                                readOnly
                                style={{ cursor: 'not-allowed' }}
                            />
                        </Form.Group>
                    </Col>
                    {/* Related Appointment Field */}
                    <Col sm={3} className='mt-0'>
                        <Form.Group className='encounterHeaderGroup'>
                            <Form.Label className='mb-0 fw-bold small'>Related Appointment</Form.Label>
                            <Select
                                options={appointmentsData.map(apt => ({
                                    value: apt._id,
                                    label: `${apt.appointmentType?.text || apt.appointmentType?.coding?.[0]?.display || 'Appointment'} - ${new Date(apt.start).toLocaleDateString()}`,
                                    appointment: apt
                                }))}
                                value={selectedAppointment ? {
                                    value: selectedAppointment._id,
                                    label: `${selectedAppointment.appointmentType?.text || selectedAppointment.appointmentType?.coding?.[0]?.display || 'Appointment'} - ${new Date(selectedAppointment.start).toLocaleDateString()}`,
                                    appointment: selectedAppointment
                                } : null}
                                onChange={(selected) => {
                                    const appointment = selected?.appointment || null;
                                    setSelectedAppointment(appointment);
                                    if (appointment) {
                                        const relatedAppointmentIndex = notesFields?.findIndex(field => field.name === 'Related Appointment');
                                        if (relatedAppointmentIndex !== -1) {
                                            setAccordionState(prev => ({ ...prev, [relatedAppointmentIndex]: true }));
                                            scrollToEncounterField('Related Appointment');
                                        }
                                    }
                                }}
                                isSearchable
                                isClearable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select appointment..."
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: '1px solid rgba(186, 185, 185, 0.762)',
                                        background: "white !important",
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row style={{ height: expanded ? '64vh' : activeHomeKey ? '48vh' : '60vh' }} className="mt-1 scroll-container" >
                    <Col className='' sm={12}>
                        {selectedNoteType ? (
                            store?.getSettingsTabsReducer?.loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 text-muted mb-0">Loading fields...</p>
                                </div>
                            ) : notesFields && Array.isArray(notesFields) && notesFields.length > 0 ? (
                                <NotesFormFields
                                    data={notesFields}
                                    control={control}
                                    populatedFields={populatedFields}
                                    removePopulatedData={removePopulatedData}
                                    patientDetails={store?.getPatientsByIdReducer?.data?.data}
                                    getValues={getValues}
                                    attachedRecords={attachedRecords}
                                    setAttachedRecords={setAttachedRecords}
                                    handleFileUpload={handleFileUpload}
                                    uploadLoading={uploadLoading}
                                    accordionState={accordionState}
                                    setAccordionState={setAccordionState}
                                    expanded={expanded}
                                    encounterData={encounterById}
                                    patientVitals={store?.getVitalsByPatientIdReducer?.data?.data || []}
                                    externalConsentForms={selectedConsentForms}
                                    appointmentData={selectedAppointment || appointmentData}
                                    scrollToAccordion={internalScrollToAccordion}
                                    setScrollToAccordion={setInternalScrollToAccordion}
                                />
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 mb-0">Loading note fields...</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-arrow-up fs-2 mb-2 d-block"></i>
                                <p className="mb-0">Please select a note type to view available fields.</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default EncounterForm;