import React from 'react';
import { Table, Dropdown } from 'react-bootstrap';
import { IoPrintSharp } from "react-icons/io5";
import { TfiSave } from "react-icons/tfi";
import { RiEditLine } from "react-icons/ri";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";

const ClinicalNotes = () => {

    const clinicData = [
        { id: 1, name: 'John Doe', age: 29, medicalHistory: 'Hypertension', hobbies: 'Reading, Cycling' },
        { id: 2, name: 'Jane Smith', age: 34, medicalHistory: 'Asthma', hobbies: 'Painting, Cooking' },
        { id: 3, name: 'Emily Davis', age: 45, medicalHistory: 'Diabetes', hobbies: 'Swimming, Gardening' },
        { id: 4, name: 'Michael Brown', age: 50, medicalHistory: 'Arthritis', hobbies: 'Fishing, Hiking' },
        { id: 5, name: 'Sarah Wilson', age: 28, medicalHistory: 'Allergy to Penicillin', hobbies: 'Photography, Travel' },
        { id: 6, name: 'David Johnson', age: 40, medicalHistory: 'Chronic Back Pain', hobbies: 'Cooking, Yoga' },
        { id: 7, name: 'Olivia Garcia', age: 33, medicalHistory: 'Migraine', hobbies: 'Dancing, Writing' },
        { id: 8, name: 'William Martinez', age: 60, medicalHistory: 'Heart Disease', hobbies: 'Golf, Reading' },
        { id: 9, name: 'Sophia Anderson', age: 37, medicalHistory: 'Eczema', hobbies: 'Knitting, Walking' },
        { id: 10, name: 'James Thomas', age: 52, medicalHistory: 'Sleep Apnea', hobbies: 'Chess, Gardening' },
    ];

    return (
        <div>
            <Table responsive className="table-centered table-nowrap mb-0">
                <thead className="text-white">
                    <tr>
                        <th className="text-white">#</th>
                        <th className="text-white">Patient Name</th>
                        <th className="text-white">Age</th>
                        <th className="text-white">Medical History</th>
                        <th className="text-white">Patient / Hobbies</th>
                        <th className="text-white">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {clinicData.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                <h3 className="my-5">No Data Found</h3>
                            </td>
                        </tr>
                    ) : (
                        clinicData.map((data, index) => (
                            <tr key={data.id}>
                                <td>{index + 1}</td>
                                <td>{data.name}</td>
                                <td>{data.age}</td>
                                <td>{data.medicalHistory}</td>
                                <td>{data.hobbies}</td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="light"
                                            id={`dropdown-basic-${index}`}
                                            className="p-0"
                                            style={{ border: 'none', background: 'none' }}
                                        >
                                            <IoPrintSharp className="fs-4" />
                                            &nbsp;Print
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu align="end" style={{ transform: 'translateX(-100%)' }}>
                                            <Dropdown.Item href="#/save-template">
                                                <TfiSave className='fs-4' />&nbsp; Save as Template
                                            </Dropdown.Item>
                                            <hr className='m-0' />
                                            <Dropdown.Item href="#/edit"><RiEditLine className='fs-4' />&nbsp;Edit</Dropdown.Item>
                                            {/* <Dropdown.Item href="#/delete"><RiDeleteBin7Line className='fs-4' />&nbsp;Delete</Dropdown.Item> */}
                                            <hr className='m-0' />
                                            <Dropdown.Item href="#/email"><MdOutlineMailOutline className='fs-4' />&nbsp;Email</Dropdown.Item>
                                            <Dropdown.Item href="#/previous"><MdSkipPrevious className='fs-4' />&nbsp;Previous</Dropdown.Item>
                                            <Dropdown.Item href="#/dot-matrix-print">
                                                <IoPrintSharp className='fs-4' />&nbsp; Dot Matrix Print
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/print-settings">
                                                <IoSettingsOutline className='fs-4' />&nbsp; Print Settings
                                            </Dropdown.Item>
                                            <hr className='m-0' />
                                            <Dropdown.Item href="#/view-patient-timeline">
                                                <FaEye className='fs-4' />&nbsp;View
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default ClinicalNotes;
