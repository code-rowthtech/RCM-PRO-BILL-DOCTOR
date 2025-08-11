import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Toast, Row, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AddDemographics from '../../Patients/AddPatient/AddDemographics';
import { debounce } from 'lodash';

import {
    createAppointmentsAction,
    getAllAppointmentsAction,
    getAppointmentDetailsAction,
    getPatientsAction,
    getPatientsByIdAction,
    getPractitionerAvailabilityAction,
    updateAppointmentDetailsAction,
} from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { FaPlus } from 'react-icons/fa';
import AddPatientDetails from '../../Patients/AddPatient/AddPatientDetails';
import { appointmentTypeOptions } from '../../../../utils/DataSets/apppointmenttype.data';
import AsyncSelect from 'react-select/async';
import { appointmentReasonOptions } from '../../../../utils/DataSets/appointmentreason.data';
import Spinner from '../../../../constants/Spinner';
import { appointmentRecurrence, appointmentStatus } from '../../../../utils/DataSets/appointmentstatus';

// Memoized components
const Daily = React.memo(({ register, watch, setValue, onDatesCalculated, appointmentDetails }) => {
    const daysNumberDaily = watch('daysNumberDaily');
    const dailyOccurrenceDate = watch('dailyOccurrenceDate');
    const dailyOccurenceCount = watch('dailyOccurenceCount');
    const scheduledDate = watch('scheduled');

    useEffect(() => {
        if (!daysNumberDaily || (!dailyOccurrenceDate && !dailyOccurenceCount) || !scheduledDate) {
            setValue('dailyOccurenceCount', '');
            onDatesCalculated?.([]);
            return;
        }

        const startDate = new Date(scheduledDate);
        const dates = [];

        if (dailyOccurenceCount && !dailyOccurrenceDate) {
            for (let i = 0; i < dailyOccurenceCount; i++) {
                const nextDate = new Date(startDate);
                nextDate.setDate(startDate.getDate() + i * daysNumberDaily);
                dates.push(nextDate.toISOString().split('T')[0]);
            }
        } else if (dailyOccurrenceDate) {
            const endDate = new Date(dailyOccurrenceDate);
            let currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                dates.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + daysNumberDaily);
            }
        }

        onDatesCalculated?.(dates);
        setValue('dailyOccurenceCount', dates?.length);
    }, [daysNumberDaily, dailyOccurrenceDate, scheduledDate, setValue, onDatesCalculated]);

    return (
        <>
            <Col sm={6}>
                <Form.Group className="mb-1" controlId="appointmentType">
                    <Form.Label className="mb-0">Every</Form.Label>
                    <Form.Control
                        {...register('daysNumberDaily', { valueAsNumber: true })}
                        placeholder="Enter number of days"
                        type="number"
                        min={1}
                        readOnly={appointmentDetails?.repeat}
                        style={{ cursor: appointmentDetails?.repeat ? 'not-allowed' : '' }}
                    />
                </Form.Group>
            </Col>
            <Col sm={4}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0">Ends On</Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('dailyOccurrenceDate')}
                            type="date"
                            min={scheduledDate}
                            readOnly={appointmentDetails?.repeat}
                            style={{ cursor: appointmentDetails?.repeat ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text>
                    </span>
                </Form.Group>
            </Col>
            <Col sm={2}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0"></Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('dailyOccurenceCount', { valueAsNumber: true })}
                            placeholder="Enter number of days"
                            type="number"
                            min={1}
                            readOnly={appointmentDetails?.repeat}
                            style={{ cursor: appointmentDetails?.repeat ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;days</Form.Text>
                    </span>
                </Form.Group>
            </Col>
        </>
    );
});

const Weekly = React.memo(({ register, watch, setValue, onDatesCalculated, appointmentDetails }) => {
    const appointmentDays = watch('appointmentDay');
    const weeklyOccurrenceDate = watch('weeklyOccurrenceDate');
    const weekInterval = watch('weekInterval');
    const scheduledDate = watch('scheduled');

    useEffect(() => {
        if (!appointmentDays || !weeklyOccurrenceDate || !scheduledDate || !weekInterval) {
            setValue('weeklyOccurenceCount', '');
            onDatesCalculated([]);
            return;
        }

        const selectedDays = Object.entries(appointmentDays)
            .filter(([_, selected]) => selected)
            .map(([day]) =>
                ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day)
            );

        const interval = parseInt(weekInterval) || 1;
        const endDate = new Date(weeklyOccurrenceDate);

        if (selectedDays.length === 0 || isNaN(endDate.getTime())) {
            setValue('weeklyOccurenceCount', '');
            onDatesCalculated([]);
            return;
        }

        const scheduledStart = new Date(scheduledDate);
        scheduledStart.setHours(0, 0, 0, 0);

        const appointments = [];
        let currentDate = new Date(scheduledStart);

        while (currentDate <= endDate) {
            selectedDays.forEach((dayIndex) => {
                const weekStartDate = new Date(currentDate);
                const appointmentDate = new Date(weekStartDate);
                appointmentDate.setDate(weekStartDate.getDate() + ((dayIndex - weekStartDate.getDay() + 7) % 7));

                if (appointmentDate >= scheduledStart && appointmentDate <= endDate) {
                    appointments.push(appointmentDate);
                }
            });
            currentDate.setDate(currentDate.getDate() + 7 * interval);
        }

        appointments.sort((a, b) => a.getTime() - b.getTime());
        setValue('weeklyOccurenceCount', appointments.length);
        onDatesCalculated(appointments);
    }, [appointmentDays, weeklyOccurrenceDate, weekInterval, scheduledDate, setValue, onDatesCalculated]);

    const todayString = new Date().toISOString().split('T')[0];
    const oneYearLaterString = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0];

    return (
        <>
            <Col sm={12}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0">Occurs On</Form.Label>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                            <Form.Check
                                key={`day-${day}`}
                                type="checkbox"
                                label={day.charAt(0).toUpperCase() + day.slice(1)}
                                id={`day-${day}`}
                                {...register(`appointmentDay.${day}`)}
                                readOnly={appointmentDetails?.repeat}
                                style={{ cursor: appointmentDetails?.repeat ? 'not-allowed' : '' }}
                            />
                        ))}
                    </div>
                </Form.Group>
            </Col>

            <Col sm={6}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0">Every</Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            placeholder="Enter number of weeks"
                            {...register('weekInterval', { valueAsNumber: true })}
                            type="number"
                            min={1}
                            readOnly={appointmentDetails?.repeat}
                            style={{ cursor: appointmentDetails?.repeat ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;week(s)</Form.Text>
                    </span>
                </Form.Group>
            </Col>

            <Col sm={4}>
                <Form.Group className="mb-1" controlId="weeklyOccurrenceDate">
                    <Form.Label className="mb-0">Ends On</Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('weeklyOccurrenceDate')}
                            type="date"
                            min={scheduledDate || todayString}
                            max={oneYearLaterString}
                            readOnly={appointmentDetails?.repeat}
                            style={{ cursor: appointmentDetails?.repeat ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text>
                    </span>
                </Form.Group>
            </Col>

            <Col sm={2}>
                <Form.Group className="mb-1" controlId="weeklyOccurenceCount">
                    <Form.Label className="mb-0"></Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('weeklyOccurenceCount')}
                            placeholder="Calculated"
                            type="text"
                            min={1}
                            readOnly={appointmentDetails?.repeat}
                            style={{ cursor: appointmentDetails?.repeat ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;appointments</Form.Text>
                    </span>
                </Form.Group>
            </Col>
        </>
    );
});

const Monthly = React.memo(({ register, watch }) => (
    <>
        <Col sm={6}>
            <Form.Group className="mb-1" controlId="dayOfMonth">
                <Form.Label className="mb-0">Day of Month</Form.Label>
                <Form.Control
                    placeholder="Enter day of month (1-31)"
                    {...register('dayOfMonth', { valueAsNumber: true, min: 1, max: 31 })}
                    type="number"
                    min={1}
                    max={31}
                />
            </Form.Group>
        </Col>

        <Col sm={6}>
            <Form.Group className="mb-1" controlId="nthWeekOfMonth">
                <Form.Label className="mb-0">Nth Week of Month</Form.Label>
                <Form.Control
                    placeholder="Select week (e.g., First, Second)"
                    {...register('nthWeekOfMonth')}
                    type="text"
                />
            </Form.Group>
        </Col>

        <Col sm={6}>
            <Form.Group className="mb-1" controlId="dayOfWeek">
                <Form.Label className="mb-0">Day of Week</Form.Label>
                <Form.Select {...register('dayOfWeek')}>
                    <option value="">Select day</option>
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </Col>

        <Col sm={6}>
            <Form.Group className="mb-1" controlId="monthInterval">
                <Form.Label className="mb-0">Every</Form.Label>
                <span className="d-flex">
                    <Form.Control
                        placeholder="Enter number of months"
                        {...register('monthInterval', { valueAsNumber: true, min: 1, required: true })}
                        type="number"
                        min={1}
                    />
                    <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;month(s)</Form.Text>
                </span>
            </Form.Group>
        </Col>

        <Col sm={4}>
            <Form.Group className="mb-1">
                <Form.Label className="mb-0">Ends On</Form.Label>
                <span className="d-flex">
                    <Form.Control
                        {...register('monthlyOccurrenceDate')}
                        type="date"
                        min={watch('scheduled')}
                    />
                    <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text>
                </span>
            </Form.Group>
        </Col>

        <Col sm={2}>
            <Form.Group className="mb-1">
                <Form.Label className="mb-0"></Form.Label>
                <span className="d-flex">
                    <Form.Control
                        {...register('monthlyOccurenceCount')}
                        placeholder="Enter number of appointments"
                        type="number"
                        min={1}
                    />
                    <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;appointments</Form.Text>
                </span>
            </Form.Group>
        </Col>
    </>
));

const AppointmentForm = ({ Id, appointmentId, calendarView, selectedSlot }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        getValues,
        reset,
    } = useForm({
        defaultValues: {
            scheduled: new Date().toISOString().split('T')[0],
            startTime: '10:00',
            duration: 30,
        },
    });
    const [searchParams] = useSearchParams();
    const id = Id ? Id : searchParams.get('id');
    const store = useSelector((state) => state);
    const createResponse = store?.createPatientsReducer?.data?.status;
    const createPatientResponse = store?.createPatientsReducer?.data?.patient;
    const [submissionType, setSubmissionType] = useState(null);
    const [age, setAge] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [createAppointmentType, setCreateAppointmentType] = useState(null);
    const createAppointmentResponse = store?.createAppointmentsReducer?.data?.status;
    const appointmentDetails = store?.getAppointmentDetailsReducer?.data?.appointment;
    const availabilityResponse = store?.getPractitionerAvailabilityReducer?.data;

    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [activeTab, setActiveTab] = useState('personalDetails');
    const [btnShow, setBtnShow] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [showModal, setShowModal] = useState(false);
    const doctorName = JSON.parse(sessionStorage.getItem('hyper_user'))?.name?.text;
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const [repeat, setRepeat] = useState(false);
    const [appointmentDates, setAppointmentDates] = useState();
    const [repeatType, setRepeatType] = useState('day');
    const [showToast, setShowToast] = useState(false);
    const isLoading =
        store?.getPatientsReducer?.loading ||
        store?.createPatientsReducer?.loading ||
        store?.getAppointmentDetailsReducer?.loading ||
        store?.createAppointmentsReducer?.loading ||
        store?.getPractitionerAvailabilityReducer?.loading ||
        store?.updateAppointmentDetailsReducer?.loading;

    const patientsData = store?.getPatientsReducer?.data?.data || [];

    useEffect(() => {
        if (createAppointmentResponse === 200 && createAppointmentType === 'back') {
            reset();
            navigate('/apps/appointments/list');
        } else if (createAppointmentResponse === 200 && createAppointmentType === 'save') {
        }
    }, [createAppointmentType, createAppointmentResponse]);

    const handleSelectChange = (e) => {
        const value = e.target.value;

        if (value === 'new-patient') {
            setShowModal(true);
        } else {
            setSelectedOption(value);
        }
    };

    useEffect(() => {
        const data = {
            id: appointmentId ? appointmentId : id,
        };
        if (appointmentId || id) {
            dispatch(getAppointmentDetailsAction(data));
        }
    }, [dispatch, appointmentId, id]);

    useEffect(() => {
        setSelectedOption(Id);
    }, [Id]);

    useEffect(() => {
        if (age) {
            setValue('approxAge', age);
        }
    }, [age]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'personalDetails') {
            setBtnShow(true);
        } else {
            setBtnShow(false);
        }
    };

    useEffect(() => {
        if (createResponse === 201 && submissionType === 'saveAndNext') {
            handleCloseModal();
            reset();
            setActiveTab('demographicDetails');
            setPatientId(createPatientResponse?._id);
            // dispatch(stateEmptydAction());
            const data = {
                doctorId: doctorId,
                page: skip,
                limit: 10,
                search: search,
                clinicId: clinicId,
            };
            dispatch(getPatientsAction(data));
        } else if (createResponse === 201 && submissionType === 'saveAndReset') {
            reset();
            setSelectedDoctor(null);
            setLogo(null);
            setLogoName(null);
            setPatientId(null);
            // dispatch(stateEmptydAction());
            const data = {
                doctorId: doctorId,
                page: skip,
                limit: 10,
                search: search,
                clinicId: clinicId,
            };
            dispatch(getPatientsAction(data));
        } else if (createResponse === 201 && submissionType === 'save') {
            setPatientId(createPatientResponse?._id);
        }
    }, [createResponse, submissionType]);

    useEffect(() => {
        setValue('primaryProvider', doctorName);
    }, [doctorName, setValue]);

    const formatTime = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    };

    const getDefaultTime = () => {
        return '10:00'; // Default Start Time
    };

    useEffect(() => {
        if (selectedSlot) {
            const date = new Date(calendarView === 'month' ? selectedSlot?.slots : selectedSlot?.start);
            const localDateString = date.toLocaleDateString('en-CA');
            const startTime = formatTime(selectedSlot?.start);

            // Only update if different
            if (getValues('scheduled') !== localDateString) {
                setValue('scheduled', localDateString);
            }

            if (calendarView !== 'month' && getValues('startTime') !== startTime) {
                setValue('startTime', startTime);
            }
        } else {
            const today = getTodayDate();
            const defaultTime = getDefaultTime();

            if (getValues('scheduled') !== today) {
                setValue('scheduled', today);
            }

            if (getValues('startTime') !== defaultTime) {
                setValue('startTime', defaultTime);
            }

            if (getValues('duration') !== '30') {
                setValue('duration', '30');
            }
        }
    }, [selectedSlot, calendarView]);

    useEffect(() => {
        const data = {
            doctorId: doctorId,
            page: skip,
            limit: 10,
            search: search,
            clinicId: clinicId,
        };
        dispatch(getPatientsAction(data));
    }, [dispatch, skip, search]);

    const selectedDate = watch('scheduled'); // Watch the selected date field

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        if (selectedDate) {
            const data = { date: selectedDate };
            dispatch(getPractitionerAvailabilityAction(data));
        }
    }, [dispatch, selectedDate]);

    useEffect(() => {
        if (availabilityResponse?.available === false) {
            setShowConfirmationModal(true);
        }
    }, [availabilityResponse]);

    useEffect(() => {
        if (createResponse === 201) {
            setPatientId(createPatientResponse?._id);
        }
    }, [createResponse]);

    useEffect(() => {
        if (appointmentDetails && patientsData?.length > 0) {
            const details = appointmentDetails;
            setValue('minutesDuration', appointmentDetails?.minutesDuration);
            setValue('consultationRoom', appointmentDetails?.examRoom);
            setValue('status', appointmentDetails?.status);
            setValue('patient', appointmentDetails?.subject?._id);
            setSelectedOption(appointmentDetails?.subject?._id);
            setValue('appointmentType', appointmentDetails?.appointmentType?.coding?.[0]?.display);
            setAppointmentReason(appointmentDetails?.reason?.[0]?.coding?.[0]);
            setValue(
                'scheduled',
                appointmentDetails?.start ? new Date(appointmentDetails?.start).toISOString().split('T')[0] : ''
            );
            setValue(
                'startTime',
                appointmentDetails?.start
                    ? new Date(appointmentDetails?.start).toISOString().split('T')[1].slice(0, 5)
                    : ''
            );
            if (appointmentDetails?.repeat) {
                setRepeat(true);
                setRepeatType(appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display);
            }
            if (appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display === 'day') {
                setValue('dailyOccurenceCount');
                setValue(
                    'dailyOccurrenceDate',
                    appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate
                        ? new Date(appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate)
                            ?.toISOString()
                            .split('T')[0]
                        : ''
                );
                setValue('daysNumberDaily', appointmentDetails?.recurrenceTemplate?.every);
            } else if (appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display === 'week') {
                const template = appointmentDetails?.recurrenceTemplate?.weeklyTemplate;
                const { weekInterval, ...days } = template;
                setValue('appointmentDay', days);
                setValue('weeklyOccurenceCount', appointmentDetails?.recurrenceTemplate?.occurrenceCount);
                setValue(
                    'weeklyOccurrenceDate',
                    appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate
                        ? new Date(appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate)
                            ?.toISOString()
                            .split('T')[0]
                        : ''
                );
                setValue('weekInterval', appointmentDetails?.recurrenceTemplate?.every);
                // weeklyOccurenceCount
                // weeklyOccurrenceDate
                // weekInterval
                // appointmentDay
                // setValue("weeklyOccurenceCount",)
                // setValue("weeklyOccurrenceDate", appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate ? new Date(appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate)?.toISOString().split('T')[0] : '')
                // setValue("weeksNumberDaily", appointmentDetails?.recurrenceTemplate?.every)
            }
            if (details?.date) {
                setValue('scheduled', new Date(details?.date).toISOString().split('T')[0]);
            }
        }
    }, [appointmentDetails, patientsData]);

    useEffect(() => {
        if (id) {
            const payload = {
                id: id,
            };
            dispatch(getPatientsByIdAction({ key: encryptMessage(payload) }));
        }
    }, [id]);

    const onSubmit = (data) => {
        const selectedAppointmentType = appointmentTypeOptions.find((option) => option.show === data.appointmentType);
        const appointmentTypePayload = {
            coding: [
                {
                    system: selectedAppointmentType.system,
                    code: selectedAppointmentType.value,
                    display: selectedAppointmentType.show,
                },
            ],
            text: selectedAppointmentType.label,
        };
        const selectedAppointmentRecurrence = appointmentRecurrence?.find((item) => item?.display === repeatType);
        // ✅ Define startDateTime and endDateTime here, BEFORE using in payload
        const startDateTime = new Date(`${data.scheduled}T${data.startTime}:00`);
        const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);

        const payload = {
            ...(id ? { id } : { id: appointmentId }),
            subject: data?.patient,
            ...(id ? {} : { clinicId }), // Exclude `clinicId` in update case
            // doctor: doctorId,
            start: data?.startTime,
            appointmentType: appointmentTypePayload,
            date: data?.scheduled,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            created: new Date().toISOString(),
            minutesDuration: data?.duration,
            ...(appointmentReason?.text ||
                appointmentReason?.display === appointmentDetails?.reason?.[0]?.coding?.[0]?.display
                ? {}
                : {
                    reason: [
                        {
                            coding: appointmentReason,
                            text: appointmentReason?.display, // use display text
                        },
                    ],
                }),
            examRoom: data?.consultationRoom,
            status: data?.status,
            slot: data?.startTime,
            ...(repeat &&
                repeatType !== '' && {
                recurrenceTemplate: {
                    ...(repeat && {
                        recurrenceType: {
                            coding: [selectedAppointmentRecurrence],
                            text: selectedAppointmentRecurrence.display,
                        },
                    }),
                    ...(repeatType === 'day' && {
                        occurrenceCount: appointmentDates?.length,
                        occurrenceDate: appointmentDates,
                        lastOccurrenceDate: data?.dailyOccurrenceDate,
                        every: data?.daysNumberDaily,
                    }),
                    ...(repeatType === 'week' && {
                        occurrenceCount: appointmentDates?.length,
                        occurrenceDate: appointmentDates,
                        lastOccurrenceDate: data?.weeklyOccurrenceDate,
                        every: data?.weekInterval,
                        weeklyTemplate: {
                            ...(data?.appointmentDay || {}),
                            weekInterval: data?.weekInterval,
                        },
                    }),
                    ...(repeatType === 'month' && {
                        monthlyTemplate: {
                            dayOfMonth: data?.dayOfMonth,
                            nthWeekOfMonth: { system: '', code: '', display: data?.nthWeekOfMonth },
                            dayOfWeek: { system: '', code: '', display: data?.dayOfWeek },
                            monthInterval: data?.monthInterval,
                        },
                    }),
                },
            }),
        };

        // Dispatch update if `id` exists, otherwise create a new one
        if (id || appointmentId) {
            dispatch(updateAppointmentDetailsAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createAppointmentsAction({ key: encryptMessage(payload) }));
        }
        // reset();
    };

    // Handle new patient modal
    const handlePlusIconClick = useCallback(() => setShowModal(true), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);

    // Appointment reason handling
    const formattedReasonOptions = useMemo(
        () =>
            appointmentReasonOptions.map((reason) => ({
                value: reason,
                label: reason.display,
            })),
        []
    );

    const [appointmentReason, setAppointmentReason] = useState(null);

    const handleReasonChange = useCallback((selectedOption) => {
        setAppointmentReason(selectedOption ? selectedOption.value : '');
    }, []);

    const selectedReasonOption =
        formattedReasonOptions.find((option) => option?.value?.code === appointmentReason?.code) ||
        formattedReasonOptions.find((option) => option?.display === appointmentReason);

    const loadReasonOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedReasonOptions.slice(0, 10));
                return;
            }

            const filteredOptions = formattedReasonOptions.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            callback(filteredOptions.slice(0, 20));
        },
        [formattedReasonOptions]
    );

    return (
        <div>
            {isLoading ? (
                <Row style={{ height: '40vh' }}>
                    <Col className="d-flex justify-content-center align-items-center">
                        <Spinner />
                    </Col>
                </Row>
            ) : (
                <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6} xs={12}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">
                                    Patient{!id && <span className="text-danger">*</span>}
                                </Form.Label>
                                <InputGroup>
                                    <Form.Select
                                        {...register('patient', { required: !id && 'Patient is required' })}
                                        className="form-select"
                                        value={selectedOption}
                                        onChange={handleSelectChange}
                                        data-has-value={!!selectedOption}
                                        disabled={id}>
                                        <option value="" hidden>
                                            Select Patient
                                        </option>
                                        {patientsData?.map((patient) => (
                                            <option key={patient?._id} value={patient?._id}>
                                                {patient?.name?.[0]?.text}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {!id && (
                                        <InputGroup.Text onClick={handlePlusIconClick} style={{ cursor: 'pointer' }}>
                                            <FaPlus className="text-primary" />
                                        </InputGroup.Text>
                                    )}
                                </InputGroup>
                                {errors?.patient && (
                                    <p className="text-danger mb-0 err-font">{errors?.patient?.message}</p>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={6} xs={12}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Doctor</Form.Label>
                                <Form.Control
                                    id="doctor"
                                    type="text"
                                    {...register('doctor')}
                                    value={doctorName}
                                    data-has-value={!!watch('doctor')}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                        {/* <Col md={6} xs={12}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Office</Form.Label>
                                <Form.Control as="select" {...register('office')} data-has-value={!!watch('office')}>
                                    <option value="" hidden>
                                        Select Office
                                    </option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </Form.Control>
                            </Form.Group>
                        </Col> */}
                        <Col md={6} xs={12}>
                            <Form.Group className="mb-1" controlId="appointmentType">
                                <Form.Label className="mb-0">
                                    Appointment Type{!id && <span className="text-danger">*</span>}
                                </Form.Label>
                                <Form.Select
                                    className="form-select"
                                    {...register('appointmentType', { required: 'Appointment Type is required' })}
                                    data-has-value={!!watch('appointmentType')}>
                                    <option value="" hidden>
                                        Select Appointment Type
                                    </option>
                                    {appointmentTypeOptions.map((option) => (
                                        <option key={option.value} value={option.show}>
                                            {option.show} ( {option.label})
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.appointmentType && (
                                    <p className="text-danger err-font">{errors.appointmentType.message}</p>
                                )}
                            </Form.Group>
                        </Col>
                        <Toast
                            show={showToast}
                            onClose={() => setShowToast(false)}
                            delay={2000}
                            autohide
                            style={{
                                position: 'fixed',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                            }}>
                            <Toast.Body>Please select a doctor first!</Toast.Body>
                        </Toast>
                        <Col md={6} xs={12} className="d-flex gap-2">
                            <Form.Group className="mb-1" style={{ width: '150px' }} controlId="scheduled">
                                <Form.Label className="mb-0">Scheduled</Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('scheduled', { required: 'Scheduled date is required' })}
                                    min={getTodayDate()}
                                />
                            </Form.Group>

                            <Form.Group className="mb-1" style={{ width: '100px' }} controlId="starttime">
                                <Form.Label className="mb-0">Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    {...register('startTime', { required: 'Time is required' })}
                                />
                            </Form.Group>

                            <div className="d-flex">
                                <Form.Group className="mb-1" style={{ width: '100px' }} controlId="duration">
                                    <Form.Label className="mb-0">Duration</Form.Label>
                                    <Form.Control
                                        type="number"
                                        {...register('duration', { required: 'Duration is required' })}
                                    />
                                </Form.Group>
                                <span className="text-secondary fs-6 fw-bold mt-3 pt-1 ps-2">minutes</span>
                            </div>

                            <Form.Group className="mb-0 ms-2">
                                <Form.Label className="mb-0"></Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Repeat"
                                    checked={repeat}
                                    onChange={(e) => setRepeat(e.target.checked)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} xs={12}>
                            <Form.Group>
                                <Form.Label className="mb-0">Reason</Form.Label>
                                <AsyncSelect
                                    loadOptions={loadReasonOptions}
                                    defaultOptions={formattedReasonOptions.slice(0, 10)} // Show first 10 options initially
                                    isSearchable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select"
                                    value={selectedReasonOption}
                                    onChange={handleReasonChange}
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
                        <Col md={6} xs={12}>
                            <Form.Group className="mb-1" controlId="consultationRoom">
                                <Form.Label className="mb-0">Consultation Room</Form.Label>
                                <Form.Select
                                    className="form-select"
                                    data-has-value={!!watch('consultationRoom')}
                                    {...register('consultationRoom')}>
                                    <option value="" hidden>
                                        Select Consultation Room
                                    </option>
                                    <option value="Room 1">Room 1</option>
                                    <option value="Room 2">Room 2</option>
                                    {/* <option value="3">Room 3</option> */}
                                    {/* <option value="4">Room 4</option> */}
                                </Form.Select>
                                {/* {errors.appointmentType && <p className="text-danger err-font">{errors.consultationRoom.message}</p>} */}
                            </Form.Group>
                        </Col>
                        {/* <Col md={6} xs={12}>
                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Consent Forms</Form.Label>
                                <Form.Control
                                    as="select"
                                    data-has-value={!!watch('consentForms')}
                                    {...register('consentForms')}>
                                    <option value="" hidden>
                                        Select Consent Forms
                                    </option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </Form.Control>
                            </Form.Group>
                        </Col> */}
                        <Col md={6} xs={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-1">Status <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    data-has-value={!!watch('status')}
                                    className="form-select"
                                    {...register('status', {
                                        required: 'Status is required',
                                    })}
                                    defaultValue="Scheduled" // Default value set to "Scheduled"
                                >
                                    <option value="" key={''} hidden>
                                        Select Status
                                    </option>
                                    {appointmentStatus?.map((data, index) => (
                                        <option value={data?.code} key={index}>
                                            {data?.display}
                                        </option>
                                    ))}
                                </Form.Control>
                                {errors.status && <p className="text-danger mt-1 text-sm">{errors.status.message}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        {repeat && (
                            <Col sm={12} className="mt-2">
                                <div className="time-period-tabs">
                                    <ul
                                        style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                                        className="nav nav-pills">
                                        {appointmentRecurrence?.map((data, index) => (
                                            <li
                                                key={index}
                                                style={{
                                                    cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '',
                                                }}
                                                className="nav-item">
                                                <span
                                                    className={`cursor-pointer text-capitalize mx-1 border border-muted nav-link py-1  
                                                    ${repeatType === data.display ? 'active' : 'text-black'}`}
                                                    onClick={() => {
                                                        if (appointmentDetails?.repeat && id) {
                                                            return;
                                                        } else {
                                                            setRepeatType(data?.display);
                                                        }
                                                    }}>
                                                    {data?.display === 'day' && 'Daily'}
                                                    {data?.display === 'week' && 'Weekly'}
                                                    {data?.display === 'month' && 'Monthly'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Col>
                        )}
                    </Row>
                    {repeat && (
                        <Row className="mt-2">
                            {repeatType === 'day' && (
                                <Daily
                                    register={register}
                                    watch={watch}
                                    id={id}
                                    setValue={setValue}
                                    appointmentDetails={appointmentDetails}
                                    onDatesCalculated={(dates) => setAppointmentDates(dates)}
                                />
                            )}
                            {repeatType === 'week' && (
                                <Weekly
                                    errors={errors}
                                    register={register}
                                    watch={watch}
                                    id={id}
                                    setValue={setValue}
                                    appointmentDetails={appointmentDetails}
                                    onDatesCalculated={(dates) => setAppointmentDates(dates)}
                                />
                            )}
                            {repeatType === 'month' && <Monthly register={register} watch={watch} />}
                        </Row>
                    )}
                    <Row>
                        <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                            {!id && (
                                <Button
                                    className="cancel-button"
                                    disabled={
                                        store?.createAppointmentReducer?.loading ||
                                        store?.updateAppointmentDetailsReducer?.loading
                                    }
                                    onClick={() => {
                                        reset();
                                        navigate(-1);
                                    }}>
                                    Cancel
                                </Button>
                            )}
                            <Button
                                className="custom-buttons"
                                type="submit"
                                style={{ width: '65px' }}
                                disabled={
                                    store?.createAppointmentsReducer?.loading ||
                                    store?.updateAppointmentDetailsReducer?.loading
                                }>
                                {store?.createAppointmentsReducer?.loading ||
                                    store?.updateAppointmentDetailsReducer?.loading ? (
                                    <Spinner color="white" className="spinner-border-sm" />
                                ) : id ? (
                                    'Update'
                                ) : (
                                    'Save'
                                )}
                            </Button>
                            {/* <Button className="custom-buttons">Cancel</Button> */}
                        </Col>
                    </Row>
                </Form>
            )}

            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        overflowY: 'scroll',
                        height: '60vh',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}>
                    <style>
                        {`::-webkit-scrollbar {
                           display: none; /* Chrome, Safari, and Edge */
                           }`}
                    </style>
                    <div className="d-flex justify-content-between">
                        <div>
                            <ul className="nav nav-underline">
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'personalDetails' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('personalDetails')}>
                                        Personal Details
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'demographicDetails' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('demographicDetails')}>
                                        Demographic
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'referringDoctor' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('referringDoctor')}>
                                        Referring Doctor
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'responsible' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('responsible')}>
                                        Responsible party
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'insurance' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('insurance')}>
                                        Insurance
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex">
                            {activeTab === 'responsible' && (
                                <Button className="me-2 custom-buttons" onClick={() => handleTabChange('responsible')}>
                                    Payment
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="px-2">
                        {activeTab === 'personalDetails' && (
                            <AddPatientDetails patientId={patientId} setSubmissionType={setSubmissionType} />
                        )}
                        {activeTab === 'responsible' && <p>responsible</p>}
                        {activeTab === 'insurance' && <p>insurance...</p>}
                        {activeTab === 'demographicDetails' && <AddDemographics patientId={patientId} />}
                        {activeTab === 'referringDoctor' && <p>referringDoctor...</p>}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                show={showConfirmationModal}
                onHide={() => {
                    setShowConfirmationModal(false);
                    setValue('scheduled', '');
                }}
                centered>
                <Modal.Body>
                    <div className="text-center">
                        <h4>Confirmation Needed</h4>
                    </div>
                    <div className="text-center mt-4">
                        <p>Doctor is on holiday. Are you sure you want to create an appointment?</p>
                    </div>
                    <div className="d-flex justify-content-center gap-2 mt-4 mb-1">
                        <Button
                            className="cancel-button"
                            onClick={() => {
                                setShowConfirmationModal(false);
                                setValue('scheduled', ''); // Reset the selected date
                            }}>
                            Cancel
                        </Button>
                        <Button className="custom-buttons" onClick={() => setShowConfirmationModal(false)}>
                            Proceed
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AppointmentForm;
