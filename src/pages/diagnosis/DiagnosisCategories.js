import React from 'react'
import { Table } from 'react-bootstrap';
import { LuFileText } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const DiagnosisCategories = () => {

    const patientsData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 35,
            gender: 'Male',
            amount: '$200',
            appointmentDate: '2023-11-10',
            status: 'Confirmed',
            insuranceProvider: 'HealthCare Inc.',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            }
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            age: 29,
            gender: 'Female',
            amount: '$150',
            appointmentDate: '2023-11-12',
            status: 'Pending',
            insuranceProvider: 'MediSure',
            email: 'jane.smith@example.com',
            phone: '555-789-1234',
            address: {
                street: '456 Elm St',
                city: 'Greenwood',
                state: 'CA',
                zipCode: '90210'
            }
        },
        // Additional entries as needed
    ];

    return (
        <div>
            <Table responsive className="table-centered table-nowrap mb-0">
                <thead className="text-white">
                    <tr>
                        <th className='text-white ps-4'>Diagnosis Category</th>
                        <th className='text-white text-end pe-5'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patientsData.length === 0 ? (
                        <tr>
                            <td colSpan={4} className='text-center'>
                                <h3 className='my-5'>No Data Found</h3>
                            </td>
                        </tr>
                    ) : (
                        patientsData.map((data, index) => (
                            <tr key={index}>
                                <td className='ps-4'>{data?.firstName}</td>
                                <td className=' text-end pe-5'>
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

export default DiagnosisCategories