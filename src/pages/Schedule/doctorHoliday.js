import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { getHolidayScheduleAction } from '../../redux/schedule/actions';
import Spinner from '../../constants/Spinner';
const DoctorHoliday = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const scheduleResponse = store?.getHolidayScheduleReducer?.data?.result || [];
  // console.log(scheduleResponse, 'iddd')
  const isLoading = store?.getScheduleReducer?.loading;
  const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;


  useEffect(() => {
    const payload = {
      startDate: '',
      endDate: '',
      type: "Holiday",
      search: '',
      doctorId: doctorId
    };
    dispatch(getHolidayScheduleAction({ startDate: '', endDate: '', type: 'Holiday', search: '', doctorId: doctorId }));
  }, [dispatch]);


  const deleteHandle = (id) => {
    // dispatch(deleteScheduleAction(id))
    const payload = {
      startDate: '',
      endDate: '',
      type: "Holiday",
      search: ''
    };
    // dispatch(getScheduleAction(payload));
  }
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
            <td
              className='text-center'
              colSpan={5}
            style={{ height: '65vh' }}
            >
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
                  <td>{holiday.name}</td>
                  <td>{holiday.reason ? holiday.reason : 'NAN'}</td>
                  <td>
                    <div className=" py-1 text-white text-center bg-secondary rounded-2" style={{ width: '100px' }}>
                      {new Date(holiday.fromDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <RiDeleteBin5Line onClick={() => deleteHandle(holiday?._id)} className="fs-4 text-danger ms-2 cursor-pointer" />
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
