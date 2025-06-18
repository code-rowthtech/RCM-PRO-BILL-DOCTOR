import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Table, Spinner, Form, Row, Col } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { createScheduleAction, getScheduleAction, updateScheduleAction } from '../../redux/schedule/actions';
import { encryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { updateSchedule } from '../../helpers/api/apiEndpoints';

// import {
//   createScheduleAction,
//   getDoctorsListAction,
//   getScheduleAction,
// } from "../../../redux/schedule/action";
// import { encryptMessage } from "../../../cryptoUtils";

const ScheduleTab = () => {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [time, setTime] = useState('12:00'); // Ensure a default valid value
    const [name, setName] = useState('');
    const scheduleList = store?.getScheduleReducer?.data?.data || [];
    const scheduleData = store?.getScheduleReducer?.data?.schedule || [];
    const isLoading = store?.getScheduleReducer?.loading;
    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
   
    const doctorName = user?.name?.text;
    const doctorId = user?.doctorId;

    const { control, handleSubmit, setValue, register, reset } = useForm();

    useEffect(() => {
        dispatch(getScheduleAction({ clinicId: user?.clinicId, page: '', limit: '' }));
    }, [dispatch]);

    useEffect(() => {
        if (scheduleData?.length > 0) {
            setValue('perPatientTime', scheduleData?.[0]?.perPatientTime);
            const updatedDays = days.map((day) => {
                const matchingAvailability = scheduleData?.[0]?.availability.find((item) => item?.day === day?.day);
                return {
                    ...day,
                    slots: matchingAvailability?.slots?.map((slot) => ({
                        startTime: formatTo24Hour(slot.startTime) || '',
                        endTime: formatTo24Hour(slot.endTime) || '',
                    })) || [{ startTime: '', endTime: '' }],
                };
            });

            // Only update state if `updatedDays` is different from current `days`
            if (JSON.stringify(updatedDays) !== JSON.stringify(days)) {
                setDays(updatedDays);
            }
        } else {
            reset();
        }
        // Removed `days` from dependency array
    }, [scheduleData, reset]);

    // useEffect(() => {
    //     if (selectedDoctor) {
    //         setValue("perPatientTime", scheduleData?.schedule?.[0]?.perPatientTime || "");

    //         const doctorInfo = JSON.parse(selectedDoctor || "{}");
    //         const filteredScheduleList = scheduleList.filter(
    //             (schedule) => schedule?.doctorId === doctorInfo?.id
    //         );

    //         if (filteredScheduleList.length > 0) {
    //             const firstSchedule = filteredScheduleList[0];
    //             setTime(firstSchedule?.schedule?.perPatientTime || "");
    //             setName(firstSchedule.name || "");

    //             firstSchedule?.availability?.forEach((schedule, index) => {
    //                 setValue(
    //                     `schedules.newSchedule.${index}.availableOn`,
    //                     schedule.availableOn || "Not Available"
    //                 );
    //                 setValue(
    //                     `schedules.newSchedule.${index}.availableFrom`,
    //                     schedule.availableFrom || ""
    //                 );
    //                 setValue(
    //                     `schedules.newSchedule.${index}.availableTo`,
    //                     schedule.availableTo || ""
    //                 );
    //             });
    //         } else {
    //             setTime("");
    //             setName("");

    //             scheduleList.forEach((schedule, index) => {
    //                 setValue(`schedules.newSchedule.${index}.availableOn`, "");
    //                 setValue(`schedules.newSchedule.${index}.availableFrom`, "");
    //                 setValue(`schedules.newSchedule.${index}.availableTo`, "");
    //             });
    //         }
    //     } else {
    //         setTime("");
    //         setName("");
    //         scheduleList.forEach((schedule, index) => {
    //             setValue(`schedules.newSchedule.${index}.availableOn`, "");
    //             setValue(`schedules.newSchedule.${index}.availableFrom`, "");
    //             setValue(`schedules.newSchedule.${index}.availableTo`, "");
    //         });
    //     }
    // }, [selectedDoctor, scheduleList, setValue]);

    // useEffect(() => {
    //     if (selectedDoctor && scheduleList?.availability) {
    //       setValue('perPatientTime', scheduleList?.perPatientTime);
    //       const updatedDays = days.map((day) => {
    //         const matchingAvailability = scheduleList.availability.find(
    //           (item) => item.day === day.day
    //         );
    //         return {
    //           ...day,
    //           slots: matchingAvailability?.slots.map((slot) => ({
    //             startTime: formatTo24Hour(slot.startTime) || "",
    //             endTime: formatTo24Hour(slot.endTime) || "",
    //           })) || [{ startTime: "", endTime: "" }],
    //         };
    //       });

    //       // Only update state if `updatedDays` is different from current `days`
    //       if (JSON.stringify(updatedDays) !== JSON.stringify(days)) {
    //         setDays(updatedDays);
    //       }
    //     } else {
    //       reset();
    //     }
    //     // Removed `days` from dependency array
    //   }, [selectedDoctor, scheduleList, reset]);

    const formatTimeTo12Hour = (time) => {
        if (!time) return null;

        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        let suffix = 'AM';

        if (hours >= 12) {
            suffix = 'PM';
            if (hours > 12) {
                hours = hours - 12; // Convert hours from 24-hour format to 12-hour format
            }
        } else if (hours === 0) {
            hours = 12; // Midnight is represented as 12 AM
        }

        return `${hours}:${minutes} ${suffix}`;
    };

    const formatTo24Hour = (time) => {
        if (!time) return '';

        let [hour, minute] = time.split(':');
        let [minutePart, period] = minute.split(' ');
        hour = parseInt(hour, 10);

        if (period === 'PM' && hour < 12) {
            hour += 12;
        } else if (period === 'AM' && hour === 12) {
            hour = 0; // Midnight case
        }

        return `${String(hour).padStart(2, '0')}:${minutePart}`;
    };

    const onSubmit = (data) => {
        const availability = days.map((day) => ({
            day: day.day,
            slots: day.slots.map((slot) => ({
                startTime: formatTimeTo12Hour(slot.startTime),
                endTime: formatTimeTo12Hour(slot.endTime),
            })),
        }));

        if (scheduleData?.length > 0) {
            const payload = {
                scheduleId: scheduleData?.[0]?._id,
                clinicId: user?.clinicId,
                doctorId: doctorId,
                name: doctorName,
                perPatientTime: data.perPatientTime, // Get value from form data
                availability,
            };
            dispatch(updateScheduleAction({ key: encryptMessage(payload) })); // Send payload directly
        } else {
            const payload = {
                clinicId: user?.clinicId,
                doctorId: doctorId,
                name: doctorName,
                perPatientTime: data.perPatientTime, // Get value from form data
                availability,
            };
            dispatch(createScheduleAction(payload)); // Send payload directly
        }

    };

    const [days, setDays] = useState([
        { day: 'Monday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Tuesday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Wednesday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Thursday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Friday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Saturday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Sunday', slots: [{ startTime: '', endTime: '' }] },
    ]);

    const handleAddSlots = (dayIndex) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            const daySlots = updatedDays[dayIndex].slots;

            // Check for overlapping slots
            const hasOverlap = daySlots.some((slot, idx1) =>
                daySlots.some((slotToCompare, idx2) => {
                    if (idx1 !== idx2) {
                        const start1 = slot.startTime || '';
                        const end1 = slot.endTime || '';
                        const start2 = slotToCompare.startTime || '';
                        const end2 = slotToCompare.endTime || '';
                        return start1 < end2 && start2 < end1;
                    }
                    return false;
                })
            );
            if (hasOverlap) {
                ToastHandle(`Overlapping time ranges detected for day ${updatedDays[dayIndex].day}.`, 'danger');
                return prevDays;
            }

            // Add new slot if no overlaps
            updatedDays[dayIndex].slots = [...daySlots, { startTime: '', endTime: '' }];
            return updatedDays;
        });
    };

    const handleRemoveSlot = (dayIndex, slotIndex) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            if (updatedDays[dayIndex].slots.length > 1) {
                updatedDays[dayIndex].slots = updatedDays[dayIndex].slots.filter((_, idx) => idx !== slotIndex);
            }
            return updatedDays;
        });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h4>Edit Schedule</h4>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label for="doctorName" className="fw-bold mb-0">
                            Doctor Name
                        </Form.Label>
                        <Form.Control type="text" className="text-capitalize" defaultValue={doctorName} />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    {/* Per Patient Time Input */}
                    <Form.Group className="mb-2">
                        <Form.Label htmlFor="perPatientTime" className="fw-bold mb-0">
                            Per Patient Time (in minutes)<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            id="perPatientTime"
                            placeholder="Enter Per Patient Time"
                            {...register('perPatientTime', { required: 'Per Patient Time is required' })}
                            // onChange={(e) => {
                            //     setTime(e.target.value);
                            // }}
                        />
                        {/* {errors.perPatientTime && <span className="text-danger err-font">{errors.perPatientTime.message}</span>} */}
                    </Form.Group>
                </Col>
            </Row>
            <div className="slot-scroll-wrapper">
                <Table striped className="table mt-2">
                    <thead>
                        <tr>
                            <th className="text-white" style={{ width: '50%' }}>
                                Available On
                            </th>
                            <th style={{ width: '50%' }}>
                                <table className="schedule-table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr className="text-white">
                                            <th style={{ width: '33%' }} className="pe-1">
                                                Available From
                                            </th>
                                            <th style={{ width: '33%' }} className="ps-1">
                                                Available To
                                            </th>
                                            <th style={{ width: '33%' }}>Action</th>
                                        </tr>
                                    </thead>
                                </table>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {store?.getPractitionerTimingsReducer?.loading ? (
                            <tr>
                                <td className="text-center" colSpan={2}>
                                    <Spinner />
                                </td>
                            </tr>
                        ) : (
                            days?.map((day, dayIndex) => (
                                <tr key={dayIndex}>
                                    <td>
                                        <input className="form-control" type="text" value={day?.day} readOnly />
                                    </td>
                                    <td>
                                        <table className="schedule-table" style={{ width: '100%' }}>
                                            <tbody>
                                                {day?.slots?.map((slot, slotIndex) => (
                                                    <tr key={slotIndex}>
                                                        <td className="text-black pe-1">
                                                            <input
                                                                className="form-control"
                                                                type="time"
                                                                value={slot.startTime || ''}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setDays((prevDays) => {
                                                                        const updatedDays = [...prevDays];
                                                                        updatedDays[dayIndex].slots[
                                                                            slotIndex
                                                                        ].startTime = value;
                                                                        return updatedDays;
                                                                    });
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="ps-1">
                                                            <input
                                                                className="form-control"
                                                                type="time"
                                                                value={slot.endTime || ''}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setDays((prevDays) => {
                                                                        const updatedDays = [...prevDays];
                                                                        updatedDays[dayIndex].slots[slotIndex].endTime =
                                                                            value;
                                                                        return updatedDays;
                                                                    });
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <span
                                                                className="uil-plus-circle plusicon"
                                                                onClick={() =>
                                                                    handleAddSlots(dayIndex, slotIndex)
                                                                }></span>
                                                            {day.slots.length > 1 && (
                                                                <span
                                                                    className="uil-minus-circle minusicon ms-2"
                                                                    onClick={() =>
                                                                        handleRemoveSlot(dayIndex, slotIndex)
                                                                    }></span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="d-flex justify-content-end mt-2">
                {scheduleData?.length > 0 ? (
                    <Button
                        type="submit"
                        className="custom-buttons"
                        disabled={store?.updateScheduleReducer?.loading}
                        style={{ width: '150px' }}>
                        {store?.updateScheduleReducer?.loading ? (
                            <Spinner className="spinner-border-sm" color="white" />
                        ) : (
                            'Update Schedule'
                        )}
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className="custom-buttons"
                        disabled={store?.createScheduleReducer?.loading}
                        style={{ width: '150px' }}>
                        {store?.createScheduleReducer?.loading ? (
                            <Spinner className="spinner-border-sm" color="white" />
                        ) : (
                            'Save Schedule'
                        )}
                    </Button>
                )}
            </div>
        </Form>
    );
};

export default ScheduleTab;
