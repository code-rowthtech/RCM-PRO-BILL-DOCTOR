import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { deleteHolidayScheduleAction, getHolidayScheduleAction } from '../../redux/schedule/actions';
import Spinner from '../../constants/Spinner';

const DoctorHoliday = ({ search }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const scheduleResponse = store?.getHolidayScheduleReducer?.data?.holidays || [];
    const deleteResponse = store?.deleteHolidayScheduleReducer?.data?.status;
    const isLoading = store?.getScheduleReducer?.loading;
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    useEffect(() => {
        const payload = {
            startDate: '',
            endDate: '',
            type: 'Holiday',
            search: '',
            doctorId: doctorId,
        };
        dispatch(
            getHolidayScheduleAction({
                startDate: '',
                endDate: '',
                search: search,
                doctorId: doctorId,
                clinicId: clinicId,
                forAppiontment: false,
            })
        );
    }, [dispatch, search]);

    const deleteHandle = (id) => {
        dispatch(deleteHolidayScheduleAction(id));
        const payload = {
            startDate: '',
            endDate: '',
            type: 'Holiday',
            search: '',
        };
    };
    useEffect(() => {
        if (deleteResponse === 200) {
            dispatch(
                getHolidayScheduleAction({
                    startDate: '',
                    endDate: '',
                    search: search,
                    doctorId: doctorId,
                    clinicId: clinicId,
                    forAppiontment: false,
                })
            );
        }
    }, [deleteResponse]);

    return (
        <div>
            <Table responsive className="table-centered table-nowrap mb-0">
                <thead className="text-white">
                    <tr>
                        <th className="text-white">Sr.No.</th>
                        <th className="text-white">Doctor Name</th>
                        <th className="text-white">Reason</th>
                        <th className="text-white">Date</th>
                        <th className="text-white">Action</th>
                    </tr>
                </thead>
                {store?.getHolidayScheduleReducer?.loading ? (
                    <tr>
                        <td colSpan={5} className="text-center" style={{ height: '65vh' }}>
                            <Spinner />
                        </td>
                    </tr>
                ) : (
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    <Spinner animation="border" role="status" />
                                </td>
                            </tr>
                        ) : scheduleResponse.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    <h3 className="my-5">No Holiday Found</h3>
                                </td>
                            </tr>
                        ) : (
                            scheduleResponse.map((holiday, index) => (
                                <tr key={holiday.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{holiday?.doctorId?.userId?.name?.text}</td>
                                    <td>{holiday.reason ? holiday.reason : 'NAN'}</td>
                                    <td>
                                        <div
                                            className=" py-0 text-white text-center bg-secondary rounded-2"
                                            style={{ width: '100px' }}>
                                            {new Date(holiday.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <RiDeleteBin5Line
                                            onClick={() => deleteHandle(holiday?._id)}
                                            className="fs-4 text-danger ms-2 cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                )}
            </Table>
        </div>
    );
};

export default DoctorHoliday;
