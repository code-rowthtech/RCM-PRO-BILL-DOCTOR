import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Table, Spinner, Form, Row, Col } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
// import {
//   createScheduleAction,
//   getDoctorsListAction,
//   getScheduleAction,
// } from "../../../redux/schedule/action";
// import { encryptMessage } from "../../../cryptoUtils";

const ScheduleTab = () => {
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [time, setTime] = useState("");
    const [name, setName] = useState("");
    const scheduleList = store?.getScheduleReducer?.data?.result || [];
    const isLoading = store?.getScheduleReducer?.loading;
    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    // console.log(user,'user')
    const doctorName = user?.name?.text;

    const { control, handleSubmit, setValue, register } = useForm();

    useEffect(() => {
        if (selectedDoctor) {
            const doctorInfo = JSON.parse(selectedDoctor || "{}");
            const filteredScheduleList = scheduleList.filter(
                (schedule) => schedule?.doctorId === doctorInfo?.id
            );

            if (filteredScheduleList.length > 0) {
                const firstSchedule = filteredScheduleList[0];
                setTime(firstSchedule.perPatientTime || "");
                setName(firstSchedule.name || "");

                firstSchedule?.availability?.forEach((schedule, index) => {
                    setValue(
                        `schedules.newSchedule.${index}.availableOn`,
                        schedule.availableOn || "Not Available"
                    );
                    setValue(
                        `schedules.newSchedule.${index}.availableFrom`,
                        schedule.availableFrom || ""
                    );
                    setValue(
                        `schedules.newSchedule.${index}.availableTo`,
                        schedule.availableTo || ""
                    );
                });
            } else {
                setTime("");
                setName("");

                scheduleList.forEach((schedule, index) => {
                    setValue(`schedules.newSchedule.${index}.availableOn`, "");
                    setValue(`schedules.newSchedule.${index}.availableFrom`, "");
                    setValue(`schedules.newSchedule.${index}.availableTo`, "");
                });
            }
        } else {
            setTime("");
            setName("");
            scheduleList.forEach((schedule, index) => {
                setValue(`schedules.newSchedule.${index}.availableOn`, "");
                setValue(`schedules.newSchedule.${index}.availableFrom`, "");
                setValue(`schedules.newSchedule.${index}.availableTo`, "");
            });
        }
    }, [selectedDoctor, scheduleList, setValue]);

    const formatTime = (time) => {
        if (!time) return null;
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}:00`;
    };

    const onSubmit = (data) => {
        const doctorInfo = JSON.parse(selectedDoctor || "{}");
        const availability = days.map((day, index) => ({
            availableOn: day.day,
            availableFrom:
                formatTime(data.schedules?.newSchedule?.[index]?.availableFrom) ||
                "00:00:00",
            availableTo:
                formatTime(data.schedules?.newSchedule?.[index]?.availableTo) ||
                "00:00:00",
        }));

        const payload = {
            doctorId: doctorInfo.id,
            type: "Schedule",
            name: doctorInfo.name,
            perPatientTime: time,
            availability,
        };

        // dispatch(createScheduleAction({ key: encryptMessage(payload) }));
        console.log({ payload });

        // dispatch(
        //   getScheduleAction({
        //     type: "Schedule",
        //     search: "",
        //     startDate: "",
        //     endDate: "",
        //   })
        // );
    };

    const days = [
        { day: "Monday" },
        { day: "Tuesday" },
        { day: "Wednesday" },
        { day: "Thursday" },
        { day: "Friday" },
        { day: "Saturday" },
        { day: "Sunday" },
    ];

    const renderEmptyScheduleData = () => {
        return (
            <>
                {days.map((day, index) => (
                    <tr key={index}>
                        <td>
                            <input
                                type="text"
                                {...register(`schedules.newSchedule.${index}.availableOn`)}
                                className="form-control"
                                defaultValue={day.day}
                            />
                        </td>
                        <td>
                            <Controller
                                name={`schedules.newSchedule.${index}.availableFrom`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <input
                                        type="time"
                                        className="form-control"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                )}
                            />
                        </td>
                        <td>
                            <Controller
                                name={`schedules.newSchedule.${index}.availableTo`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <input type="time" className="form-control" {...field} />
                                )}
                            />
                        </td>
                        <td className="text-center">
                            <FiEdit className="fs-4 ms-2" />
                        </td>
                    </tr>
                ))}
            </>
        );
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
                        <Form.Control
                            type="text"
                            defaultValue={doctorName}
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    {/* Per Patient Time Input */}
                    <Form.Group className="mb-2">
                        <Form.Label for="perPatientTime" className="fw-bold mb-0">
                            Per Patient Time<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="time"
                            id="perPatientTime"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </Form.Group>
                </Col>

            </Row>

            <Table striped bordered hover>
                <thead>

                    <th className="py-2 ps-2">Available On</th>
                    <th className="py-2">Available From</th>
                    <th className="py-2">Available To</th>
                    <th className="py-2">Action</th>

                </thead>
                <tbody>{renderEmptyScheduleData()}</tbody>
            </Table>
            <div className="d-flex justify-content-end">
                <Button type="submit" className="custom-buttons">
                    Save Schedule
                </Button>
                {isLoading && <Spinner animation="border" />}
            </div>
        </Form>
    );
};

export default ScheduleTab;
