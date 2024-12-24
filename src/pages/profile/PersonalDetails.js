import React, { useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { Button, Form } from 'react-bootstrap';
import { handleFirstSpace } from '../../helpers/noSpace';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { handleUpload } from '../../helpers/HandleUpload';

const PersonalDetails = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [degree, setDegree] = useState(null);
    const [degreeName, setDegreeName] = useState('');
    const degreeFileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setDegree(url);
            setDegreeName(selectedFile?.name)
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };
    const handleFileChangeDegree = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setLogo(url);
            setLogoName(selectedFile?.name)
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };

    return (
        <div className="container-fluid px-0">
            <div className="col-12 mt-1" style={{ borderBottom: '1px solid #444141' }}>
                <div className="row">
                    <div className="col-6">
                        <Form>
                            <Form.Group className="mb-3" controlId="firstName">
                                <Form.Label>First Name*</Form.Label>
                                <Form.Control type="text" placeholder="Enter first name" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email*</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email"
                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>Phone*</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Phone number"
                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                />
                            </Form.Group>

                            <div className="mb-3 d-flex flex-column position-relative">
                                <Form.Label>Profile Image</Form.Label>
                                <div
                                    onClick={() => logoFileInputRef.current.click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? '' : 'custom-form-fields'}`}
                                >
                                    {logoName ? logoName : 'Upload Profile Image'}
                                    <p className="mb-0">
                                        <FiUploadCloud />
                                    </p>
                                </div>
                                <Form.Control
                                    type="file"
                                    className="d-none "
                                    // {...register('profileImage', {
                                    //     required: 'Profile image is required',
                                    // })}
                                    accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                                    ref={logoFileInputRef}
                                    onChange={handleFileChange}
                                // onChange={()
                                //     // setFormData({ ...formData, profileImage: e.target.value });
                                //     handleFileChange
                                // }
                                />
                                {/* {errors.profileImage &&
                                    <p className="text-danger">{errors.profileImage.message}</p>
                                } */}
                            </div>

                            <Form.Group className="mb-3" controlId="degree">
                                <Form.Label>Degree Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Degree Name" />
                            </Form.Group>
                        </Form>
                    </div>

                    <div className="col-6">
                        <Form>
                            <Form.Group className="mb-3" controlId="lastName">
                                <Form.Label>Last Name*</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Last name"
                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 ">
                                <Form.Label>
                                    Date of Birth
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                // {...register('dateOfBirth', {
                                //     required: 'Date of birth is required',
                                //     validate: (value) => {
                                //         const selectedDate = new Date(value);
                                //         const today = new Date();
                                //         return selectedDate <= today || 'Date of birth cannot be in the future';
                                //     },
                                // })}
                                // onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                />
                                {/* {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>} */}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="gender">
                                <Form.Label>Gender*</Form.Label>
                                <div className="d-flex gap-2 mt-1 mb-2">
                                    <Form.Check
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        label="Male"
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="gender"
                                        id="female"
                                        label="Female"
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="gender"
                                        id="other"
                                        label="Other"
                                    />
                                </div>
                            </Form.Group>

                            <div className='row '>
                                <div className='col-6 '>
                                    <Form.Group className="mb-3 mt-1">
                                        <Form.Label>
                                            Password
                                        </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                onKeyDown={(event) => handleFirstSpace(event, 0)}
                                                placeholder="********"
                                                readOnly
                                            // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            // {...register("password", {
                                            //     required: !id ? "Password is required" : false,
                                            //     pattern: {
                                            //         value: id
                                            //             ? ""
                                            //             : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                            //         message:
                                            //             "At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character. Spaces are not allowed.",
                                            //     },
                                            //     validate: (value) =>
                                            //         !/\s/.test(value) || "Spaces are not allowed in the password.",
                                            // })}
                                            />
                                            <span
                                                className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                            {/* {errors.password && (
                                                <span className="text-danger">{errors.password.message}</span>
                                            )} */}
                                        </div>
                                    </Form.Group>


                                </div>
                                <div className='col-6'>

                                    <Form.Group className='mb-3 mt-1'>
                                        <Form.Label>Confirm Password</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="********"
                                                readOnly
                                            // readOnly={id}
                                            // onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            // {...register('confirmPassword', {
                                            //     ...(!id ? { required: 'Please confirm your password' } : {}),
                                            //     pattern: {
                                            //         value: id ? '' : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                            //         message: 'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character',
                                            //     },
                                            //     validate: value =>
                                            //         value === password || 'Passwords do not match'
                                            // })}
                                            />
                                            <span
                                                className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                            {/* {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>} */}
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="mb-3 d-flex flex-column position-relative">
                                    <Form.Label>Degree</Form.Label>
                                    <div
                                        // onClick={() => degreeFileInputRef.current.click()}
                                        className={`custom-file-upload justify-content-between cursor-pointer ${degreeName ? '' : 'custom-form-fields'}`}
                                    >
                                        {degreeName ? degreeName : 'Upload Degree'}
                                        <p className="mb-0">
                                            <FiUploadCloud />
                                        </p>
                                    </div>
                                    <Form.Control
                                        type="file"
                                        className="d-none "
                                        // {...register('degreeDoc', {
                                        //     required: 'Degree is required',
                                        // })}
                                        ref={degreeFileInputRef}
                                        onChange={handleFileChangeDegree}
                                    />
                                    {/* {errors.degreeDoc && (
                                        <p className="text-danger">{errors.degreeDoc.message}</p>
                                    )} */}
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>

            {/* <div className="col-12 mt-3">
                <p>Address Details*</p>
                <div className="row">
                    <div className="col-6">
                        <Form>
                            <Form.Group className="mb-3" controlId="address1">
                                <Form.Label>Address 1</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Address 1"
                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                />
                            </Form.Group>

                            <div className="row">
                                <div className="col-6">
                                    <Form.Group className="mb-3" controlId="city">
                                        <Form.Label>City*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="City"
                                            style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-3" controlId="zip">
                                        <Form.Label>Zip*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Zip"
                                            style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </div>

                    <div className="col-6">
                        <Form.Group className="mb-3" controlId="address2">
                            <Form.Label>Address 2*</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Address 2"
                                style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                            />
                        </Form.Group>
                    </div>
                </div>
            </div> */}

            <div className="col-12 mt-3">
                <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="primary">Update</Button>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetails;
