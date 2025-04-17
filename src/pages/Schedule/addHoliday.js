import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createHolidayScheduleAction } from '../../redux/schedule/actions';
import { encryptMessage } from '../../cryptoUtils';
import Spinner from '../../constants/Spinner';

const AddHoliday = () => {
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const user = JSON.parse(sessionStorage.getItem('hyper_user'));
    // console.log(user,'user')
    const doctorName = user?.name?.text;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const payload = {
            clinicId: clinic_id,
            type: 'Holiday',
            doctorId: doctorId,
            reason: data.reason,
            fromDate: data.fromDate,
            toDate: data.tillDate,
        };
        // console.log(payload,'payloadddddddd')
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
            <div className="container-fluid mt-2">
                <Card className="px-3 py-2" style={{ height: '85vh' }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD HOLIDAY</p>
                        <div>
                            <Button className="cancel-button fs-6" onClick={() => navigate(-1)}>
                                Back
                            </Button>
                        </div>
                    </div>

                    <div className="px-2">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row pb-4 mt-3">
                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">
                                            Doctor Name<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={doctorName} // Display the doctor name dynamically
                                            readOnly // Prevent manual editing
                                            {...register('doctorInfo', {
                                                // required: "Doctor selection is required",
                                            })}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">
                                            Till Date<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register('tillDate', {
                                                required: 'Till date is required',
                                            })}
                                        />
                                        {errors.tillDate && (
                                            <small className="text-danger">{errors.tillDate.message}</small>
                                        )}
                                    </Form.Group>
                                </div>

                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">
                                            From Date<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register('fromDate', {
                                                required: 'From date is required',
                                            })}
                                        />
                                        {errors.fromDate && (
                                            <small className="text-danger">{errors.fromDate.message}</small>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">
                                            Reason<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Enter Reason"
                                            rows={3}
                                            {...register('reason', {
                                                required: 'Reason is required',
                                            })}
                                        />
                                        {errors.reason && (
                                            <small className="text-danger">{errors.reason.message}</small>
                                        )}
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="d-flex gap-2 justify-content-end mb-2">
                                <Button className="cancel-button fs-6" type="button">
                                    Cancel
                                </Button>
                                <Button
                                    className="custom-buttons fs-6"
                                    disabled={store?.createHolidayScheduleReducer?.loading}
                                    type="submit"
                                    style={{ width: '55px' }}>
                                    {store?.createHolidayScheduleReducer?.loading ? (
                                        <Spinner color="white" className="spinner-border-sm" />
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AddHoliday;
