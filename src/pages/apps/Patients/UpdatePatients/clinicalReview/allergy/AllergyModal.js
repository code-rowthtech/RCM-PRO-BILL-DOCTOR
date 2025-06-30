import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { category, criticality } from '../../../../../../utils/DataSets/Allergy/category';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { allergyCode } from '../../../../../../utils/DataSets/Allergy/allergyCode';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDateToISO, today } from '../../../../../../helpers/helperFunctions';
import { clinicalStatus } from '../../../../../../utils/DataSets/Allergy/clinicalStatus';
import { useDispatch } from 'react-redux';
import { createAllergiesAction, getAllergiesAction, getAllergyById, getFoodAllergiesAction, updateAllergiesAction } from '../../../../../../redux/allergies/actions';
import { encryptMessage } from '../../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import { allergyType } from '../../../../../../utils/DataSets/Allergy/allergyType';
import { loggedInUser } from '../../../../../../helpers/loggedInUser';
import { getAllergyDetails } from '../../../../../../helpers/api/apiEndpoints';
import Spinner from '../../../../../../constants/Spinner';
import { TextEditor } from '../../../../../../components/TextEditor/TextEditor';

const AllergyModal = ({ show, closeModal, allergyId }) => {
    const { handleSubmit, register, control, formState: { errors }, reset, setValue } = useForm();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const patientId = searchParams.get('id');
    const appointments = store?.getPatientAppointmentReducer?.data?.appointments;
    const allergyDetails = store?.getAllergyByIdReducer?.data?.allergy;
    const foodAllergyData = store?.getFoodAllergiesReducer?.data;
    console.log(foodAllergyData, 'foodAllergyDatafoodAllergyData')
    const [code, setCode] = useState(null);
    const [selectedMode, setSelectedMode] = useState('date');

    const formattedCodeOption = useMemo(
        () =>
            allergyCode?.map((reason) => ({
                value: reason,
                label: reason.display,
            })),
        []
    );
    const createResponseStatus = store?.createAllergiesReducer?.data?.status;

    useEffect(() => {
        if (createResponseStatus === 201) {
            dispatch(getAllergiesAction({ patientId: patientId, skip: 1 }));
            closeModal();
            reset();
        }
    }, [createResponseStatus]);

    useEffect(() => {
        if (allergyId) {
            dispatch(getAllergyById({ id: allergyId }))
        }
    }, [allergyId, show])

    useEffect(() => {
        if (allergyId && allergyDetails) {
            setValue('category', allergyDetails?.category?.[0]?.code);
            setValue('criticality', allergyDetails?.criticality?.code);
            setValue('appointmentDate', formatDateToISO(allergyDetails?.onset?.onsetDateTime));
        }
    }, [allergyId, allergyDetails])

    const loadCodeOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedCodeOption.slice(0, 10));
                return;
            }

            const filteredOptions = formattedCodeOption.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            callback(filteredOptions.slice(0, 20));
        },
        [formattedCodeOption]
    );

    const submitAllergiesData = (data) => {
        const selectedStatus = clinicalStatus.find((item) => item?.code === data?.status);
        const selectedCategory = category.find((item) => item?.code === data?.category);
        const selectedCriticalityOption = criticality.find((option) => option?.code === data?.criticality);

        const payload = {
            patientId: patientId,
            clinicId: loggedInUser?.clinicId,
            recorderId: loggedInUser?.doctorId,
            resourceType: 'AllergyIntolerance',
            clinicalStatus: {
                coding: [
                    {
                        system: selectedStatus?.system,
                        code: selectedStatus?.code,
                        display: selectedStatus?.display,
                    },
                ],
                text: selectedStatus?.display,
            },
            category: [
                {
                    system: selectedCategory?.system,
                    code: selectedCategory?.code,
                    display: selectedCategory?.display,
                },
            ],
            criticality: {
                system: selectedCriticalityOption?.system,
                code: selectedCriticalityOption?.code,
                display: selectedCriticalityOption?.display,
            },
            code: {
                coding: code,
                text: code?.display, // use display text
            },
            note: [
                {
                    text: data?.note,
                    time: '',
                    authorReference: {
                        reference: '',
                        type: '',
                        identifier: {
                            use: '',
                            system: '',
                            value: '',
                        },
                        display: '',
                    },
                },
            ],
        };
        if (selectedMode === 'appointment' && data.appointment) {
            let appData = JSON.parse(data.appointment);
            payload.appointmentId = appData?._id;
            payload.onset = {
                onsetDateTime: appData?.date, // optionally use actual date
            };
        } else if (selectedMode === 'date' && data.appointmentDate) {
            payload.onset = {
                onsetDateTime: data.appointmentDate,
            };
        }
        if (allergyId) {
            payload.id = allergyId
            dispatch(updateAllergiesAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createAllergiesAction({ key: encryptMessage(payload) }));
        }
    };

    const allergyCategoryChange = (data) => {
        dispatch(getFoodAllergiesAction({ query: '', skip: 1 }))
    }


    return (
        <Modal show={show} onHide={closeModal} size="lg" centered>
            <Modal.Header closeButton className="px-2 py-0 ">
                <Modal.Title className="mb-0">Add Allergy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {store?.getAllergyByIdReducer?.loading ?
                    <Row>
                        <Col sm={12} className='d-flex align-items-center justify-content-center p-5'>
                            <Spinner />
                        </Col>
                    </Row>
                    :
                    <Form onSubmit={handleSubmit(submitAllergiesData)}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Allergy Category
                                    </Form.Label>
                                    <Form.Select
                                        {...register('category', { required: 'Allergy Category is required' })}
                                        onChange={(e) => allergyCategoryChange(e.target.value)}>
                                        <option key={''} value={''}>Select allergy category</option>
                                        {category?.map((item) => (
                                            <option key={item?.code} value={item?.code}>
                                                {item?.display}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Select Allergy <span className='text-danger'>*</span></Form.Label>
                                    <Controller
                                        name="allergyCode"
                                        control={control}
                                        rules={{ required: 'Allergy selection is required' }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <AsyncSelect
                                                    // ref={selectRef}
                                                    loadOptions={loadCodeOptions}
                                                    defaultOptions={formattedCodeOption.slice(0, 10)}
                                                    isSearchable
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    placeholder="Select"
                                                    value={
                                                        formattedCodeOption.find(option => option.value.code === field.value?.code) || null
                                                    }
                                                    onChange={option => {
                                                        field.onChange(option ? option.value : null);
                                                        setCode(option ? option.value : null);
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
                                                {fieldState.error && (
                                                    <Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
                                                )}
                                            </>
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label htmlFor="criticality" className="mb-0">
                                        Criticality
                                    </Form.Label>
                                    <Form.Select
                                        {...register('criticality', { required: 'Criticality is required' })}>
                                        <option value="" hidden>
                                            Select Criticality
                                        </option>
                                        {criticality?.map((item) => (
                                            <option selected={item?.code === 'low'} key={item?.code} value={item?.code}>
                                                {item?.display}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.criticality && (
                                        <Form.Text className="text-danger fs-6">{errors.criticality.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label htmlFor="status" className="mb-0">
                                        Clinical Status
                                    </Form.Label>
                                    <Form.Select
                                        {...register('status', { required: 'Clinical Status is required' })}>
                                        {clinicalStatus?.map((status) => (
                                            <option key={status?.code} value={status?.code}>
                                                {status?.display}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.status && (
                                        <Form.Text className="text-danger">{errors.status.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label className="mb-0">Select Mode</Form.Label>
                                    <div className="d-flex gap-3 mb-0">
                                        <Form.Check
                                            type="radio"
                                            label="By Appointment"
                                            name="selectionMode"
                                            value="appointment"
                                            checked={selectedMode === 'appointment'}
                                            onChange={() => setSelectedMode('appointment')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="By Date"
                                            name="selectionMode"
                                            value="date"
                                            checked={selectedMode === 'date'}
                                            onChange={() => setSelectedMode('date')}
                                        />
                                    </div>

                                    {selectedMode === 'appointment' ? (
                                        <>
                                            <Form.Label className="mb-0">Appointment</Form.Label>
                                            <Form.Select {...register('appointment')}>
                                                <option>Select Appointment Date </option>
                                                {appointments?.map((item) => (
                                                    <option key={item?._id} value={JSON.stringify(item)}>
                                                        {item?.date ? new Date(item.date).toISOString().split('T')[0] : 'N/A'}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </>
                                    ) : (
                                        <>
                                            <Form.Label className="mb-0">Select Date (till today)</Form.Label>
                                            <Form.Control type="date" max={today} {...register('appointmentDate')} />
                                        </>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={12}>
                                <TextEditor
                                    //   value={editorContent}
                                    //   onChange={setEditorContent}
                                    placeholder="Start writing your content here..."
                                    minHeight={300}
                                    className="shadow-lg"
                                />
                            </Col>
                            <Col sm={12} className='d-flex align-items-center justify-content-end gap-2'>
                                <Button className='custom-buttons' type='submit'>Save & Add Another</Button>
                                <Button className='custom-buttons' type='submit'>Save & Exit</Button>
                            </Col>
                        </Row>
                    </Form>
                }
            </Modal.Body>
        </Modal>
    )
}

export default AllergyModal