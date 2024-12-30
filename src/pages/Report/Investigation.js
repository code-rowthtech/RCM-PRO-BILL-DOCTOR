import React from 'react';
import { Badge, Table } from 'react-bootstrap';
import { LuFileEdit } from 'react-icons/lu';

const Investigation = () => {
    const patientsData = [
        {
            id: 1,
            user: 'John Doe',
            date: '10-12-2023',
            title: 'Heart Investigation',
            status: 'Completed',
            attachment: true,
        },
        {
            id: 2,
            user: 'Jane Smith',
            date: '11-12-2023',
            title: 'Skin Analysis',
            status: 'Pending',
            attachment: false,
        },
        // Additional entries as needed
    ];

    return (
        <div>
            <Table responsive className="table-centered table-nowrap mb-0">
                <thead className="text-white">
                    <tr>
                        <th className="text-white">Users</th>
                        <th className="text-white">Date</th>
                        <th className="text-white">Title</th>
                        <th className="text-white">Status</th>
                        <th className="text-white">Attachment</th>
                        <th className="text-white">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patientsData.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                <h3 className="my-5">No Data Found</h3>
                            </td>
                        </tr>
                    ) : (
                        patientsData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.user}</td>
                                <td>{data.date}</td>
                                <td>{data.title}</td>
                                <td>
                                    <Badge
                                        bg={data.status === 'Completed' ? 'success' : 'warning'}
                                        className="p-1"
                                    >
                                        {data.status}
                                    </Badge>
                                </td>
                                <td>
                                    {data.attachment ? (
                                        'Download'
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td className='ps-3'>
                                    <LuFileEdit className="fs-4" />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default Investigation;
