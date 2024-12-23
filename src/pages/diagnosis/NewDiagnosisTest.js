import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Table } from "react-bootstrap";
import { RiDeleteBin5Line } from "react-icons/ri";

const NewDiagnosisTest = () => {

    const navigate = useNavigate();

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-2">
                <Card className="px-3 py-2"style={{height:'87vh'}} >
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600, textTransform: 'uppercase' }}>New Patient Diagnosis Test</p>
                        <div>
                            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="">
                        <Form>
                            <div className="row " style={{ borderBottom: '1px solid #444141' }}>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">
                                            Patient
                                        </Form.Label>
                                        <Form.Select>
                                            <option value="">Select Patient</option>

                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">
                                            Diagnosis Category
                                        </Form.Label>
                                        <Form.Select>
                                            <option value="">Choose Diagnosis Category</option>

                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Report Number</Form.Label>
                                        <Form.Control type="text" placeholder="Report Number" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Age</Form.Label>
                                        <Form.Control type="text" placeholder="Age" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Height</Form.Label>
                                        <Form.Control type="text" placeholder="Height" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Weight</Form.Label>
                                        <Form.Control type="text" placeholder="Weight" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Average glucose</Form.Label>
                                        <Form.Control type="text" placeholder="Average glucose" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Fasting Blood Sugar</Form.Label>
                                        <Form.Control type="text" placeholder="Breast Feeding" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Urine Sugar</Form.Label>
                                        <Form.Control type="text" placeholder="Urine Sugar" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Blood Pressure</Form.Label>
                                        <Form.Control type="text" placeholder="Blood Pressure" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Diabetes</Form.Label>
                                        <Form.Control type="text" placeholder="Diabetes" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-2">
                                        <Form.Label className="mb-0">Cholesterol</Form.Label>
                                        <Form.Control type="text" placeholder="Cholesterol" />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>

                        <div>
                            <div className="d-flex justify-content-between mt-1">
                                <div>
                                    <p className="fs-4" style={{ fontWeight: 500 }}>Medicines</p>
                                </div>
                                <div className="d-flex gap-2 my-1">
                                    {/* <Button className="custom-button">New Medicine</Button>
                                    <Button className="custom-button">Suggest Medicines</Button> */}
                                    <Button variant="success" className="custom-button">ADD</Button>
                                </div>
                            </div>
                            {/* <div className="d-flex justify-content-end mt-2">
                        <Button className="custom-button">ADD</Button>
                    </div> */}
                        </div>
                        <div>
                            <div >
                                <Table responsive className="table-centered table-nowrap mb-0 mt-1">
                                    <thead className="text-white">
                                        <tr>
                                            <th className='text-white'>#</th>
                                            <th className='text-white'>Diagnosis Property Name</th>
                                            <th className='text-white'>Diagnosis property Value</th>
                                            <th className='text-white text-end'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
                                            <td  style={{width:'3vw'}}>
                                                1
                                            </td>
                                            <td>
                                                <Form.Group>
                                                    <Form.Control type="text" placeholder="Diagnosis property Name" />
                                                </Form.Group>
                                            </td>
                                            <td >
                                                <Form.Group>
                                                    <Form.Control type="text" placeholder="Diagnosis property Value" />
                                                </Form.Group>
                                            </td>
                                            <td className='text-end pe-3' style={{width:'3vw'}}><RiDeleteBin5Line className="fs-4" /></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>

                    </div>
                </Card>
            </div>
        </div>)
}

export default NewDiagnosisTest