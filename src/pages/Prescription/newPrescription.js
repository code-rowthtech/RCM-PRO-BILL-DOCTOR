import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";


const NewPrescription = () => {
    const navigate = useNavigate();

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2" style={{ height: "85vh" }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>NEW PRESCRIPTION</p>
                        <div>
                            <Button onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="">
                        <Form>
                            <div className="row mt-4" style={{ borderBottom: '1px solid #444141' }}>
                                <div className="col-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">
                                            Patient<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select>
                                            <option value="">Select doctor</option>

                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1" >Health Insurance</Form.Label>
                                        <Form.Control type="text" placeholder="Health Insurance" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">Low Insurance</Form.Label>
                                        <Form.Control type="text" placeholder="Low Insurance" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">Reference<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Health Reference" />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>

                        <div>
                            <div className="d-flex justify-content-between mt-3">
                                <div>
                                    <p className="fs-4" style={{ fontWeight: 500 }}>Medicines</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button className="custom-button">New Medicine</Button>
                                    <Button className="custom-button">Suggest Medicines</Button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <Button className="custom-button">ADD</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default NewPrescription;
