import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const LabRequestDashboard = ({ onCreateNew, onViewRequest, onEditRequest }) => {
    // Mock data - replace with actual data from API
    const mockRequests = [
        {
            id: 1,
            testName: 'Complete Blood Count (CBC)',
            status: 'pending',
            priority: 'routine',
            orderDate: '2024-01-15',
            collectionDate: '2024-01-16'
        },
        {
            id: 2,
            testName: 'Basic Metabolic Panel (BMP)',
            status: 'completed',
            priority: 'urgent',
            orderDate: '2024-01-10',
            collectionDate: '2024-01-11'
        }
    ];

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            completed: 'success',
            cancelled: 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    return (
        <div>
            {mockRequests.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">No lab requests found</p>
                    <Button onClick={onCreateNew} className="custom-buttons">
                        Create First Lab Order
                    </Button>
                </div>
            ) : (
                <Table responsive className="table-centered table-nowrap mb-0">
                    <thead className="text-white bg-dark">
                        <tr>
                            {["Test Name", "Status", "Priority", "Order Date", "Collection Date", "Actions"]?.map((data, index) => (
                                <th key={index}>{data}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockRequests.map(request => (
                            <tr key={request.id}>
                                <td>{request.testName}</td>
                                <td>{getStatusBadge(request.status)}</td>
                                <td className="text-capitalize">{request.priority}</td>
                                <td>{request.orderDate}</td>
                                <td>{request.collectionDate}</td>
                                <td className='d-flex align-items-center gap-1'>
                                    <i
                                        onClick={() => onViewRequest(request)}
                                        className="bi bi-eye text-info fs-6 cursor-pointer" />
                                    <i
                                        onClick={() => onEditRequest(request)}
                                        className="bi bi-pencil-square text-secondary fs-6 cursor-pointer" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default LabRequestDashboard;