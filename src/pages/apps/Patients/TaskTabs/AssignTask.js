import React, { useState, useRef, useEffect } from 'react';
import { Table, Row, Col, Button } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { IoFilter } from "react-icons/io5";
import { FormInput } from '../../../../components';
import { getTaskAction } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';

const AssignTask = () => {
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const taskData = store?.getTaskReducer?.data?.tasks || [];
    console.log(taskData, 'taskData')
    const dropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const priorityDropdownRef = useRef(null);
    const addTaskResponse = store?.createTaskReducer?.data?.status;
    console.log({ addTaskResponse })

    const toggleDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    const toggleCategoryDropdown = () => {
        setShowCategoryDropdown(!showCategoryDropdown);
    };

    const toggleStatusDropdown = () => {
        setShowStatusDropdown(!showStatusDropdown);
    };

    const togglePriorityDropdown = () => {
        setShowPriorityDropdown(!showPriorityDropdown);
    };

    useEffect(() => {
        const data = {
            assignedToId: '',
            taskStatus: selectedStatus,
            priority: '',
            sortBy: '',
        }

        dispatch(getTaskAction(data));

    }, [dispatch, selectedStatus]);
    useEffect(() => {
        const data = {
            assignedToId: '',
            taskStatus: selectedStatus,
            priority: '',
            sortBy: '',
        }
        if (addTaskResponse === 200) {

            dispatch(getTaskAction(data));
        }

    }, [addTaskResponse]);

    // Close dropdowns if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target))
            ) {
                setShowStatusDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (dropdownRef.current && !dropdownRef.current.contains(event.target))
            ) {
                setShowFilterDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target))
            ) {
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target))
            ) {
                setShowPriorityDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case "In Progress":
                return { backgroundColor: "#88D9EB", color: "#05668D" }; // Light Blue BG, Dark Blue Text
            case "On Hold":
                return { backgroundColor: "#FDF88A", color: "#A68A00" }; // Light Yellow BG, Dark Yellow Text
            case "Complete":
                return { backgroundColor: "#C0FF7F", color: "#3A7600" }; // Light Green BG, Dark Green Text
            case "Open":
                return { backgroundColor: "#BEBDB7", color: "#4F4E4C" }; // Light Gray BG, Dark Gray Text
            default:
                return { backgroundColor: "#f8f9fa", color: "#000000" }; // Default Light Gray BG, Black Text
        }
    };


    const getPriorityStyles = (priority) => {
        switch (priority) {
            case "Low":
                return { backgroundColor: "#88D9EB", color: "#05668D" }; // Light Blue BG, Dark Blue Text
            case "Medium":
                return { backgroundColor: "#FDF88A", color: "#A68A00" }; // Light Yellow BG, Dark Yellow Text
            case "High":
                return { backgroundColor: "#FFB8B8", color: "red" };
            default:
                return { backgroundColor: "#f8f9fa", color: "#000000" }; // Default Light Gray BG, Black Text
        }
    };


    return (
        <div className="position-relative">
            <Row>
                <Col>
                    <Table responsive className="table-centered table-nowrap mb-0">
                        <thead className="text-white bg-dark">
                            <tr>
                                <th className='text-white'>Associated Patient</th>
                                <th className='text-white'>Title</th>
                                <th className="text-white">Assigned by</th>
                                <th className='text-white'>Assigned to<IoFilter className="fs-4 ms-2 cursor-pointer" onClick={toggleDropdown} /></th>
                                <th className='text-white'>
                                    Status
                                    <IoFilter className='fs-4 ms-2 cursor-pointer' onClick={toggleStatusDropdown} />
                                </th>
                                <th className='text-white'>Category <IoFilter className='fs-4' onClick={toggleCategoryDropdown} /></th>
                                <th className='text-white'>Priority <IoFilter className='fs-4' onClick={togglePriorityDropdown} /></th>
                                <th className='text-white'>Start Date</th>
                                <th className='text-white'>Due Date</th>
                                <th className='text-white'>Action</th>
                            </tr>
                        </thead>
                        {store?.getTaskReducer?.loading ? (
                            <tr>
                                <td className='text-center' colSpan={10}>
                                    <Spinner className=" my-5 " />
                                </td>
                            </tr>
                        ) : (
                            <tbody>
                                {taskData.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className='text-center'>
                                            <h3 className='my-5'>No Tasks Found!</h3>
                                        </td>
                                    </tr>
                                ) : (
                                    taskData.map((task, index) => (
                                        <tr key={index}>
                                            <td className='text-capitalize'>{task?.associatedPatientId?.firstName} {task?.associatedPatientId?.lastName}</td>
                                            <td className='text-capitalize'>{task?.taskTitle}</td>
                                            <td className='text-capitalize'>{task?.assignedById?.firstName} {task?.assignedById?.lastName}</td>
                                            <td className='text-capitalize'>{task?.assignedToId?.firstName} {task?.assignedToId?.lastName || ' '}</td>
                                            {/* <td>
                                                <span className="badge d-flex align-items-center justify-content-center" style={{ backgroundColor: getStatusColor(task?.taskStatus), color: "#fff", width: '5vw', height: '2vh' }}>
                                                    {task?.taskStatus}
                                                </span>
                                            </td> */}
                                            <td>
                                                <span
                                                    className="badge d-flex justify-content-center align-items-center"
                                                    style={{
                                                        ...getStatusStyles(task?.taskStatus), // Spreads existing styles
                                                        width: "5vw", // Sets width to 5% of viewport width
                                                        height: "2vh", // Sets height to 2% of viewport height
                                                    }}
                                                >
                                                    {task?.taskStatus}
                                                </span>
                                            </td>



                                            <td>{task?.category}</td>
                                            <td>
                                                <span
                                                    className="badge d-flex justify-content-center align-items-center"
                                                    style={{
                                                        ...getPriorityStyles(task?.priority), // Apply existing styles
                                                        width: "5vw", // Viewport width for responsiveness
                                                        height: "2vh", // Viewport height
                                                    }}
                                                >
                                                    {task?.priority}
                                                </span>
                                            </td>

                                            <td>{task?.startDate ? new Date(task.startDate).toLocaleDateString("en-GB") : "N/A"}</td>
                                            <td>{task?.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB") : "N/A"}</td>
                                            <td>
                                                {/* <Link to={`/edit-task/${index}`}> */}
                                                <FiEdit className="fs-4 ms-2 cursor-pointer text-black" />
                                                {/* </Link> */}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        )}
                    </Table>
                </Col>
            </Row>

            {/* Assigned To Filter Dropdown */}
            {showFilterDropdown && (
                <div
                    ref={dropdownRef}
                    className="position-absolute bg-white border p-1 rounded shadow-sm"
                    style={{ top: "2vw", left: "21vw", zIndex: 10, width: '200px' }}
                >
                    <FormInput type="text" placeholder="Search..." />
                    <p className='mb-0 fs-6 text-primary mt-1'>Select All</p>
                    <div className="form-check mt-1 d-flex justify-content-between ps-0 align-items-center">
                        <label className="form-check-label fs-6" htmlFor="all">All</label>
                        <input className="form-check-input bg-primary" type="checkbox" id="all" />
                    </div>
                    <div className="form-check mt-1 d-flex justify-content-between ps-0 align-items-center">
                        <label className="form-check-label fs-6" htmlFor="dr-smith">Dr. Smith</label>
                        <input className="form-check-input bg-primary" type="checkbox" id="dr-smith" />
                    </div>
                    <div className="form-check mt-1 d-flex justify-content-between ps-0 align-items-center">
                        <label className="form-check-label fs-6" htmlFor="dr-brown">Dr. Brown</label>
                        <input className="form-check-input bg-primary" type="checkbox" id="dr-brown" />
                    </div>
                    <div className='d-flex justify-content-end gap-1 mt-2'>
                        <Button className='custom-buttons fs-6'>Cancel</Button>
                        <Button className='custom-buttons fs-6'>Search</Button>
                    </div>
                </div>
            )}
            {/* Category Dropdown */}
            {showCategoryDropdown && (
                <div
                    ref={categoryDropdownRef}
                    className="position-absolute bg-white border p-1 rounded shadow-sm"
                    style={{ top: "2vw", left: "36vw", zIndex: 10, width: '200px' }}
                >
                    <FormInput type="text" placeholder="Search..." />
                    <p className='mb-0 fs-6 text-primary mt-1'>Select All</p>
                    <div className="form-check mt-1 d-flex justify-content-between ps-0 align-items-center">
                        <label className="form-check-label fs-6" htmlFor="all">All</label>
                        <input className="form-check-input bg-primary" type="checkbox" id="all" />
                    </div>
                    <div className="form-check mt-1 d-flex justify-content-between ps-0 align-items-center">
                        <label className="form-check-label fs-6" htmlFor="dr-smith">Lab Result</label>
                        <input className="form-check-input bg-primary" type="checkbox" id="dr-smith" />
                    </div>

                    <div className='d-flex justify-content-end gap-1 mt-2'>
                        <Button className='custom-buttons fs-6'>Cancel</Button>
                        <Button className='custom-buttons fs-6'>Search</Button>
                    </div>
                </div>
            )}

            {/* Status Filter Dropdown */}
            {showStatusDropdown && (
                <div
                    ref={statusDropdownRef}
                    className="position-absolute bg-white border p-1 rounded shadow-sm"
                    style={{ top: "2vw", left: "32vw", zIndex: 10, width: '150px' }}
                >
                    {['All', "Open", "In Progress", "Hold", "Complete"].map((status) => (
                        <div
                            key={status}
                            className="p-1 cursor-pointer rounded"
                            style={{ transition: "background 0.3s", cursor: "pointer" }}
                            onClick={() => {
                                console.log("Selected Status:", status);
                                setShowStatusDropdown(false);
                                if (status === 'All') {
                                    setSelectedStatus('')
                                } else {
                                    setSelectedStatus(status)
                                }

                            }}
                            onMouseEnter={(e) => e.target.style.background = "#EFEFEF"}
                            onMouseLeave={(e) => e.target.style.background = "transparent"}
                        >
                            {status}
                        </div>
                    ))}
                </div>
            )}
            {/* Priority Filter Dropdown */}
            {showPriorityDropdown && (
                <div
                    ref={priorityDropdownRef}
                    className="position-absolute bg-white border p-1 rounded shadow-sm"
                    style={{ top: "2vw", left: "45vw", zIndex: 10, width: '150px' }}
                >
                    {["All", "Low", "Medium", "High"].map((priority) => (
                        <div
                            key={priority}
                            className="p-1 cursor-pointer rounded"
                            style={{ transition: "background 0.3s", cursor: "pointer" }}
                            onClick={() => {
                                setShowPriorityDropdown(false);
                            }}
                            onMouseEnter={(e) => e.target.style.background = "#EFEFEF"}
                            onMouseLeave={(e) => e.target.style.background = "transparent"}
                        >
                            {priority}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignTask;
