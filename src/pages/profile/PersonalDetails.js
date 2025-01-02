import React, { useEffect, useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { Button, Form } from 'react-bootstrap';
import { handleFirstSpace } from '../../helpers/noSpace';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { handleUpload } from '../../helpers/HandleUpload';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getDoctorsAction } from '../../redux/doctors/actions';
import { getDoctorsReducer } from '../../redux/doctors/reducers';
import { useForm } from 'react-hook-form';

const PersonalDetails = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch, getValues,
        setValue,
        clearErrors,
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [degree, setDegree] = useState(null);
    const [degreeName, setDegreeName] = useState('');
    const degreeFileInputRef = useRef(null);
    const store = useSelector((state) => state);

    const dispatch = useDispatch();

    const doctorDetails = store?.getDoctorsReducer?.data

    console.log(doctorDetails, 'doctorDetails')

    useEffect(() => {
        dispatch(
            getDoctorsAction()
        );

    }, [dispatch]);

    useEffect(() => {
        setValue('firstName', doctorDetails?.result?.userId?.firstName)
        setValue('lastName', doctorDetails?.result?.userId?.lastName)
        setValue('email', doctorDetails?.result?.userId?.email)
        setValue('phone', doctorDetails?.result?.userId?.phone)
        setValue('gender', doctorDetails?.result?.userId?.gender)
        setValue('degreeName', doctorDetails?.result?.userId?.degreeName)
        const formattedDateOfBirth = doctorDetails?.result?.userId?.dob
            ? new Date(doctorDetails?.result?.userId?.dob).toISOString().split('T')[0]
            : '';

        setValue('dateOfBirth', formattedDateOfBirth);
        if (doctorDetails?.result?.userId?.profileImage) {
            setLogoName(doctorDetails?.result?.userId?.profileImage?.fileName)
        }
        if (doctorDetails?.result?.userId?.degreeDoc) {
            setDegreeName(doctorDetails?.result?.userId?.degreeDoc?.fileName)
        }

    }, [doctorDetails]);


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
                            <Form.Group className="mb-1" controlId="firstName">
                                <Form.Label className='mb-0'>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    {...register('firstName', {
                                        required: 'First name is required',
                                        pattern: {
                                            value: /^[a-zA-Z]{3,}$/, // Regex: Only letters, at least 3 characters
                                            message: 'First name must contain only letters and be at least 3 characters long',
                                        },
                                    })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-1" controlId="email">
                                <Form.Label className='mb-0'>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for basic email format
                                            message: 'Enter a valid email address',
                                        },
                                    })}
                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-1" controlId="phone">
                                <Form.Label className='mb-0'>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Phone number"
                                    {...register('phone', {
                                        required: 'This field is required',
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Contact must be a number',
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: 'Contact must not exceed 10 digits',
                                        },
                                        minLength: {
                                            value: 10,
                                            message: 'Contact must not be less than 10 digits',
                                        },
                                    })}
                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                />
                            </Form.Group>

                            <div className="mb-1 d-flex flex-column position-relative">
                                <Form.Label className='mb-0'>Profile Image</Form.Label>
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
                                    {...register('profileImage', {
                                    })}
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

                            <Form.Group className="mb-1" controlId="degree">
                                <Form.Label className='mb-0'>Degree Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Degree Name"
                                    {...register('degreeName',
                                        // { required: 'Degree Name is required' }
                                    )}
                                />
                            </Form.Group>
                        </Form>
                    </div>

                    <div className="col-6">
                        <Form>
                            <Form.Group className="mb-1" controlId="lastName">
                                <Form.Label className='mb-0'>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Last name"
                                    {...register('lastName', {
                                        required: 'Last name is required',
                                        pattern: {
                                            value: /^[a-zA-Z]{3,}$/, // Regex: Only letters, at least 3 characters
                                            message: 'Last name must contain only letters and be at least 3 characters long',
                                        },
                                    })}
                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-1 ">
                                <Form.Label className='mb-0'>
                                    Date of Birth
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('dateOfBirth', {
                                        required: 'Date of birth is required',
                                        validate: (value) => {
                                            const selectedDate = new Date(value);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0); // Reset hours to ensure clean comparison
                                            return selectedDate <= today || 'Date of birth cannot be in the future';
                                        },
                                    })}
                                // onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                />
                                {/* {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>} */}
                            </Form.Group>

                            <Form.Group className="mb-1" controlId="gender">
                                <Form.Label className='mb-0'>Gender*</Form.Label>
                                <Form.Control
                                    as="select"
                                    {...register("gender", { required: "Gender is required" })}
                                // onChange={(e) => {
                                //     clearErrors("gender");
                                //     setFormData((prev) => ({ ...prev, gender: e.target.value }));
                                // }}
                                // className="mt-1"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                            </Form.Group>

                            <div className='row '>
                                <div className='col-6 '>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>
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

                                    <Form.Group className='mb-1'>
                                        <Form.Label className='mb-0'>Confirm Password</Form.Label>
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
                                <div className="mb-2 d-flex flex-column position-relative">
                                    <Form.Label className='mb-0'>Degree</Form.Label>
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
