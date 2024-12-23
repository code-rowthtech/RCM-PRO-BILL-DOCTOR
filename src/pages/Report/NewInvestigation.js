import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Table } from "react-bootstrap";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiDownloadCloud } from 'react-icons/fi';

const NewInvestigation = () => {

    const navigate = useNavigate();

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-2">
                <Card className="px-3 py-2"style={{height:'87vh'}} >
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600, textTransform: 'uppercase' }}>New Investigation report</p>
                        <div>
                            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="">
                        <Form>
                            <div className="row ">
                            <div className="col-6">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Title</Form.Label>
                                        <Form.Control type="text" placeholder="Title" />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
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
                                        <Form.Label className="mb-0">Date</Form.Label>
                                        <Form.Control type="text" placeholder="" />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">
                                            Status
                                        </Form.Label>
                                        <Form.Select>
                                            <option value="">Select Status</option>

                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-6 mb-1 d-flex flex-column position-relative">
                                <Form.Label className='mb-0'>Upload Logo</Form.Label>
                                <div
                                    // onClick={handleLogoClick}
                                    // className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? '' : 'custom-form-fields'
                                    //     }`}
                                    className='custom-file-upload justify-content-between cursor-pointer'
                                >
                               
                                    {/* {
                                        logoUploading
                                            ? 'Uploading...'
                                            : typeof logoName === 'string' && logoName
                                                ? logoName.split('/').pop().slice(0, 30) + "..."
                                                : 'Upload Logo'
                                    } */}
                                    <p className="mb-0">
                                        <FiDownloadCloud />
                                    </p>
                                </div>
                                <Form.Control
                                    type="file"
                                    className="rounded-circle"
                                    style={{ display: 'none' }}
                                    // ref={logoFileInputRef}
                                    accept=".png, .jpg, .jpeg, .svg"
                                    // onChange={handleFileChange}
                                />
                            </div>
                            <div className="">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Title</Form.Label>
                                        <Form.Control as="textarea" placeholder="Title" />
                                    </Form.Group>
                                </div>
                                <div className='d-flex justify-content-end gap-2 mt-1'> 
                                    <Button variant='secondary'>Cancel</Button>
                                    <Button>Save</Button>
                                </div>
                             
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>)
}

export default NewInvestigation