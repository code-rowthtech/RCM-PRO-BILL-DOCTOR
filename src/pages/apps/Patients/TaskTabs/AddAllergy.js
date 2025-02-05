import React, { useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

const AddAllergy = ({ onCancel }) => {

    

    return (
        <div>
            <Row>
                <Col sm={12} className='d-flex justify-content-between'>
                    <h4>Add Allergy</h4>
                    <Button className="custom-buttons" onClick={onCancel} >
                        Back
                    </Button>
                </Col>

                <Col sm={4}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="allergyType" className="mb-0">Allergy Type</Form.Label>
                        <Form.Select id="allergyType">
                            <option value="">Select Allergy Type</option>
                            <option value="food">Food Allergy</option>
                            <option value="drug">Drug Allergy</option>
                            <option value="environmental">Environmental Allergy</option>
                            <option value="other">Other</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={4}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="drugAllergy" className="mb-0">Specific Drug Allergy</Form.Label>
                        <Form.Control
                            id="drugAllergy"
                            type="text"
                            placeholder="Enter Specific Drug Allergy"
                        />
                    </Form.Group>
                </Col>

                <Col sm={4}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="reaction" className="mb-0">Reaction</Form.Label>
                        <Form.Select id="reaction">
                            <option value="">Select Reaction</option>
                            <option value="rash">Rash</option>
                            <option value="anaphylaxis">Anaphylaxis</option>
                            <option value="swelling">Swelling</option>
                            <option value="nausea">Nausea</option>
                            <option value="other">Other</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="severity" className="mb-0">Severity</Form.Label>
                        <Form.Select id="severity">
                            <option value="">Select Severity</option>
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className='mb-1'>
                        <Form.Label htmlFor="status" className="mb-0">Status</Form.Label>
                        <Form.Select >
                            <option value="">Select Status</option>
                            <option value="mild">Done</option>
                            <option value="moderate">Pending</option>
                            <option value="severe">Hold</option>
                        </Form.Select>
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
                    {/* <Button className='custom-buttons'>Save and Add Another</Button> */}
                    <Button className='custom-buttons'>Save</Button>
                </Col>

            </Row>
        </div>
    )
}

export default AddAllergy