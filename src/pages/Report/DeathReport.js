import React from 'react'
import { Badge, Table } from 'react-bootstrap'
// import { LuFileEdit } from 'react-icons/lu'

const DeathReport = () => {

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
                        <th className='text-white'>Date</th>
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
                                <td><Badge className='p-1'>{data.createdOn}</Badge></td>
                                <td className='ps-3'>
                                    {/* <LuFileEdit className="fs-4" />&nbsp; */}
                                    {/* <LuFileText className="fs-4" /> */}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default DeathReport