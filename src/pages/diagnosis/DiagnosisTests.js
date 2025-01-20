import React from 'react'
import { Badge, Table } from 'react-bootstrap';
import { LuFileText } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const DiagnosisTests = () => {

    const patientsData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            doctor: 'Dr. Smith',
            diagnosisCategory: 'Cardiology',
            createdOn: '10-12-2023',
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            doctor: 'Dr. Brown',
            diagnosisCategory: 'Dermatology',
            createdOn: '11-12-2023',
        },
        // Additional entries as needed
    ];

    return (
        <div>
            <Table responsive className="table-centered table-nowrap mb-0">
                <thead className="text-white">
                    <tr>
                        <th className='text-white'>Case Id</th>
                        <th className='text-white'>Patients Name</th>
                        <th className='text-white'>Doctor</th>
                        <th className='text-white'>Diagnosis Category</th>
                        <th className='text-white'>Created on</th>
                        <th className='text-white'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patientsData.length === 0 ? (
                        <tr>
                            <td colSpan={7} className='text-center'>
                                <h3 className='my-5'>No Data Found</h3>
                            </td>
                        </tr>
                    ) : (
                        patientsData.map((data, index) => (
                            <tr key={index}>
                                <td>Nwf{index + 1}</td>
                                <td className="text-capitalize">
                                    {data.firstName} {data.lastName}
                                </td>
                                <td>{data.doctor}</td>
                                <td>{data.diagnosisCategory}</td>
                                <td><Badge className='p-1'>{data.createdOn}</Badge></td>
                                <td className='ps-3'>
                                    <Link to='#' className="action-icon">
                                        <i className="mdi mdi-square-edit-outline cursor-pointer fs-4"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default DiagnosisTests