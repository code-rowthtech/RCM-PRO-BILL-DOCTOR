import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Table, Spinner, Form, Row, Col } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createScheduleAction, getScheduleAction } from "../../redux/schedule/actions";
import { encryptMessage } from "../../cryptoUtils";
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
    const [time, setTime] = useState("12:00"); // Ensure a default valid value
    const [name, setName] = useState("");
    const scheduleList = store?.getScheduleReducer?.data?.result || [];
    console.log(store?.getScheduleReducer,'scheduleList')
    const isLoading = store?.getScheduleReducer?.loading;
    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    // console.log(user,'user')
    const doctorName = user?.name?.text;
    const doctorId = user?.doctorId

    const { control, handleSubmit, setValue, register } = useForm();

     useEffect(() => {
        
        dispatch(getScheduleAction({  clinicId: user?.clinicId,page:'',limit:''}));
      }, [dispatch]);
      
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
            clinicId: user?.clinicId,
            doctorId: doctorId,
            name: doctorName,
            perPatientTime: data.perPatientTime, // Get value from form data
            availability,
        };

        dispatch(createScheduleAction({ key: encryptMessage(payload) }));
        console.log(payload, 'createScheduleAction');
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
                        <Form.Label htmlFor="perPatientTime" className="fw-bold mb-0">
                            Per Patient Time (in minutes)<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            id="perPatientTime"
                            placeholder="Enter Per Patient Time"
                            {...register("perPatientTime", { required: "Per Patient Time is required" })}
                            // onChange={(e) => {
                            //     console.log("Selected Time:", e.target.value);
                            //     setTime(e.target.value);
                            // }}
                        />
                        {/* {errors.perPatientTime && <span className="text-danger err-font">{errors.perPatientTime.message}</span>} */}
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
