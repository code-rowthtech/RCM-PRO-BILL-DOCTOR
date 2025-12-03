// React and third-party imports
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdClose } from 'react-icons/io'

// Components and utilities
import AppointmentForm from './Tabs/AppointmentForm'
import Spinner from '../../../constants/Spinner'
import ToastHandle from '../../../helpers/ToastMessage'
import { getEventStyle } from '../../../utils/calendarUtils'
import { getAppointmentsAction } from '../../../redux/actions'
import { loggedInUser } from '../../../helpers/loggedInUser'

// Calendar localizer setup
const localizer = momentLocalizer(moment)

const AppointmentCalendar = () => {
    // Redux state and dispatch
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    // Derived state from Redux store
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const createAppointmentResponse = store?.createAppointmentsReducer?.data?.status;
    const updateSuccess = store?.updateAppointmentDetailsReducer?.data?.status;
    const isLoading = store?.getAppointmentsReducer?.loading;

    // Component state
    const [events, setEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [calendarView, setCalendarView] = useState('month');
    const [monthYearFilter, setMonthYearFilter] = useState(() => {
        const today = new Date();
        return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    });

    // Utility functions
    const getAppointmentParams = useCallback(() => ({
        clinicId: loggedInUser?.clinicId || store?.Auth?.user?.clinicId,
        status: '',
        doctorId: loggedInUser?.doctorId || store?.Auth?.user?.doctorId,
        limit: 100,
        skip: '',
        monthYear: monthYearFilter,
    }), [store?.Auth?.user, monthYearFilter])

    const formatMonthYear = useCallback((dateString) => {
        const date = new Date(dateString)
        const options = { month: 'long', year: 'numeric' }
        setMonthYearFilter(date.toLocaleDateString('en-US', options))
    }, [])

    // Initial data fetch
    useEffect(() => {
        dispatch(getAppointmentsAction(getAppointmentParams()))
    }, [dispatch, getAppointmentParams])

    // Memoized event style getter
    const memoizedEventStyle = useCallback((event) => getEventStyle(event?.status), [])

    // Custom Event Component
    const CustomEvent = useMemo(() => {
        return ({ event }) => (
            <p className="text-capitalize mb-0 ps-1" style={{ fontSize: '10px' }}>
                {new Date(event?.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} |{' '}
                {event?.patientName}
            </p>
        )
    }, [])

    // Handle successful appointment creation
    useEffect(() => {
        if (createAppointmentResponse === 201) {
            dispatch(getAppointmentsAction(getAppointmentParams()))
            setShow(false)
        }
    }, [createAppointmentResponse, dispatch, getAppointmentParams])

    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(getAppointmentsAction(getAppointmentParams()))
            setShow(false)
        }
    }, [updateSuccess, dispatch, getAppointmentParams])

    useEffect(() => {
        if (appointmentsList?.length > 0) {
            const transformedEvents = appointmentsList
                .map((data) => {
                    const start = new Date(data.start)
                    const end = new Date(data.end)
                    if (isNaN(start) || isNaN(end)) return null
                    return {
                        event_id: data?._id,
                        title: data?.reason?.[0]?.coding?.[0]?.display,
                        status: data?.status,
                        start: start,
                        end: end,
                        slotStart: data?.start,
                        slotEnd: data?.end,
                        patientName: ((data?.subject?.name?.[0]?.prefix?.[0]
                            ? data?.subject?.name?.[0]?.prefix?.[0] + ' '
                            : '') +
                            (data?.subject?.name?.[0]?.family || '') +
                            (data?.subject?.name?.[0]?.given?.length > 0
                                ? ' ' + data?.subject?.name?.[0]?.given?.join(' ')
                                : '')) || 'N/A'
                    }
                })
                .filter(Boolean)
            setEvents(transformedEvents)
        } else {
            setEvents([])
        }
    }, [appointmentsList]);

    const handleEventClick = useCallback((event) => {
        setShow(true)
        setSelectedEvent(event)
        setSelectedSlot(null)
    }, [])

    const closeModal = useCallback(() => {
        setShow(false)
        setSelectedEvent(null)
        setSelectedSlot(null)
    }, [])

    const handleSlotSelect = useCallback((slotInfo) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const slotDate = new Date(slotInfo.start)
        slotDate.setHours(0, 0, 0, 0)

        if (slotDate < today) {
            ToastHandle('Appointments cannot be created for past dates', 'danger')
        } else {
            setSelectedSlot(slotInfo)
            setSelectedEvent(null)
            setShow(true)
        }
    }, [])

    const handleViewChange = useCallback((view) => {
        setCalendarView(view)
    }, [])

    const CustomToolbar = useCallback((toolbar) => {
        const goToBack = () => {
            const prevMonth = new Date(toolbar?.date)
            prevMonth.setMonth(prevMonth.getMonth() - 1)
            formatMonthYear(prevMonth)
            toolbar.onNavigate('PREV')
        }
        const goToNext = () => {
            const nextMonth = new Date(toolbar?.date)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            formatMonthYear(nextMonth)
            toolbar.onNavigate('NEXT')
        }
        const goToToday = () => {
            const today = new Date()
            formatMonthYear(today)
            toolbar.onNavigate('TODAY')
        }
        const changeView = (view) => {
            toolbar.onView(view)
        }
        return (
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" className="fs-6" onClick={goToBack}>
                        Back
                    </button>
                    <button type="button" className="fs-6" onClick={goToToday}>
                        Today
                    </button>
                    <button type="button" className="fs-6" onClick={goToNext}>
                        Next
                    </button>
                </span>
                <span className="rbc-toolbar-label">{toolbar.label}</span>
                <span className="rbc-btn-group">
                    <button
                        type="button"
                        className={toolbar.view === Views.MONTH ? 'rbc-active fs-6' : 'fs-6'}
                        onClick={() => changeView(Views.MONTH)}>
                        Month
                    </button>
                    <button
                        type="button"
                        className={toolbar.view === Views.WEEK ? 'rbc-active fs-6' : 'fs-6'}
                        onClick={() => changeView(Views.WEEK)}>
                        Week
                    </button>
                    <button
                        type="button"
                        className={toolbar.view === Views.DAY ? 'rbc-active fs-6' : 'fs-6'}
                        onClick={() => changeView(Views.DAY)}>
                        Day
                    </button>
                </span>
            </div>
        )
    }, [formatMonthYear])

    return (
        <div className="background_Color scroll-container" style={{ height: '80vh' }}>
            <div className="container-fluid px-2 mx-0">
                <div className="row">
                    <div className="col px-0 mx-0">
                        <div className="mt-2">
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '82vh' }}
                                selectable
                                onSelectEvent={handleEventClick}
                                onSelectSlot={handleSlotSelect}
                                components={{
                                    event: CustomEvent,
                                    toolbar: CustomToolbar,
                                }}
                                eventPropGetter={memoizedEventStyle}
                                onView={handleViewChange}
                                view={calendarView}
                            />
                            {isLoading && (
                                <div className="loading-overlay">
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Appointment Modal */}
            <Modal centered show={show} size="xl" onHide={closeModal}>
                <Modal.Body>
                    {/* Modal Header */}
                    <Row className="border-bottom mb-1 pb-2">
                        <Col sm={11} className="text-center">
                            <h4>{selectedEvent ? 'Appointment Details' : 'Create New Appointment'}</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                        </Col>
                    </Row>

                    {/* Appointment Form */}
                    <AppointmentForm
                        selectedSlot={selectedSlot}
                        appointmentId={selectedEvent?.event_id}
                        calendarView={calendarView}
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default React.memo(AppointmentCalendar)
