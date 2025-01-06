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

const TreatmentPlans = () => {
  const prescriptionData = [
    {
      id: 1,
      treatment: 'Paracetamol Plan',
      cost: 500,
      discount: 50,
      total: 450,
      doctor: 'Dr. John Smith',
    },
    {
      id: 2,
      treatment: 'Ibuprofen Plan',
      cost: 700,
      discount: 70,
      total: 630,
      doctor: 'Dr. Jane Doe',
    },
    {
      id: 3,
      treatment: 'Amoxicillin Plan',
      cost: 1000,
      discount: 150,
      total: 850,
      doctor: 'Dr. Emily Davis',
    },
    {
      id: 4,
      treatment: 'Ciprofloxacin Plan',
      cost: 800,
      discount: 80,
      total: 720,
      doctor: 'Dr. Michael Brown',
    },
    {
      id: 5,
      treatment: 'Metformin Plan',
      cost: 600,
      discount: 60,
      total: 540,
      doctor: 'Dr. Sarah Wilson',
    },
    {
      id: 6,
      treatment: 'Lisinopril Plan',
      cost: 1200,
      discount: 200,
      total: 1000,
      doctor: 'Dr. David Johnson',
    },
    {
      id: 7,
      treatment: 'Atorvastatin Plan',
      cost: 1500,
      discount: 250,
      total: 1250,
      doctor: 'Dr. Olivia Garcia',
    },
    {
      id: 8,
      treatment: 'Prednisone Plan',
      cost: 1100,
      discount: 100,
      total: 1000,
      doctor: 'Dr. William Martinez',
    },
    {
      id: 9,
      treatment: 'Losartan Plan',
      cost: 900,
      discount: 90,
      total: 810,
      doctor: 'Dr. Sophia Anderson',
    },
    {
      id: 10,
      treatment: 'Clonazepam Plan',
      cost: 1300,
      discount: 200,
      total: 1100,
      doctor: 'Dr. James Thomas',
    },
  ];

  return (
    <div>
      <Table responsive className="table-centered table-nowrap mb-0">
        <thead className="text-white">
          <tr>
            <th className="text-white">#</th>
            <th className="text-white">Treatment Plans</th>
            <th className="text-white">Cost (INR)</th>
            <th className="text-white">Discount (INR)</th>
            <th className="text-white">Total (INR)</th>
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
                <td>{data.treatment}</td>
                <td>{data.cost}</td>
                <td>{data.discount}</td>
                <td>{data.total}</td>
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
                      <Dropdown.Item href="#/edit"><RiEditLine className='fs-4' />&nbsp;Edit</Dropdown.Item>
                      <Dropdown.Item href="#/delete"><RiDeleteBin7Line className='fs-4' />&nbsp;Delete</Dropdown.Item>
                      <hr className='m-0' />
                      {/* <Dropdown.Item href="#/delete"><TfiSave className='fs-4'/>&nbsp;Delete</Dropdown.Item> */}
                      <Dropdown.Item href="#/email"><MdOutlineMailOutline className='fs-4' />&nbsp;Email</Dropdown.Item>
                      <Dropdown.Item href="#/previous"><IoPrintSharp className='fs-4' />&nbsp;Customize Print</Dropdown.Item>
                      <Dropdown.Item href="#/dot-matrix-print">
                        <IoPrintSharp className='fs-4' />&nbsp; Dot Matrix Print
                      </Dropdown.Item>
                      <Dropdown.Item href="#/print-settings">
                        <IoSettingsOutline className='fs-4' />&nbsp; Print Settings
                      </Dropdown.Item>
                      <hr className='m-0' />
                      <Dropdown.Item href="#/view-patient-timeline">
                        <FaEye className='fs-4' />&nbsp;View Patient Timeline
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>)
}

export default TreatmentPlans;