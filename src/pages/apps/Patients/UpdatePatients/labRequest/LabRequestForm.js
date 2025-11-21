import React, { useState } from 'react';
import { Form, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const LabRequestForm = ({ selectedRequest, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: selectedRequest ? {
            testCode: selectedRequest.code?.coding?.[0]?.code || '',
            testName: selectedRequest.code?.coding?.[0]?.display || '',
            priority: selectedRequest.priority || 'routine',
            reasonCode: selectedRequest.reasonCode?.[0]?.coding?.[0]?.code || '',
            reasonText: selectedRequest.reasonCode?.[0]?.text || '',
            specimenType: selectedRequest.specimen?.[0]?.type?.coding?.[0]?.code || 'blood',
            fastingRequired: selectedRequest.supportingInfo?.some(info => info.valueBoolean) || false,
            clinicalInfo: selectedRequest.note?.[0]?.text || '',
            collectionDate: selectedRequest.occurrenceDateTime?.split('T')[0] || '',
            collectionTime: selectedRequest.occurrenceDateTime?.split('T')[1]?.split('.')[0] || ''
        } : {
            priority: 'routine',
            specimenType: 'blood',
            fastingRequired: false
        }
    });

    const commonTests = [
        { code: '24362-6', display: 'Basic Metabolic Panel (BMP)' },
        { code: '33747-0', display: 'Complete Blood Count (CBC)' },
        { code: '24323-8', display: 'Comprehensive Metabolic Panel (CMP)' },
        { code: '4548-4', display: 'Hemoglobin A1C' },
        { code: '57698-3', display: 'Lipid Panel' },
        { code: '6301-6', display: 'Partial Thromboplastin Time (PTT)' },
        { code: '5902-2', display: 'Prothrombin Time (PT)' },
        { code: '33743-4', display: 'Thyroid Function Panel' },
    ];

    const specimenTypes = [
        { code: 'blood', display: 'Blood' },
        { code: 'stool', display: 'Stool' },
        { code: 'swab', display: 'Swab' },
        { code: 'tissue', display: 'Tissue' },
        { code: 'urine', display: 'Urine' },
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            // Mock API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Lab request submitted:', data);
            onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to save lab request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Order Details</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Test/Panel <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    {...register('testCode', { required: 'Test selection is required' })}
                                    onChange={(e) => {
                                        const selected = commonTests.find(t => t.code === e.target.value);
                                        setValue('testName', selected?.display || '');
                                    }}
                                    isInvalid={!!errors.testCode}
                                >
                                    <option value="">Select a test...</option>
                                    {commonTests.map(test => (
                                        <option key={test.code} value={test.code}>{test.display}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.testCode?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Priority <span className="text-danger">*</span></Form.Label>
                                <Form.Select {...register('priority', { required: true })}>
                                    {['routine', 'stat', 'urgent']?.map((priority, i) => (
                                        <option value={priority} key={i}>{priority}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>ICD-10 Code</Form.Label>
                                <Form.Control
                                    {...register('reasonCode')}
                                    placeholder="e.g., Z00.00"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Reason for Test</Form.Label>
                                <Form.Control
                                    {...register('reasonText')}
                                    placeholder="e.g., Annual physical, Follow-up"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Additional Clinical Information</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    {...register('clinicalInfo')}
                                    placeholder="Enter any relevant clinical notes..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Specimen Instructions</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Specimen Type <span className="text-danger">*</span></Form.Label>
                                <Form.Select {...register('specimenType', { required: true })}>
                                    {specimenTypes.map(type => (
                                        <option key={type.code} value={type.code}>{type.display}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Fasting Required"
                                    {...register('fastingRequired')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Collection Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('collectionDate')}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Collection Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    {...register('collectionTime')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-end gap-2">
                <Button className='cancel-button' onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button className='custom-buttons' type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Order'}
                </Button>
            </div>
        </Form>
    );
};

export default LabRequestForm;