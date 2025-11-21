import React, { useState } from 'react';
import { Card, Row, Col, Button, Badge, Alert, Table, Accordion, ProgressBar } from 'react-bootstrap';
import { FiClock, FiUser, FiCalendar, FiFileText, FiActivity, FiPrinter, FiEdit3, FiX } from 'react-icons/fi';

const LabRequestDetails = ({ request, patientDetails, onEdit, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getStatusBadge = (status) => {
        const variants = {
            draft: 'secondary',
            active: 'primary',
            completed: 'success',
            revoked: 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status?.toUpperCase()}</Badge>;
    };

    const getPriorityBadge = (priority) => {
        const variants = {
            routine: 'success',
            urgent: 'warning',
            stat: 'danger'
        };
        return <Badge bg={variants[priority] || 'secondary'}>{priority?.toUpperCase()}</Badge>;
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this lab request?')) return;
        setLoading(true);
        setError('');
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onBack();
        } catch (err) {
            setError(err.message || 'Failed to cancel lab request');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'Not specified';
        return new Date(dateTime).toLocaleString();
    };

    const statusTimeline = [
        { status: 'draft', date: request.authoredOn, label: 'Order Created' },
        { status: 'active', date: request.status === 'active' ? request.authoredOn : null, label: 'Order Submitted' },
        { status: 'completed', date: request.status === 'completed' ? new Date().toISOString() : null, label: 'Specimen Collected' },
        { status: 'resulted', date: null, label: 'Results Available' }
    ];

    const getProgressPercentage = () => {
        const completedSteps = statusTimeline.filter(item => item.date).length;
        return (completedSteps / statusTimeline.length) * 100;
    };

    return (
        <div className="lab-request-details">
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            {/* Header Summary Card */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h4 className="mb-1 text-primary">Lab Request Details</h4>
                            <p className="text-muted mb-0">Order ID: <Badge bg="secondary">{request.id}</Badge></p>
                        </div>
                        <div className="d-flex gap-2">
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                        </div>
                    </div>
                    <div className="progress-section mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Order Progress</small>
                            <small className="text-muted">{Math.round(getProgressPercentage())}% Complete</small>
                        </div>
                        <ProgressBar
                            now={getProgressPercentage()}
                            variant={request.status === 'completed' ? 'success' : 'primary'}
                            style={{ height: '8px' }}
                        />
                    </div>
                    <Row className="g-3">
                        <Col md={3}>
                            <div className="info-item">
                                <FiUser className="text-primary me-2" />
                                <div>
                                    <small className="text-muted d-block">Patient</small>
                                    <strong>{patientDetails?.name?.[0]?.family}, {patientDetails?.name?.[0]?.given?.join(' ')}</strong>
                                </div>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="info-item">
                                <FiCalendar className="text-primary me-2" />
                                <div>
                                    <small className="text-muted d-block">Order Date</small>
                                    <strong>{formatDateTime(request?.authoredOn)}</strong>
                                </div>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="info-item">
                                <FiUser className="text-primary me-2" />
                                <div>
                                    <small className="text-muted d-block">Provider</small>
                                    <strong>{request?.requester?.display || 'Current Provider'}</strong>
                                </div>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="info-item">
                                <FiFileText className="text-primary me-2" />
                                <div>
                                    <small className="text-muted d-block">MRN</small>
                                    <strong>{patientDetails?.identifier?.[0]?.value}</strong>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Accordion Sections */}
            <Accordion defaultActiveKey={['0', '1']} alwaysOpen className="lab-accordion">
                {/* Requested Tests */}
                <Accordion.Item eventKey="0" className="mb-3 border-0 shadow-sm">
                    <Accordion.Header className="custom-accordion-header">
                        <div className="d-flex align-items-center">
                            <FiActivity className="text-primary me-2" />
                            <strong>Requested Tests</strong>
                            <Badge bg="info" className="ms-2">1 Test</Badge>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-0">
                        <Table responsive className="table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    {["Test Name", "LOINC Code", "Priority", "Status"]?.map((headers, i) => (
                                        <th className="border-0 py-3" key={i}>{headers}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-3">
                                        <strong>{request.code?.coding?.[0]?.display}</strong>
                                    </td>
                                    <td className="py-3">
                                        <Badge bg="secondary">{request.code?.coding?.[0]?.code}</Badge>
                                    </td>
                                    <td className="py-3">{getPriorityBadge(request.priority)}</td>
                                    <td className="py-3">{getStatusBadge(request.status)}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Clinical Information */}
                <Accordion.Item eventKey="1" className="mb-3 border-0 shadow-sm">
                    <Accordion.Header className="custom-accordion-header">
                        <div className="d-flex align-items-center">
                            <FiFileText className="text-success me-2" />
                            <strong>Clinical Information</strong>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-4">
                        <Row className="g-4">
                            <Col md={6}>
                                <div className="clinical-info-card">
                                    <h6 className="text-muted mb-2">Reason for Test</h6>
                                    <p className="mb-0">{request.reasonCode?.[0]?.text || 'Not specified'}</p>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="clinical-info-card">
                                    <h6 className="text-muted mb-2">ICD-10 Code</h6>
                                    <Badge bg="outline-secondary" className="fs-6">
                                        {request.reasonCode?.[0]?.coding?.[0]?.code || 'Not specified'}
                                    </Badge>
                                </div>
                            </Col>
                        </Row>
                        {request.note?.[0]?.text && (
                            <Row className="mt-4">
                                <Col>
                                    <div className="clinical-info-card">
                                        <h6 className="text-muted mb-2">Additional Notes</h6>
                                        <div className="alert alert-light border-start border-primary border-4 mb-0">
                                            {request.note[0].text}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </Accordion.Body>
                </Accordion.Item>

                {/* Specimen Requirements */}
                <Accordion.Item eventKey="2" className="mb-3 border-0 shadow-sm">
                    <Accordion.Header className="custom-accordion-header">
                        <div className="d-flex align-items-center">
                            <FiActivity className="text-warning me-2" />
                            <strong>Specimen Requirements</strong>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-4">
                        <Row className="g-4">
                            <Col md={4}>
                                <div className="specimen-card">
                                    <div className="specimen-icon">
                                        <FiActivity className="text-warning" />
                                    </div>
                                    <h6 className="text-muted mb-1">Specimen Type</h6>
                                    <strong>{request.specimen?.[0]?.type?.coding?.[0]?.display || 'Blood'}</strong>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="specimen-card">
                                    <div className="specimen-icon">
                                        <FiClock className="text-info" />
                                    </div>
                                    <h6 className="text-muted mb-1">Fasting Required</h6>
                                    <Badge bg={request.supportingInfo?.some(info => info.valueBoolean) ? 'warning' : 'success'}>
                                        {request.supportingInfo?.some(info => info.valueBoolean) ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="specimen-card">
                                    <div className="specimen-icon">
                                        <FiCalendar className="text-primary" />
                                    </div>
                                    <h6 className="text-muted mb-1">Collection Date/Time</h6>
                                    <strong>{formatDateTime(request.occurrenceDateTime)}</strong>
                                </div>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Status Timeline */}
                <Accordion.Item eventKey="3" className="mb-3 border-0 shadow-sm">
                    <Accordion.Header className="custom-accordion-header">
                        <div className="d-flex align-items-center">
                            <FiClock className="text-info me-2" />
                            <strong>Status Timeline</strong>
                            <Badge bg="light" text="dark" className="ms-2">
                                {statusTimeline.filter(item => item.date).length} of {statusTimeline.length} completed
                            </Badge>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-4">
                        <div className="enhanced-timeline">
                            {statusTimeline.map((item, index) => (
                                <div key={index} className={`timeline-item ${item.date ? 'completed' : 'pending'}`}>
                                    <div className="timeline-marker">
                                        {item.date ? <FiActivity /> : <FiClock />}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6 className="mb-1">{item.label}</h6>
                                                {item.date ? (
                                                    <small className="text-success">
                                                        <FiCalendar className="me-1" />
                                                        {formatDateTime(item.date)}
                                                    </small>
                                                ) : (
                                                    <small className="text-muted">Pending</small>
                                                )}
                                            </div>
                                            <Badge bg={item.date ? 'success' : 'secondary'} className="ms-2">
                                                {item.date ? 'Completed' : 'Pending'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {/* Action Buttons */}
            <Card className="mt-4 border-0 shadow-sm">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-1">Actions</h6>
                            <small className="text-muted">Available actions for this lab request</small>
                        </div>
                        <div className="d-flex gap-2">
                            {(request.status === 'draft' || request.status === 'active') && (
                                <Button
                                    variant="outline-danger"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="d-flex align-items-center"
                                >
                                    <FiX className="me-2" />
                                    Cancel Order
                                </Button>
                            )}
                            <Button
                                variant="outline-primary"
                                onClick={handlePrint}
                                className="d-flex align-items-center"
                            >
                                <FiPrinter className="me-2" />
                                Print Requisition
                            </Button>
                            {request.status === 'draft' && (
                                <Button
                                    variant="primary"
                                    onClick={() => onEdit(request)}
                                    className="d-flex align-items-center"
                                >
                                    <FiEdit3 className="me-2" />
                                    Edit Order
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <style jsx>{`
                .lab-request-details {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .info-item {
                    display: flex;
                    align-items: flex-start;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }
                
                .progress-section {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                }
                
                .lab-accordion .accordion-item {
                    border-radius: 12px !important;
                    overflow: hidden;
                }
                
                .custom-accordion-header {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border: none;
                }
                
                .custom-accordion-header .accordion-button {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                    font-weight: 600;
                    padding: 20px;
                }
                
                .custom-accordion-header .accordion-button:not(.collapsed) {
                    background: transparent;
                    color: #495057;
                }
                
                .clinical-info-card {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #28a745;
                }
                
                .specimen-card {
                    text-align: center;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    border: 2px solid #e9ecef;
                    transition: all 0.3s ease;
                }
                
                .specimen-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                .specimen-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    font-size: 18px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .enhanced-timeline {
                    position: relative;
                    padding-left: 40px;
                }
                
                .timeline-item {
                    position: relative;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    border-left: 4px solid #dee2e6;
                }
                
                .timeline-item.completed {
                    border-left-color: #28a745;
                    background: linear-gradient(135deg, #d4edda 0%, #f8f9fa 100%);
                }
                
                .timeline-item:before {
                    content: '';
                    position: absolute;
                    left: -32px;
                    top: 40px;
                    bottom: -30px;
                    width: 3px;
                    background: linear-gradient(to bottom, #dee2e6, transparent);
                }
                
                .timeline-item:last-child:before {
                    display: none;
                }
                
                .timeline-marker {
                    position: absolute;
                    left: -42px;
                    top: 20px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    border: 3px solid white;
                }
                
                .timeline-item.completed .timeline-marker {
                    background: #28a745;
                }
                
                .timeline-content {
                    padding-left: 0;
                }
                
                @media (max-width: 768px) {
                    .info-item {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .enhanced-timeline {
                        padding-left: 20px;
                    }
                    
                    .timeline-marker {
                        left: -22px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LabRequestDetails;