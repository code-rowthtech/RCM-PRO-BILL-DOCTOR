import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddBreak = () => {

    const navigate = useNavigate();

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2" style={{ height: "85vh" }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD BREAK</p>
                        <Button onClick={() => navigate(-1)}>Back</Button>
                    </div>
                    <div className="px-2">
                        <Form>
                            <div className="row pb-4 mt-3">
                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Doctor Name<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select>
                                            <option value="">Select doctor</option>
                                            <option value="doctor1">Doctor 1</option>
                                            <option value="doctor2">Doctor 2</option>
                                            <option value="doctor3">Doctor 3</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mt-4">
                                        <Form.Label>
                                            From<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control type="time" />
                                    </Form.Group>
                                </div>

                                <div className="col-6">
                                    <Form.Group className="mb-3 mt-4 pb-1">
                                        <div className="d-flex gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Every Day"
                                                name="breakDay"
                                                className="mt-1"
                                            />
                                            <div className="d-flex">
                                                <Form.Check
                                                    type="radio"
                                                    label="Break Day"
                                                    name="breakDay"
                                                    className="mt-1"
                                                />
                                                <Form.Select className="border-0 w-25">
                                                    <option value="">Select a Day</option>
                                                    <option value="Sunday">Sunday</option>
                                                    <option value="Monday">Monday</option>
                                                    <option value="Tuesday">Tuesday</option>
                                                    <option value="Wednesday">Wednesday</option>
                                                    <option value="Thursday">Thursday</option>
                                                    <option value="Friday">Friday</option>
                                                    <option value="Saturday">Saturday</option>
                                                </Form.Select>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            To<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control type="time" />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary">Cancel</Button>
                                <Button variant="primary">Save</Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AddBreak;
