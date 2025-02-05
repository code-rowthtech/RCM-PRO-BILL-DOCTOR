import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

const AddProblem = ({ onCancel }) => {
    return (
        <div>
            <Row>
                <Col sm={12} className='d-flex justify-content-between'>
                    <h4>Add Problem</h4>
                    <Button className="custom-buttons" onClick={onCancel} >
                        Back
                    </Button>
                </Col>
                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="problem" className="mb-0">Problem </Form.Label>
                        <Form.Control
                            // data-has-value={!!watch('taskTitle')}
                            id="problem"
                            type="text"
                            placeholder="Enter Problem"
                        // {...register('taskTitle', { required: "Task title is required" })}
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="template" className="mb-0">ICD Version</Form.Label>
                        <Form.Select
                            as="select"  // Use 'select' to make it a dropdown
                            // data-has-value={!!watch('template')}
                            id="ICDVersion"
                        // {...register('template')}
                        >
                            <option value="" >Select ICD Version</option>
                            <option value="ICDVersion1">ICD Version 1</option>
                            <option value="ICDVersion2">ICD Version 2</option>

                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="problem" className="mb-0">ICD 10 code </Form.Label>
                        <Form.Control
                            // data-has-value={!!watch('taskTitle')}
                            id="problem"
                            type="text"
                            placeholder="Enter ICD 10 code"
                        // {...register('taskTitle', { required: "Task title is required" })}
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="Status" className="mb-0">Status</Form.Label>
                        <Form.Select
                            as="select"  // Use 'select' to make it a dropdown
                            // data-has-value={!!watch('template')}
                            id="ICDVersion"
                        // {...register('template')}
                        >
                            <option value="" >Select Status</option>
                            <option value="ICDVersion1">Done</option>
                            <option value="ICDVersion2">Pending</option>

                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="Appointment" className="mb-0">Appointment</Form.Label>
                        <Form.Select
                            as="select"  // Use 'select' to make it a dropdown
                            // data-has-value={!!watch('template')}
                            id="ICDVersion"
                        // {...register('template')}
                        >
                            <option value="" >Select Appointment</option>
                            <option value="ICDVersion1">Done</option>
                            <option value="ICDVersion2">Pending</option>

                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="problem" className="mb-0">Datetime Diagnosis</Form.Label>
                        <Form.Control
                            // data-has-value={!!watch('taskTitle')}
                            id="problem"
                            type="text"
                            placeholder="Enter Datetime Diagnosis"
                        // {...register('taskTitle', { required: "Task title is required" })}
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="problem" className="mb-0">Datetime Onset</Form.Label>
                        <Form.Control
                            // data-has-value={!!watch('taskTitle')}
                            id="problem"
                            type="text"
                            placeholder="Enter Datetime Onset"
                        // {...register('taskTitle', { required: "Task title is required" })}
                        />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="problem" className="mb-0">Datetime Changed</Form.Label>
                        <Form.Control
                            // data-has-value={!!watch('taskTitle')}
                            id="problem"
                            type="text"
                            placeholder="Enter Datetime Changed"
                        // {...register('taskTitle', { required: "Task title is required" })}
                        />
                    </Form.Group>
                </Col>
                <Col sm={12}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="note" className="mb-0">Note</Form.Label>
                        <Form.Control
                            id="note"
                            as="textarea"
                            placeholder="Note"
                            rows={4}
                        />
                    </Form.Group>
                </Col>
                <Col sm={12} className='d-flex justify-content-end gap-1 mt-1'>
                    <Button className='custom-buttons'>Cancel</Button>
                    <Button className='custom-buttons'>Save and Add Another</Button>
                    <Button className='custom-buttons'>Save</Button>
                </Col>

            </Row>
        </div>
    )
}

export default AddProblem