import React from 'react';
import { Table, Dropdown } from 'react-bootstrap';
import { IoPrintSharp } from "react-icons/io5";
import { TfiSave } from "react-icons/tfi";
import { RiEditLine } from "react-icons/ri";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";

const PrescriptionTable = () => {
    const prescriptionData = [
        {
            id: 1,
            drug: 'Paracetamol',
            frequency: 'Twice a Day',
            duration: '5 Days',
            instruction: 'Take after meals',
            doctor: 'Dr. John Smith',
        },
        {
            id: 2,
            drug: 'Ibuprofen',
            frequency: 'Once a Day',
            duration: '7 Days',
            instruction: 'Take with water',
            doctor: 'Dr. Jane Doe',
        },
        {
            id: 3,
            drug: 'Amoxicillin',
            frequency: 'Three times a Day',
            duration: '10 Days',
            instruction: 'Take before meals',
            doctor: 'Dr. Emily Davis',
        },
        {
            id: 4,
            drug: 'Ciprofloxacin',
            frequency: 'Twice a Day',
            duration: '7 Days',
            instruction: 'Avoid dairy products',
            doctor: 'Dr. Michael Brown',
        },
        {
            id: 5,
            drug: 'Metformin',
            frequency: 'Once a Day',
            duration: '30 Days',
            instruction: 'Take with breakfast',
            doctor: 'Dr. Sarah Wilson',
        },
        {
            id: 6,
            drug: 'Lisinopril',
            frequency: 'Once a Day',
            duration: '60 Days',
            instruction: 'Take in the morning',
            doctor: 'Dr. David Johnson',
        },
        {
            id: 7,
            drug: 'Atorvastatin',
            frequency: 'Once a Night',
            duration: '90 Days',
            instruction: 'Take after dinner',
            doctor: 'Dr. Olivia Garcia',
        },
        {
            id: 8,
            drug: 'Prednisone',
            frequency: 'Twice a Day',
            duration: '10 Days',
            instruction: 'Take with food',
            doctor: 'Dr. William Martinez',
        },
        {
            id: 9,
            drug: 'Losartan',
            frequency: 'Once a Day',
            duration: '30 Days',
            instruction: 'Take at the same time daily',
            doctor: 'Dr. Sophia Anderson',
        },
        {
            id: 10,
            drug: 'Clonazepam',
            frequency: 'Twice a Day',
            duration: '15 Days',
            instruction: 'Avoid alcohol',
            doctor: 'Dr. James Thomas',
        },
    ];

    return (
        <div>
            <Table responsive className="table-centered table-nowrap mb-0">
                <thead className="text-white">
                    <tr>
                        <th className="text-white">#</th>
                        <th className="text-white">Drug</th>
                        <th className="text-white">Frequency</th>
                        <th className="text-white">Duration</th>
                        <th className="text-white">Instruction</th>
                        <th className="text-white">Doctor</th>
                        <th className="text-white">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {prescriptionData.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center">
                                <h3 className="my-5">No Data Found</h3>
                            </td>
                        </tr>
                    ) : (
                        prescriptionData.map((data, index) => (
                            <tr key={data.id}>
                                <td>{index + 1}</td>
                                <td>{data.drug}</td>
                                <td>{data.frequency}</td>
                                <td>{data.duration}</td>
                                <td>{data.instruction}</td>
                                <td>{data.doctor}</td>
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
                                            <hr className='m-0' />
                                            {/* <Dropdown.Item href="#/delete"><TfiSave className='fs-4'/>&nbsp;Delete</Dropdown.Item> */}
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
};

export default PrescriptionTable;
