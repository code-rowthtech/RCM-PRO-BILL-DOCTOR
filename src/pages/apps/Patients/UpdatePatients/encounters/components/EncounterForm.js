// React and third-party imports
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { getSettingsTabAction } from 'redux/noteCategories/action';
import { createEncounterAction, getEncounterAction, updateEncounterAction } from 'redux/actions';

// Router imports
import { useSearchParams } from 'react-router-dom';

// Utility imports
import { encryptMessage } from 'cryptoUtils';

// Component imports
import NotesFormFields from './NotesFormFields';
import ChangeNoteTypeModal from './ChangeNoteTypeModal';

// Data and hooks
import { encounterClassCodes, encounterTypes } from 'utils/DataSets/encounterData';
import useNotesTypes from 'hooks/useNotesTypes';

/**
 * EncounterForm Component
 * Manages patient encounter creation with dynamic note types and fields
 * Features: FHIR-compliant data structure, dynamic form fields, note type management
 */
const EncounterForm = ({ selectedFromList = {} }, expanded) => {
    // Hooks initialization
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');

    // Form management
    const { handleSubmit, register, control, formState: { errors }, setValue } = useForm();

    // Component state
    const [selectedNoteType, setSelectedNoteType] = useState(null); // Currently selected note type
    const [notesTypeModal, setNotesTypeModal] = useState(false); // Note type change confirmation modal
    const [pendingNoteType, setPendingNoteType] = useState(null); // Pending note type change

    // Redux state selectors
    const notesFields = store?.getSettingsTabsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    const encounterById = store?.getEncounterByIdReducer?.data?.encounter;
    const createSuccess = store?.createEncounterReducer?.data?.status;
    const updateSuccess = store?.updateEncounterReducer?.data?.status;
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

            encounterById?.data?.forEach(item => {
                setValue(item.type, item.content?.value || '');
            });
        }
    }, [encounterById, setValue, dispatch]);

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
            // Transform dynamic form fields into data array
            data: Object.keys(data)
                .filter(key => !['type', 'class', 'status', 'startDate'].includes(key))
                .map(key => ({
                    type: key,
                    content: {
                        type: 'text',
                        value: data[key] || ''
                    }
                }))
        };

        if (encounterById) {
            encounterPayload.id = encounterById._id;
            dispatch(updateEncounterAction({ key: encryptMessage(encounterPayload) }));
        } else {
            dispatch(createEncounterAction({ key: encryptMessage(encounterPayload) }));
        }
    };

    useEffect(() => {
        if (createSuccess === 201 || updateSuccess === 200) {
            dispatch(getEncounterAction({ patientId, skip: 1 }))
        }
    }, [createSuccess, updateSuccess]);

    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Header Fields Row */}
                <Row style={{ height: '16.5vh' }} className="g-2 mt-0 bg-light rounded-top p-1">

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
                <Row className="mt-1 scroll-container" style={{ minHeight: expanded ? '62vh' : '45vh', height: expanded ? '62vh' : '45vh' }}>
                    <Col sm={12}>
                        {selectedNoteType ? (
                            notesFields && Array.isArray(notesFields) && notesFields.length > 0 ? (
                                <NotesFormFields
                                    data={notesFields}
                                    control={control}
                                    selectedFromList={selectedFromList}
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

                {/* Submit Button */}
                <Row>
                    <Col sm={12} className="d-flex justify-content-end mt-2 mb-1">
                        <Button
                            type="submit"
                            className='custom-buttons'
                            disabled={store?.createEncounterReducer?.loading || store?.updateEncounterReducer?.loading}
                        >
                            {store?.createEncounterReducer?.loading ? 'Saving...' : encounterById ? 'Update Encounter' : 'Save Encounter'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default EncounterForm;