import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BiEdit } from "react-icons/bi";
import ProfileDummy from "../../../assets/images/profileDummy.png";
import { Button } from 'react-bootstrap';

const NewPatient = () => {
    const navigate = useNavigate();
    return (
        <div className="background_Color pt-1 pb-2">
            <div className='container-fluid px-4'>
                <div className='d-flex justify-content-between mt-3'>
                    <p style={{ fontWeight: 600 }}> NEW PATIENT</p>
                    <Button
                        className=""
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </div>
                <div className='px-2 mt-3'>
                    <div >
                        <ul className="nav nav-underline ">
                            <li className="nav-item">
                                <a className="nav-link active fw-medium ps-2" aria-current="page" href="#">Personal Details</a>
                            </li>
                            {/* <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li> */}
                        </ul>
                    </div>
                    <div className='my-3 pt-5'>
                        <p>Logo</p>

                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={ProfileDummy}
                                alt='profile-img'
                                className='mt-2 '
                                style={{ height: '100px', width: '100px', }}
                            />
                            <BiEdit
                                className='fs-5'
                                style={{
                                    position: 'absolute',
                                    top: '-3px',
                                    right: '2px',
                                    // borderRadius: '50%',
                                    cursor: 'pointer',

                                }}
                            />
                        </div>
                    </div>
                    <div className='row pb-4' style={{ borderBottom: '1px solid #444141' }}>
                        <div className='col-6' >

                            <div>
                                <p>First Name*</p>
                                <input
                                    placeholder='First Name'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                            <div className='mt-3'>
                                <p>Email*</p>
                                <input
                                    placeholder='Email'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                            <div className='mt-3'>
                                <p>Phone*</p>
                                <input
                                    placeholder='0987654321'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                            {/* <div className='mt-3'>
                            <p>Blood Group:</p>
                            <select
                                className='w-100 input ps-2 py-1'
                            >
                                <option> Select Blood Group</option>
                                <option>A+</option>
                                <option>A-</option>
                                <option>B+</option>
                                <option>B-</option>
                            </select>
                        </div>
                        <div className='mt-3'>
                            <p>Blood Group:</p>
                            <select
                                className='w-100 input ps-2 py-1'
                            >
                                <option>Blood Group</option>
                                <option>A+</option>
                                <option>A-</option>
                                <option>B+</option>
                                <option>B-</option>
                            </select>

                        </div>
                        <div className='mt-3'>
                            <p>Next to kin:</p>
                            <input
                                placeholder='Specialist'
                                className='w-100 input ps-2 py-1'
                            />
                        </div>
                        <div className='mt-3'>
                            <p>Patient ID</p>
                            <input
                                placeholder='Patient ID'
                                className='w-100 input ps-2 py-1'
                            />
                        </div> */}
                        </div>
                        <div className='col-6'>
                            <div>
                                <p>Last Name*</p>
                                <input
                                    placeholder='Last Name'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                            <div className='mt-3'>
                                <p>Date Of Birth*</p>
                                <input
                                    placeholder='Date Of Birth'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                            <div className='row mt-3'>
                                <div className='col-6'>
                                    <p>Gender*</p>
                                    <div className='d-flex gap-2'>
                                        <div class="form-check mt-2">
                                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <label class="form-check-label" for="flexRadioDefault1">
                                                Male
                                            </label>
                                        </div>
                                        <div class="form-check mt-2">
                                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <label class="form-check-label" for="flexRadioDefault1">
                                                Female
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <p>Status</p>
                                    <div class="form-check form-switch mt-2">
                                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className='col-6'>
                                    <div>
                                        <p>Password*</p>
                                        <input
                                            placeholder='Password'
                                            className='w-100 input ps-2 py-1'
                                        />
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div>
                                        <p>Confirm Password*</p>
                                        <input
                                            placeholder='Confirm Password'
                                            className='w-100 input ps-2 py-1'
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='row pb-4' style={{ borderBottom: '1px solid #444141' }}>
                        <p className='my-3'>Address Details</p>
                        <div className='col-6 '>
                            <div>
                                <p>Address 1*</p>
                                <input
                                    placeholder='Address 1'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                            <div className='row mt-3'>
                                <div className='col-6'>
                                    <div>
                                        <p>City*</p>
                                        <input
                                            placeholder='City'
                                            className='w-100 input ps-2 py-1'
                                        />
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div>
                                        <p>Zip*</p>
                                        <input
                                            placeholder='Zip'
                                            className='w-100 input ps-2 py-1'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div>
                                <p>Address 2*</p>
                                <input
                                    placeholder='Address 2'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row pb-4' >
                        <p className='my-3'>Social Media</p>
                        <div className='col-6 '>
                            <div>
                                <p>Facebook URL:</p>
                                <input
                                    placeholder='Facebook URL'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                            <div className='mt-3'>
                                <p>Instagarm URL:</p>
                                <input
                                    placeholder='Instagarm URL'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>

                        </div>
                        <div className='col-6'>
                            <div>
                                <p>Twitter URL</p>
                                <input
                                    placeholder='Twitter URL'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                            <div className='mt-3'>
                                <p>Linkedin URL:</p>
                                <input
                                    placeholder='Linkedin URL'
                                    className='w-100 input ps-2 py-1'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='d-flex gap-1 justify-content-end mb-2'>
                        <Button className=''>Cancel</Button>
                        <Button className=''>Save</Button>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default NewPatient