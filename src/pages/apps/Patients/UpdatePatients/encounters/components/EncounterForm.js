// React and third-party imports
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Accordion } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { getSettingsTabAction } from 'redux/noteCategories/action';
import { createEncounterAction, getEncounterAction, updateEncounterAction, getAllConsentActions } from 'redux/actions';

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

// Data and hooks
import { encounterClassCodes, encounterTypes } from 'utils/DataSets/encounterData';
import useNotesTypes from 'hooks/useNotesTypes';



/**
 * EncounterForm Component
 * Manages patient encounter creation with dynamic note types and fields
 * Features: FHIR-compliant data structure, dynamic form fields, note type management
 */
const EncounterForm = ({ selectedFromList = {}, expanded, expandAllAccordions, activeHomeKey }) => {
    // Hooks initialization
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');

    // Form management
    const { handleSubmit, register, control, formState: { errors }, setValue, getValues } = useForm();

    // Component state
    const [selectedNoteType, setSelectedNoteType] = useState(null); // Currently selected note type
    const [notesTypeModal, setNotesTypeModal] = useState(false); // Note type change confirmation modal
    const [pendingNoteType, setPendingNoteType] = useState(null); // Pending note type change
    const [populatedFields, setPopulatedFields] = useState({});
    const [populatedFieldIds, setPopulatedFieldIds] = useState({});
    const [attachedRecords, setAttachedRecords] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [accordionState, setAccordionState] = useState({});
    const [selectedConsentForms, setSelectedConsentForms] = useState([]);


    // Redux state selectors
    const notesFields = store?.getSettingsTabsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    const encounterById = store?.getEncounterByIdReducer?.data?.encounter;
    const createSuccess = store?.createEncounterReducer?.data?.status;
    const updateSuccess = store?.updateEncounterReducer?.data?.status;
    const consentDocuments = store?.getAllConsentReducer?.data?.data;
    // Custom hook for note types with search functionality
    const {
        options: notesTypeOptions,
        isLoading: notesLoading,
        error: notesError,
        handleSearch: handleNotesSearch,
        refresh: refreshNotesTypes
    } = useNotesTypes('', {
        debounceMs: 300,
        limit: 25,
        enableCache: true
    });

    // Effect hooks

    // Set default note type when options are loaded
    useEffect(() => {
        if (notesTypeOptions.length > 0 && !selectedNoteType && !encounterById) {
            const defaultNoteType = notesTypeOptions?.find((data) => data?.data?.default === true)?.value;
            setSelectedNoteType(defaultNoteType);
            dispatch(getSettingsTabAction({ noteId: defaultNoteType }));
        }
    }, [notesTypeOptions, selectedNoteType, dispatch, encounterById]);

    // Set default values for new encounters
    useEffect(() => {
        if (!encounterById && encounterTypes?.length > 0 && encounterClassCodes?.length > 0) {
            setValue('type', encounterTypes[0]?.code);
            setValue('class', encounterClassCodes[0]?.code);
            setValue('status', 'planned');
        }
    }, [encounterById, encounterTypes, encounterClassCodes, setValue]);

    // Populate form with existing encounter data for updates
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

            // Populate form fields and track populated data
            if (encounterById?.data && Array.isArray(encounterById?.data)) {
                const newPopulatedFields = {};
                const newPopulatedFieldIds = {};

                encounterById?.data?.forEach(field => {
                    if (field?.type === 'Consent Forms' && consentDocuments?.length > 0) {
                        // Handle consent forms specially
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

            // Populate attached records if they exist
            if (encounterById?.attachedRecords) {
                setAttachedRecords(encounterById.attachedRecords);
            }
        }
    }, [encounterById, setValue, dispatch, consentDocuments]);

    // Update form fields when template items are selected
    useEffect(() => {
        Object.entries(selectedFromList).forEach(([fieldName, content]) => {
            if (content) {
                setValue(fieldName, content);
            }
        });
    }, [selectedFromList, setValue]);

    // Event handlers

    // Handle note type selection with confirmation modal
    const handleNoteTypeChange = (selected) => {
        if (selected?.value !== selectedNoteType) {
            setPendingNoteType(selected);
            setNotesTypeModal(true);
        }
    };

    // Confirm note type change and load new fields
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
        // Get selected encounter type and class details from datasets
        const selectedEncounterType = encounterTypes?.find(type => type.code === data.type);
        const selectedEncounterClass = encounterClassCodes?.find(cls => cls.code === data.class);
        const currentUser = store?.Auth?.user || {};

        // Process form fields data
        const fieldsData = [];
        const fieldsToRender = (notesFields || [])
            .filter(field => field.isShown)
            .sort((a, b) => a.order - b.order);

        fieldsToRender.forEach(field => {
            const { name, inputType = 'textarea' } = field;

            if (name === 'Notes (SOAP)') {
                // Handle SOAP notes specially
                ['Subjective', 'Objective', 'Assessment', 'Plan'].forEach(section => {
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

        // Structure data according to FHIR encounter schema
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
            // For update, send only the fields that need to be updated
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
            // Reset consent forms after successful save
            setSelectedConsentForms([]);
        }
    }, [createSuccess, updateSuccess, dispatch, patientId]);

    // Load vitals data and consent forms
    useEffect(() => {
        if (patientId) {
            dispatch(getVitalsByPatientIdAction({ limit: 4, patientId }));
        }
        const clinicId = store?.Auth?.user?.clinicId;
        if (clinicId) {
            dispatch(getAllConsentActions({ clinicId }));
        }
    }, [dispatch, patientId, store?.Auth?.user?.clinicId]);



    // Global function to populate encounter fields from EncounterSummary
    useEffect(() => {
        window.populateEncounterField = (fieldName, data, itemId) => {
            // Check for duplicates
            const existingData = populatedFields[fieldName] || [];
            if (existingData.includes(data)) {
                ToastHandle('This data has already been added to the related field.', 'danger');
                return;
            }

            // Track populated data for removal functionality
            setPopulatedFields(prev => ({
                ...prev,
                [fieldName]: [...(prev[fieldName] || []), data]
            }));

            // Track IDs if provided
            if (itemId) {
                setPopulatedFieldIds(prev => ({
                    ...prev,
                    [fieldName]: [...(prev[fieldName] || []), itemId]
                }));
            }

            // Find and open the accordion for the populated field
            const fieldIndex = notesFields?.findIndex(field => field.name === fieldName);
            if (fieldIndex !== -1) {
                setAccordionState(prev => ({ ...prev, [fieldIndex]: true }));

                // Open accordion and scroll after a short delay
                setTimeout(() => {
                    const accordionButton = document.querySelector(`[data-field-name="${fieldName}"] .accordion-button`);
                    if (accordionButton && accordionButton.classList.contains('collapsed')) {
                        accordionButton.click();
                    }

                    setTimeout(() => {
                        const accordionElement = document.querySelector(`[data-field-name="${fieldName}"] .accordion-header`);
                        if (accordionElement) {
                            accordionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                }, 300);
            }
        };

        return () => {
            delete window.populateEncounterField;
        };
    }, [populatedFields, notesFields]);

    // Function to remove populated data from field
    const removePopulatedData = (fieldName, dataToRemove) => {
        const indexToRemove = (populatedFields[fieldName] || []).indexOf(dataToRemove);

        setPopulatedFields(prev => ({
            ...prev,
            [fieldName]: (prev[fieldName] || []).filter(item => item !== dataToRemove)
        }));

        // Remove corresponding ID
        if (indexToRemove !== -1) {
            setPopulatedFieldIds(prev => ({
                ...prev,
                [fieldName]: (prev[fieldName] || []).filter((_, index) => index !== indexToRemove)
            }));
        }
    };

    // Initialize accordion state when fields load
    useEffect(() => {
        if (notesFields) {
            const initialState = {};
            notesFields.forEach((field, index) => {
                initialState[index] = expandAllAccordions || false;
            });
            setAccordionState(initialState);
        }
    }, [notesFields, expandAllAccordions]);

    // File upload handler
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

    // Consent form handlers
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
                {/* Header Fields Row */}
                <Row style={{ height: '16vh' }} className="g-2 mt-0 bg-light rounded-top p-1">

                    {/* Encounter Type Field */}
                    <Col sm={4} className='mt-0'>
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

                    {/* Encounter Class Field */}
                    <Col sm={4} className='mt-0'>
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

                    {/* Note Type Field */}
                    <Col sm={4} className='mt-0'>
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
                                        handleNotesSearch(value);
                                    }
                                }}
                                filterOption={null}
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: `1px solid ${state.isFocused ? '#0d6efd' : 'rgba(186, 185, 185, 0.762)'}`,
                                        background: "white !important",
                                        boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                        color: '#6c757d',
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
                                        onClick={refreshNotesTypes}
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
                    <Col sm={4} className='mt-0'>
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
                    <Col sm={4} className='mt-0'>
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

                    {/* Provider Field */}
                    <Col sm={4} className='mt-0'>
                        <Form.Group className='encounterHeaderGroup'>
                            <Form.Label className='mb-0 fw-bold small'>Provider</Form.Label>
                            <Form.Control type='text' value={'Current Provider'} disabled />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Dynamic Notes Fields Section */}
                <Row style={{ height: expanded ? '64vh' : activeHomeKey ? '48vh' : '60vh' }} className="mt-1 scroll-container" >
                    <Col className='' sm={12}>
                        {selectedNoteType ? (
                            notesFields && Array.isArray(notesFields) && notesFields.length > 0 ? (
                                <NotesFormFields
                                    data={notesFields}
                                    control={control}
                                    selectedFromList={selectedFromList}
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
                                    consentDocuments={consentDocuments}
                                    selectedConsentForms={selectedConsentForms}
                                    setSelectedConsentForms={setSelectedConsentForms}
                                />
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <i className="bi bi-file-text fs-2 mb-2 d-block"></i>
                                    <p className="mb-0">No fields configured for the selected note type.</p>
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