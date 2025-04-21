import React, { useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createHolidayScheduleAction } from "../../redux/schedule/actions";
import { encryptMessage } from "../../cryptoUtils";
import Spinner from "../../constants/Spinner";

const AddBreak = () => {
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = JSON.parse(sessionStorage.getItem("hyper_user")) || {};
    const clinic_id = user?.clinicId || "";
    const doctorName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const formatTime = (time) => `${time}:00`;

    const onSubmit = (data) => {
        const payload = {
            clinicId: clinic_id,
            type: "Break",
            name: doctorName,
            breakDay: data.breakDay,
            breakFrom: formatTime(data.breakFrom),
            breakTo: formatTime(data.breakTo),
        };
        dispatch(createHolidayScheduleAction({ key: encryptMessage(payload) }));
    };

    const createResponse = store?.createHolidayScheduleReducer?.data?.status;

    useEffect(() => {
        if (createResponse === 200) {
            reset();
        }
    }, [createResponse]);

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2" style={{ height: "85vh" }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD BREAK</p>
                        <Button onClick={() => navigate(-1)}>Back</Button>
                    </div>
                    <div className="px-2">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row pb-4 mt-3">
                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Doctor Name<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={doctorName}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group className="mt-4">
                                        <Form.Label>
                                            From<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="time"
                                            {...register("breakFrom", { required: "Start time is required" })}
                                        />
                                        {errors.breakFrom && (
                                            <p className="text-danger">{errors.breakFrom.message}</p>
                                        )}
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-3 mt-4 pb-1">
                                        <div className="d-flex gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Every Day"
                                                value="EveryDay"
                                                {...register("breakDay", { required: "Break day is required" })}
                                            />
                                            <div className="d-flex">
                                                <Form.Check
                                                    type="radio"
                                                    label="Break Day"
                                                    value="BreakDay"
                                                    {...register("breakDay")}
                                                />
                                                <Form.Select
                                                    className="border-0 w-25"
                                                    {...register("breakDay", {
                                                        required: "Break day selection is required",
                                                    })}
                                                >
                                                    <option value="">Select a Day</option>
                                                    <option value="Sunday">Sunday</option>
                                                    <option value="Monday">Monday</option>
                                                    <option value="Tuesday">Tuesday</option>
                                                    <option value="Wednesday">Wednesday</option>
                                                    <option value="Thursday">Thursday</option>
                                                    <option value="Friday">Friday</option>
                                                    <option value="Saturday">Saturday</option>
                                                </Form.Select>
                                            </div>
                                        </div>
                                        {errors.breakDay && (
                                            <p className="text-danger">{errors.breakDay.message}</p>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            To<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="time"
                                            {...register("breakTo", {
                                                required: "End time is required",
                                                validate: (value) =>
                                                    value > watch("breakFrom") ||
                                                    "End time must be after start time",
                                            })}
                                        />
                                        {errors.breakTo && (
                                            <p className="text-danger">{errors.breakTo.message}</p>
                                        )}
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => reset()}>
                                    Cancel
                                </Button>
                                <Button variant="primary" disabled={store?.createHolidayScheduleReducer?.loading} type="submit">
                                    {
                                        store?.createHolidayScheduleReducer?.loading ?
                                            <Spinner color="white" className="spinner-border-sm" />
                                            :
                                            'Save'
                                    }
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AddBreak;
