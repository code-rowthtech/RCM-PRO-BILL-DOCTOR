import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Table } from "react-bootstrap";
import { RiDeleteBin5Line } from "react-icons/ri";


const NewPrescription = () => {
    const navigate = useNavigate();

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-2">
                <Card className="px-3 py-2" >
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>NEW PRESCRIPTION</p>
                        <div>
                            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="">
                        <Form>
                            <div className="row " style={{ borderBottom: '1px solid #444141' }}>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-1">
                                            Patient<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select>
                                            <option value="">Select doctor</option>

                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-1" >Health Insurance</Form.Label>
                                        <Form.Control type="text" placeholder="Health Insurance" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-1">Low Insurance</Form.Label>
                                        <Form.Control type="text" placeholder="Low Insurance" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-1">Reference<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Health Reference" />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>

                        <div>
                            <div className="d-flex justify-content-between mt-1">
                                <div>
                                    <p className="fs-4" style={{ fontWeight: 500 }}>Medicines</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button className="custom-button">New Medicine</Button>
                                    <Button className="custom-button">Suggest Medicines</Button>
                                    <Button variant="success" className="custom-button">ADD</Button>
                                </div>
                            </div>
                            {/* <div className="d-flex justify-content-end mt-2">
                                <Button className="custom-button">ADD</Button>
                            </div> */}
                        </div>
                        <div>
                            <div style={{ borderBottom: "1px solid #444141" }}>
                                <Table responsive className="table-centered table-nowrap mb-0 mt-1">
                                    <thead className="text-white">
                                        <tr>
                                            <th className='text-white'>Medicines</th>
                                            <th className='text-white'>Dosage</th>
                                            <th className='text-white'>Dose Duration</th>
                                            <th className='text-white'>time</th>
                                            <th className='text-white'>Dose Interval</th>
                                            <th className='text-white'>Comment</th>
                                            <th className='text-white'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
                                            <td>
                                                <Form.Select
                                                    aria-label="Select Title"
                                                >
                                                    <option value="">Select Medicine</option>
                                                    <option value="">1</option>
                                                    <option value="">2</option>
                                                    <option value="">3</option>
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Group>
                                                    <Form.Control type="text" placeholder="Dosage" />
                                                </Form.Group>
                                            </td>
                                            <td className="">
                                                <Form.Select
                                                    aria-label="Select Title"
                                                >
                                                    <option value="">Only one Day</option>
                                                    <option value="">1</option>
                                                    <option value="">2</option>
                                                    <option value="">3</option>
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Select
                                                    aria-label="Select Title"
                                                >
                                                    <option value="">After Meal</option>
                                                    <option value="">1</option>
                                                    <option value="">2</option>
                                                    <option value="">3</option>
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Select
                                                    aria-label="Select Title"
                                                >
                                                    <option value="">Daily Morning</option>
                                                    <option value="">1</option>
                                                    <option value="">2</option>
                                                    <option value="">3</option>
                                                </Form.Select>
                                            </td>

                                            {/* <td>{data.status}</td> */}
                                            <td>
                                                <Form.Group>
                                                    <Form.Control type="text" placeholder="Comment" />
                                                </Form.Group>
                                            </td>
                                            <td><RiDeleteBin5Line className="fs-4" /></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="fs-4  mb-1" style={{ fontWeight: 600 }}>Physical Information</p>
                            <div className="row">
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-1" >High Blood Pressure</Form.Label>
                                        <Form.Control type="text" placeholder="High Blood Pressure" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-1" >Food Allergies</Form.Label>
                                        <Form.Control type="text" placeholder="Food Allergies" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-1" >Tendency Bleed</Form.Label>
                                        <Form.Control type="text" placeholder="Tendency Bleed" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-1" >Heart Disease</Form.Label>
                                        <Form.Control type="text" placeholder="Heart Disease" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Diabetic</Form.Label>
                                        <Form.Control type="text" placeholder="Diabetic" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Added At</Form.Label>
                                        <Form.Control type="text" placeholder="Added At" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Female  Pregnancy</Form.Label>
                                        <Form.Control type="text" placeholder="Female  Pregnancy" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Breast Feeding</Form.Label>
                                        <Form.Control type="text" placeholder="Breast Feeding" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Current Medication</Form.Label>
                                        <Form.Control type="text" placeholder="Current Medication" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Surgery</Form.Label>
                                        <Form.Control type="text" placeholder="Surgery" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Accident</Form.Label>
                                        <Form.Control type="text" placeholder="Accident" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Others</Form.Label>
                                        <Form.Control type="text" placeholder="Others" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Pulse Rate</Form.Label>
                                        <Form.Control type="text" placeholder="Pulse Rate" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-">
                                        <Form.Label className="mb-1" >Temperature</Form.Label>
                                        <Form.Control type="text" placeholder="Temperature" />
                                    </Form.Group>
                                </div>
                              <div className="row">
                              <div className="col-6">
                                    <Form.Group className="mb-2">
                                        <Form.Label className="mb-1" >Test</Form.Label>
                                        <Form.Control as="textarea" rows={2} placeholder="Test" />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-2">
                                        <Form.Label className="mb-1" >Advice</Form.Label>
                                        <Form.Control as="textarea" rows={2} placeholder="Advice" />
                                    </Form.Group>
                                </div>
                              </div>
                                <div className="col-1">
                                    <Form.Group className="mb-2">
                                        <Form.Label className="mb-1" >Next Visit</Form.Label>
                                        <Form.Control type="text" placeholder="1" className="w-50" disabled />
                                    </Form.Group>
                                </div>
                                <div className="col-7 mt-3" style={{marginLeft:'-55px', paddingTop:'3px'}}>
                                    <Form.Select
                                        aria-label="Select Title"
                                    >
                                        <option value="">Days</option>
                                        <option value="">1</option>
                                        <option value="">2</option>
                                        <option value="">3</option>
                                    </Form.Select>
                                </div>
                                <div className="col-12 d-flex gap-2 justify-content-end">
                                    <Button variant="secondary">Cancel</Button>
                                    <Button variant="primary">Save</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default NewPrescription;
