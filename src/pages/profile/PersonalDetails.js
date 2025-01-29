import React, { useEffect, useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { handleFirstSpace } from '../../helpers/noSpace';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { handleUpload } from '../../helpers/HandleUpload';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getCities2Action, getCitiesAction, getDoctorsAction } from '../../redux/doctors/actions';
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
    const [formData, setFormData] = useState({
        role: '',
        firstName: '',
        email: '',
        lastName: '',
        phone: '',
        password: '',
    });
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [degree, setDegree] = useState(null);
    const [degreeName, setDegreeName] = useState('');
    const degreeFileInputRef = useRef(null);
    const store = useSelector((state) => state);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    const [focused, setFocused] = useState(false);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [updatePage, setUpdatePage] = useState(false);

    const dispatch = useDispatch();
    const statesData = store?.getStatesReducer?.data;
    const doctorDetails = store?.getDoctorsReducer?.data
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;

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
        setValue('zip1', doctorDetails?.result?.userId?.primaryAddress?.zip)
        setValue('zip2', doctorDetails?.result?.userId?.mailingAddress?.zip)
        setValue('street1', doctorDetails?.result?.userId?.primaryAddress?.street)
        setValue('street2', doctorDetails?.result?.userId?.mailingAddress?.street)
        setValue('address1', doctorDetails?.result?.userId?.primaryAddress?.address)
        setValue('address2', doctorDetails?.result?.userId?.mailingAddress?.address)
        setLongitude(doctorDetails?.result?.userId?.primaryAddress?.longitude)
        setLatitude(doctorDetails?.result?.userId?.primaryAddress?.latitude)
        setMailingLatitude(doctorDetails?.result?.userId?.mailingAddress?.latitude)
        setMailingLongitude(doctorDetails?.result?.userId?.mailingAddress?.longitude)
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
        const state = statesData?.states && statesData?.states.find((data) => data?._id === doctorDetails?.result?.userId?.primaryAddress?.state?._id)?._id;
        if (state) {
            dispatch(getCitiesAction({ state_code: doctorDetails?.result?.userId?.primaryAddress?.state?.id, name: doctorDetails?.result?.userId?.primaryAddress?.city?.name, skip: '', limit: '' }))
        }
        setValue('state1', doctorDetails?.result?.userId?.primaryAddress?.state?._id);
        const state2 = statesData?.states && statesData?.states.find((data) => data?._id === doctorDetails?.result?.userId?.mailingAddress?.state?._id)?._id;
        if (state2) {
            dispatch(getCities2Action({ state_code: doctorDetails?.result?.userId?.mailingAddress?.state?.id, name: doctorDetails?.result?.userId?.mailingAddress?.city?.name, skip: '', limit: '' }))
        }
        setValue('state2', doctorDetails?.result?.userId?.mailingAddress?.state?._id);
       
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

    const [searchedLocations, setSearchedLocations] = useState(null)
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null)

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data; // Return the geocoding data
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null; // Return null in case of error
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedLocations(data?.results)
                } else {
                    console.log("No data returned.");
                }
            });
    }

    const getMailingGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data; // Return the geocoding data
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null; // Return null in case of error
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedMailingLocations(data?.results)
                } else {
                    console.log("No data returned.");
                }
            });
    }
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedMailingLocation, setSelectedMailingLocation] = useState(null);
    console.log(selectedLocation, 'selectedLocationselectedLocation')
    useEffect(() => {
        if (selectedLocation) {
            setLatitude(selectedLocation?.bounds?.southwest?.lat);
            setLongitude(selectedLocation?.bounds?.southwest?.lng);
            setValue('address1', selectedLocation?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setFormData((prevState) => ({
                ...prevState,
                primaryAddress: {
                    ...prevState.primaryAddress,
                    state: selectedState,
                }
            }));
            setValue('state1', selectedState)
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
        if (selectedMailingLocation) {
            setMailingLatitude(selectedMailingLocation?.bounds?.southwest?.lat);
            setMailingLongitude(selectedMailingLocation?.bounds?.southwest?.lng);
            setValue('address2', selectedMailingLocation?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedMailingLocation?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedMailingLocation?.components?.state_code)?._id;
            setValue('state2', selectedState)
            const countyName = selectedMailingLocation?.components?.county;
            dispatch(getCities2Action({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
    }, [selectedLocation, selectedMailingLocation, setValue, statesData, dispatch])
    console.log({ cities1 })
    useEffect(() => {
        if (cities1) {
            const selectedCounty = cities1 && cities1.find((data) => data?.name === selectedLocation?.components?.county || doctorDetails?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city1', selectedCounty)
            setFormData((prevState) => ({
                ...prevState,
                primaryAddress: {
                    ...prevState.primaryAddress,
                    city: selectedCounty,
                }
            }));
        }
        if (cities2) {
            const selectedCounty = cities2 && cities2.find((data) => data?.name === selectedMailingLocation?.components?.county || doctorDetails?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city2', selectedCounty)
            setFormData((prevState) => ({
                ...prevState,
                mailingAddress: {
                    ...prevState.mailingAddress,
                    city: selectedCounty,
                }
            }));
        }
    }, [cities1, cities2])

    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCitiesAction({ state_code: key?.id, name: '', limit: 25, skip: '' }))
    };
    const handleMailingStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCities2Action({ state_code: key?.id, name: '', limit: 25, skip: '' }))
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

            <div className='row mt-1'>

                <Col sm={12} className='pb-1' style={{ borderBottom: '1px solid #444141' }}>
                    <Row>
                        <Col sm={12} className=''>
                            <span className='text-black fw-semibold form-label'>Primary Address</span>
                        </Col>
                        <Col sm={6}>
                            <Row className='position-relative'>
                                <Col sm={12}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Address</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <Form.Control
                                                type="text"
                                                // defaultValue={updatePage ? clinicDataToUpdate?.primaryAddress?.address : ''}
                                                {...register('address1')}
                                                onChange={(e) => {
                                                    // setFormData({ ...formData, address: e.target.value });

                                                    setFormData((prevState) => ({
                                                        ...prevState,
                                                        primaryAddress: {
                                                            ...prevState.primaryAddress,
                                                            address: e.target.value,
                                                        }
                                                    }));
                                                    getGeolocation(e);
                                                    setFocused(true); // Open dropdown on input
                                                }}
                                                onFocus={() => setFocused(true)} // Open dropdown when the field is focused
                                                onBlur={() => {
                                                    setTimeout(() => setFocused(false), 200); // Delay to allow selection before hiding dropdown
                                                }}
                                                placeholder="Search for address"
                                                autoComplete="off"
                                            />
                                            {/* {/ Dropdown suggestions /} */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    width: '100%',
                                                    maxHeight: '150px',
                                                    overflow: 'auto',
                                                    zIndex: 111,
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #ced4da',
                                                    borderTop: 'none',
                                                }}
                                                className={`scroll-container hover-bg-change ${searchedLocations?.length === 0 || !focused ? 'd-none' : ''}`}
                                            >
                                                {searchedLocations?.map((data, index) => (
                                                    <p
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedLocation(data)
                                                            console.log(data, 'data202020');
                                                            setValue('zip1', data?.components?.postcode || '')    // Update only the address field
                                                            setFormData((prevState) => ({
                                                                ...prevState,
                                                                primaryAddress: {
                                                                    ...prevState.primaryAddress,
                                                                    address: data?.formatted,
                                                                    ...(data?.bounds?.southwest?.lat ? { latitude: data?.bounds?.southwest?.lat } : {}),
                                                                    ...(data?.bounds?.southwest?.lng ? { longitude: data?.bounds?.southwest?.lng } : {}),
                                                                    ...(data?.components?.postcode ? { zip: data?.components?.postcode } : {}),     // Update only the address field
                                                                }
                                                            }));
                                                            setFocused(false); // Close dropdown after selection
                                                        }}
                                                        style={{
                                                            margin: 0,
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                        }}
                                                        className="hover-bg-change text-black"
                                                    >
                                                        {data?.formatted}
                                                    </p>
                                                ))}
                                                {searchedLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Latitude</Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={latitude}
                                            onChange={(e) => {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    primaryAddress: {
                                                        ...prevState.primaryAddress,
                                                        latitude: e.target.value,
                                                    }
                                                }));
                                            }}
                                            placeholder="Latitude"
                                        />
                                        {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Longitude</Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={longitude}
                                            onChange={(e) => {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    primaryAddress: {
                                                        ...prevState.primaryAddress,
                                                        longitude: e.target.value,
                                                    }
                                                }));
                                            }} placeholder="Longitude" />
                                        {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={6}>
                            <Row>
                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        {/* <label htmlFor="state-select" className='fw-bold mb-0' style={{ display: "block", marginBottom: "6px" }}>
                                            State
                                        </label> */}
                                        <Form.Label className='mb-0'>State</Form.Label>

                                        <select
                                            id="state-select"
                                            {...register("state1")}
                                            onChange={(e) => {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    primaryAddress: {
                                                        ...prevState.primaryAddress,
                                                        state: e.target.value,
                                                    }
                                                }));
                                                handleStateSelection(e);
                                            }}
                                            style={{
                                                width: "100%",
                                                padding: "7px ",
                                                borderRadius: "4px",
                                                border: "1px solid #ccc",
                                                backgroundColor:"#e5f4ff!important",
                                                color: getValues('state1')?.length === 0 ? "#a9a9a9" : "black", // Black if state is selected, gray otherwise
                                            }}
                                        >
                                            <option value="" disabled>
                                                Select state
                                            </option>
                                            {statesData?.states?.map((data) => (
                                                <option
                                                    key={data?.id} // Unique key for each option
                                                    data-key={JSON.stringify({ id: data?.id, _id: data?._id, name: data?.name })} // Store the key as a data attribute
                                                    value={data?._id}
                                                >
                                                    {data?.name}
                                                </option>
                                            ))}
                                        </select>

                                    </Form.Group>

                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>City</Form.Label>

                                        <select
                                            disabled={store?.getCitiesReducer?.loading}
                                            {...register('city1')}
                                            onChange={(e) => {
                                                // setFormData({ ...formData, city: e.target.value })
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    primaryAddress: {
                                                        ...prevState.primaryAddress,
                                                        city: e.target.value,
                                                    }
                                                }));
                                            }}
                                            style={{
                                                width: "100%",
                                                padding: "7px ",
                                                borderRadius: "4px",
                                                border: "1px solid #ccc",
                                                color: getValues('city1')?.length === 0 ? "#a9a9a9" : "black",
                                            }}
                                        >
                                            <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                            {cities1?.map((data) => (
                                                <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>
                                                    {data?.name}
                                                </option>
                                            ))}
                                        </select>

                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Street</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...register('street1')}
                                            onKeyPress={handleFirstSpace}
                                            onChange={(e) => {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    primaryAddress: {
                                                        ...prevState.primaryAddress,
                                                        street: e.target.value,
                                                    }
                                                }));
                                            }}
                                            placeholder="Street" />

                                        {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Zip</Form.Label>
                                        <Form.Control
                                            // defaultValue={updatePage ? clinicDataToUpdate?.primaryAddress?.zip : ''}
                                            type="text"
                                            {...register('zip1', {
                                                minLength: {
                                                    value: 5,
                                                    message: 'ZIP code must be at least 5 characters long',
                                                },
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: 'ZIP code must contain numbers only',
                                                },
                                            })}
                                            onKeyPress={handleFirstSpace}
                                            onChange={(e) => {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    primaryAddress: {
                                                        ...prevState.primaryAddress,
                                                        zip: e.target.value,
                                                    }
                                                }));
                                            }}
                                            placeholder="Zip"
                                            maxLength={5}
                                        />
                                        {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </div>

            <div className='row mt-1'>

                <Col sm={12}>
                    <Row>
                        <Col sm={12} className='mb-2'>
                            <span className='text-black fw-semibold form-label'>Mailing Address</span>
                            <Form.Check
                                type="checkbox"
                                label="Same as Primary Address"
                                disabled={
                                    !(
                                        formData?.primaryAddress?.address && formData?.primaryAddress?.zip &&
                                        formData?.primaryAddress?.state && formData?.primaryAddress?.city &&
                                        formData?.primaryAddress?.street
                                    )
                                }

                                // style={{ cursor: getValues('zip') === '' ? 'not-allowed' : '' }}
                                onChange={(e) => {

                                    if (e.target.checked) {
                                        setSameAsPrimary(true);
                                        setValue('address2', getValues('address1'));
                                        setValue('zip2', getValues('zip1'));
                                        setValue('street2', getValues('street1'));
                                        setMailingLatitude(latitude);
                                        setMailingLongitude(longitude);
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            mailingAddress: {
                                                ...prevState.mailingAddress,
                                                address: formData?.primaryAddress?.address,
                                                state: formData?.primaryAddress?.state,
                                                city: formData?.primaryAddress?.city,
                                                latitude: formData?.primaryAddress?.latitude,
                                                longitude: formData?.primaryAddress?.longitude,
                                                street: formData?.primaryAddress?.street,
                                                zip: formData?.primaryAddress?.zip,
                                            }
                                        }));
                                    } else {
                                        setSameAsPrimary(false)
                                        setValue('address2', '');
                                        setValue('zip2', '');
                                        setValue('street2', '');
                                        setMailingLatitude(null);
                                        setMailingLongitude(null);
                                        setFormData((prevState) => {
                                            const updatedState = { ...prevState };
                                            delete updatedState.mailingAddress; // Remove mailingAddress
                                            return updatedState;
                                        });
                                    }
                                }}
                            />
                        </Col>
                        <Col sm={6}>
                            <Row className='position-relative'>
                                <Col sm={12}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Address</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <Form.Control
                                                type="text"
                                                // defaultValue={updatePage ? clinicDataToUpdate?.mailingAddress?.address : ''}
                                                {...register('address2')}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, address: e.target.value });
                                                    getMailingGeolocation(e);
                                                    setMailingFocused(true); // Open dropdown on input
                                                }}
                                                readOnly={sameAsPrimary}
                                                onFocus={() => setMailingFocused(true)} // Open dropdown when the field is focused
                                                onBlur={() => {
                                                    setTimeout(() => setMailingFocused(false), 200); // Delay to allow selection before hiding dropdown
                                                }}
                                                placeholder="Search for mailing address"
                                                autoComplete="off"
                                            />
                                            {/* {/ Dropdown suggestions /} */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    width: '100%',
                                                    maxHeight: '150px',
                                                    overflow: 'auto',
                                                    zIndex: 111,
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #ced4da',
                                                    borderTop: 'none',
                                                }}
                                                className={`scroll-container hover-bg-change ${searchedMailingLocations?.length === 0 || !mailingFocused ? 'd-none' : ''}`}
                                            >
                                                {searchedMailingLocations?.map((data, index) => (
                                                    <p
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedMailingLocation(data)
                                                            setMailingFocused(false); // Close dropdown after selection
                                                        }}
                                                        style={{
                                                            margin: 0,
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                        }}
                                                        className="hover-bg-change text-black"
                                                    >
                                                        {data?.formatted}
                                                    </p>
                                                ))}
                                                {searchedMailingLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Latitude</Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={mailingLatitude}
                                            readOnly={sameAsPrimary}
                                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                            placeholder="Latitude"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Longitude</Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={mailingLongitude}
                                            readOnly={sameAsPrimary}
                                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                            placeholder="Longitude" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={6}>
                            <Row>
                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0' >State</Form.Label>
                                        {sameAsPrimary ?
                                            <Form.Control readOnly={sameAsPrimary} value={statesData?.states.find((data) => data?._id === formData?.primaryAddress?.state)?.name} />
                                            :
                                            <Form.Select
                                                {...register('state2')}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, state: e.target.value });
                                                    handleMailingStateSelection(e);
                                                }}
                                            >
                                                <option value=''>State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.id} // Unique key for each option
                                                        data-key={JSON.stringify({ id: data?.id, _id: data?._id })} // Store the key as a data attribute
                                                        value={data?._id}
                                                    >
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        }

                                    </Form.Group>

                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>City</Form.Label>
                                        {sameAsPrimary ?
                                            <Form.Control readOnly={sameAsPrimary} value={cities1 && cities1.find((data) => data?._id === formData?.primaryAddress?.city)?.name} />
                                            :
                                            <Form.Select
                                                disabled={store?.getCitiesReducer?.loading}
                                                {...register('city2')}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, city: e.target.value })
                                                }}
                                            >
                                                <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities2?.map((data) => (
                                                    <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        }
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Street</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...register('street2')}
                                            readOnly={sameAsPrimary}
                                            onKeyPress={handleFirstSpace}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            placeholder="Street" />

                                        {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Zip</Form.Label>
                                        <Form.Control
                                            readOnly={sameAsPrimary}
                                            // defaultValue={updatePage ? clinicDataToUpdate?.mailingAddress?.zip : ''}
                                            type="text"
                                            {...register('zip2', {
                                                minLength: {
                                                    value: 5,
                                                    message: 'ZIP code must be at least 5 characters long',
                                                },
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: 'ZIP code must contain numbers only',
                                                },
                                            })}
                                            onKeyPress={handleFirstSpace}
                                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                            placeholder="Zip"
                                            maxLength={5}
                                        />
                                        {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </div>

            <div className="col-12 mt-3">
                <div className="d-flex justify-content-end gap-2">
                    <Button className='custom-buttons'>Cancel</Button>
                    <Button className='custom-buttons'>Update</Button>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetails;
