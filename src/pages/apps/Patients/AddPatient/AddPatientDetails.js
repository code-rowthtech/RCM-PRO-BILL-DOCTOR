import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { createPatientsAction } from '../../../../redux/patients/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';
import { FiUploadCloud } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import us from '../../../../assets/images/flags/us.jpg'

const AddPatientDetails = () => {

    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, watch, getValues } = useForm();
    const patientStatus = watch('patientStatus'); // Watch selected option
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [deceasedDateTime, setDeceasedDateTime] = useState('');
    const logoFileInputRef = useRef(null);
    const [profileUploading, setProfileUploading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [submissionType, setSubmissionType] = useState(null);
    const [age, setAge] = useState(null);
    const store = useSelector((state) => state);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const doctorName = JSON.parse(sessionStorage.getItem('hyper_user'))?.name?.text;
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;

    // Function to calculate approximate age from date of birth
    const calculateApproxAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Watch for dateOfBirth changes
    const dateOfBirth = watch("dateOfBirth");

    useEffect(() => {
        if (dateOfBirth) {
            const approxAge = calculateApproxAge(dateOfBirth);
            setValue("approxAge", approxAge);  // Dynamically update approxAge
        }
    }, [dateOfBirth, setValue]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setProfileUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
            clearErrors('profileImage');
        } catch (error) {
            console.error("File upload failed", error);
        }
    };

    useEffect(() => {
        setValue("primaryProvider", doctorName);
    }, [doctorName, setValue]);

    const onSubmit = (data) => {

        const payload = {
            resourceType: "Patient",
            active: true,
            photo: [
                {
                    contentType: logo?.type || 'image/jpeg',
                    url: logo?.url?.split('?')[0] || logo,
                    data: logo?.data || null, 
                    hash: logo?.hash || null, 
                    title: logoName || null,
                    creation: new Date()
                }
            ],
            gender: data?.gender || '',
            birthDate: data?.dateOfBirth || '',
            approxAge: data?.approxAge || '0',
            followupDate: data?.followupDate || '',
            followupReason: data?.followupReason || '',
            patientCopayAmount: data?.patientCopayAmount || '0',
            preferredCommunication: data?.preferredCommunication || '',
            paymentProfile: data?.paymentProfile || '',
            reminderLanguage: "en",
            patientStatus: data?.patientStatus || '',
            deceasedBoolean: false,
            medicationHistoryConsent: data?.medicationHistoryConsent || false,
            doctorId: doctorId,
            clinicId: clinicId,

            notes: data?.notes || '',
        };
        payload.name = [
            {
                given: [data?.firstName || '', data?.middleName || ''].filter(Boolean),
                family: data?.lastName || '',
                preferred: true,
                text: `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
                use: 'official',
                suffix: [data?.suffix || ''],
                prefix: [data?.prefix || ''],
            },
        ];
        payload.telecom = [];

        payload.telecom.push({
            system: 'phone',
            use: 'home',
            value: data?.homePhone || '',
        });

        payload.telecom.push({
            system: 'phone',
            use: 'mobile',
            value: data?.cellPhone || '',
        });

        payload.telecom.push({
            system: 'phone',
            use: 'work',
            value: data?.officePhone || '',
        });

        payload.telecom.push({
            system: 'email',
            use: 'mobile',
            value: data?.email || '',
        });

        payload.telecom.push({
            system: 'email',
            use: 'work',
            value: data?.alternateEmail || '',
        });
        if (data?.patientStatus === 'Inactive-Deceased') {
            payload.deceasedBoolean = true;

            if (data?.deceasedDateTime) {
                payload.deceasedDateTime = new Date(data.deceasedDateTime).toISOString();
            }
        }
        dispatch(createPatientsAction({ key: encryptMessage(payload) }));
        reset();
        setLogoName(null);
        setLogo(null);
        // console.log(payload, 'Final Payload ');
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        // Adjust if the current month/day is before the birth month/day
        if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
            years--;
            months += 12; // Add 12 months to the negative month difference
        }

        // Adjust the month difference for the day of the month
        if (today.getDate() < birthDate.getDate()) {
            months--;
        }

        // Ensure months is non-negative after adjustment
        if (months < 0) {
            months += 12;
        }

        return `${years}.${months}`;
    };

    return (
        <div>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div className="row mt-md-3">
                    <div className="col-md-3 col-12 ">
                        <Form.Group>
                            <Form.Label htmlFor="firstName" className="mb-0">
                                First Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                id="firstName"
                                type="text"
                                placeholder="First Name"
                                {...register('firstName', { required: 'First name is required' })}
                            />
                            {errors.firstName && (
                                <span className="text-danger">{errors.firstName.message}</span>
                            )}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="lastName" className="mb-0">
                                Last Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                id="lastName"
                                type="text"
                                placeholder="Last Name"
                                {...register('lastName', { required: 'Last Name is required' })}
                            />
                            {errors.lastName && (
                                <span className="text-danger">{errors.lastName.message}</span>
                            )}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">
                                Cell Phone <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text
                                        className="ps-3 pe-1 fw-bold text-black"
                                        style={{ height: '30px' }}>
                                        &nbsp;&nbsp;+1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        style={{ height: '30px!important' }}
                                        {...register(
                                            'cellPhone',
                                            {
                                                pattern: {
                                                    value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                    message:
                                                        'Contact must be in the format (XXX)XXX-XXXX',
                                                },
                                                maxLength: {
                                                    value: 13,
                                                    message: 'Contact must not exceed 13 digits',
                                                },
                                                minLength: {
                                                    value: 13,
                                                    message:
                                                        'Contact must not be less than 13 digits',
                                                },
                                            }
                                        )}
                                        onChange={(e) => {
                                            let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                                            if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                                            const formattedValue = rawValue.replace(
                                                /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                (match, p1, p2, p3) => {
                                                    if (p3) return `(${p1})${p2}-${p3}`;
                                                    if (p2) return `(${p1})${p2}`;
                                                    return `(${p1}`;
                                                }
                                            ); // Format dynamically as (XXX)XXX-XXXX
                                            e.target.value = formattedValue; // Update input value
                                            clearErrors('cellPhone'); // Clear validation errors
                                        }}
                                        placeholder="(XXX)XXX-XXXX"
                                        maxLength={14}
                                        onKeyPress={(event) => {
                                            // Only allow numeric characters (0-9)
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <div className="position-absolute " style={{ top: '48%', left: '1%' }}>
                                <img src={us} alt="country code flag" width={20} />
                            </div>
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group>
                            <Form.Label htmlFor="email" className="mb-0">
                                Email ID <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email ID"
                                {...register('email', {
                                    pattern: {
                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                        </Form.Group>
                    </div>
                    <Col md={3} className="mb-2">
                        <Form.Group>
                            <Form.Label className="mb-0">Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                {...register('dateOfBirth')}
                                onChange={(e) => {
                                    const calculatedAge = calculateAge(e.target.value);
                                    setAge(calculatedAge);
                                }}
                                max={new Date().toISOString().split('T')[0]} // Restricts future dates
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Approx age (if DOB is unknown)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Approx. age"
                                {...register('approxAge')}
                            />
                        </Form.Group>
                    </Col>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="gender" className="mb-0">
                                Gender
                            </Form.Label>
                            <Form.Select
                                id="gender"
                                {...register(
                                    'gender'
                                    //  { required: 'Gender is required' }
                                )}
                                data-has-value={!!watch('gender')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="unknown">Unknown</option>
                            </Form.Select>
                            {errors.gender && (
                                <span className="text-danger">{errors.gender.message}</span>
                            )}
                        </Form.Group>
                    </div>
                </div>
                <hr className="mt-0" />

                <div className="row">
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="patientstatus" className="mb-0">
                                Patient Status
                            </Form.Label>
                            <Form.Select
                                as="select" // Use 'select' to make it a dropdown
                                id="patientstatus"
                                {...register('patientStatus')}
                                data-has-value={!!watch('patientStatus')}>
                                <option value="" hidden>
                                    Select
                                </option>{' '}
                                {/* Default option */}
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Inactive-Deceased">Inactive-Deceased</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    {/* Show Date Input if "Inactive-Deceased" is selected */}
                    {patientStatus === 'Inactive-Deceased' && (
                        <div className="col-md-3 col-12">
                            <Form.Group>
                                <Form.Label htmlFor="deceasedDateTime" className="mb-0">
                                    Deceased Date
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    id="deceasedDateTime"
                                    {...register('deceasedDateTime')}
                                    value={deceasedDateTime}
                                    onChange={(e) => setDeceasedDateTime(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    )}
                    <div className="col-md-3 col-12">
                        <div className="mb-2 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Patient Photo</Form.Label>
                            <div
                                onClick={() => logoFileInputRef.current.click()}
                                style={{ height: '30px' }}
                                className={`custom-file-upload justify-content-between cursor-pointer ${logoName || profileUploading ? '' : 'custom-form-fields'
                                    }`}>
                                {logoName
                                    ? logoName
                                    : profileUploading
                                        ? 'Uploading...'
                                        : 'Upload Photo'}
                                <p className="mb-0">
                                    <FiUploadCloud />
                                </p>
                            </div>
                            <Form.Control
                                type="file"
                                className="d-none "
                                style={{ height: '30px!important' }}
                                {...register('profileImage', {})}
                                accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                                ref={logoFileInputRef}
                                onChange={handleFileChange}
                            />
                            {errors.profileImage && (
                                <span className="text-danger">{errors.profileImage.message}</span>
                            )}
                        </div>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group>
                            <Form.Label htmlFor="title" className="mb-0">
                                Title
                            </Form.Label>
                            <Form.Select
                                {...register('title')}
                                data-has-value={!!watch('title')}
                                aria-label="Select Title">
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group>
                            <Form.Label htmlFor="middleName" className="mb-0">
                                Middle Name
                            </Form.Label>
                            <Form.Control
                                id="middleName"
                                type="text"
                                placeholder="Middle Name"
                                {...register('middleName')}
                            />
                            {errors.middleName && (
                                <span className="text-danger">{errors.middleName.message}</span>
                            )}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group>
                            <Form.Label className="mb-0">Suffix </Form.Label>
                            <Form.Control type="text" placeholder="Suffix" {...register('suffix')} />
                            {errors.suffix && (
                                <span className="text-danger">{errors.suffix.message}</span>
                            )}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Previous Birth Name </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Previous Birth Name"
                                {...register('previousBirthName')}
                            />
                            {errors.previousBirthName && (
                                <span className="text-danger">{errors.previousBirthName.message}</span>
                            )}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">Home Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text
                                        className="ps-3 pe-1 fw-bold text-black"
                                        style={{ height: '30px' }}>
                                        &nbsp;&nbsp;+1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        style={{ height: '30px!important' }}
                                        {...register(
                                            'homePhone',
                                            {
                                                pattern: {
                                                    value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                    message:
                                                        'Contact must be in the format (XXX)XXX-XXXX',
                                                },
                                                maxLength: {
                                                    value: 13,
                                                    message: 'Contact must not exceed 13 digits',
                                                },
                                                minLength: {
                                                    value: 13,
                                                    message:
                                                        'Contact must not be less than 13 digits',
                                                },
                                            }

                                        )}
                                        onChange={(e) => {
                                            let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                                            if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                                            const formattedValue = rawValue.replace(
                                                /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                (match, p1, p2, p3) => {
                                                    if (p3) return `(${p1})${p2}-${p3}`;
                                                    if (p2) return `(${p1})${p2}`;
                                                    return `(${p1}`;
                                                }
                                            ); // Format dynamically as (XXX)XXX-XXXX
                                            e.target.value = formattedValue; // Update input value
                                            clearErrors('homePhone'); // Clear validation errors
                                        }}
                                        placeholder="(XXX)XXX-XXXX"
                                        maxLength={14}
                                        onKeyPress={(event) => {
                                            // Only allow numeric characters (0-9)
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <div className="position-absolute" style={{ top: '48%', left: '1%' }}>
                                <img src={us} alt="country code flag" width={20} />
                            </div>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Alternate Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Alternate Email ID"
                                {...register('alternateEmail', {
                                    pattern: {
                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">Office Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text
                                        className="ps-3 pe-1 fw-bold text-black"
                                        style={{ height: '30px' }}>
                                        &nbsp;&nbsp;+1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        style={{ height: '30px!important' }}
                                        {...register(
                                            'officePhone',
                                            {
                                                pattern: {
                                                    value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                    message:
                                                        'Contact must be in the format (XXX)XXX-XXXX',
                                                },
                                                maxLength: {
                                                    value: 13,
                                                    message: 'Contact must not exceed 13 digits',
                                                },
                                                minLength: {
                                                    value: 13,
                                                    message:
                                                        'Contact must not be less than 13 digits',
                                                },
                                            }
                                        )}
                                        onChange={(e) => {
                                            let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                                            if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                                            const formattedValue = rawValue.replace(
                                                /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                (match, p1, p2, p3) => {
                                                    if (p3) return `(${p1})${p2}-${p3}`;
                                                    if (p2) return `(${p1})${p2}`;
                                                    return `(${p1}`;
                                                }
                                            ); // Format dynamically as (XXX)XXX-XXXX
                                            e.target.value = formattedValue; // Update input value
                                            clearErrors('officePhone'); // Clear validation errors
                                        }}
                                        placeholder="(XXX)XXX-XXXX"
                                        maxLength={14}
                                        onKeyPress={(event) => {
                                            // Only allow numeric characters (0-9)
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <div className="position-absolute " style={{ top: '48%', left: '1%' }}>
                                <img src={us} alt="country code flag" width={20} />
                            </div>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Preferred Communication</Form.Label>
                            <Form.Select
                                {...register('preferredCommunication')}
                                data-has-value={!!watch('preferredCommunication')}
                                aria-label="Select Title">
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="Home Phone">Home Phone</option>
                                <option value="Work Phone">Work Phone</option>
                                <option value="Cell Phone">Cell Phone</option>
                                <option value="Email">Email</option>
                                <option value="Text Message">Text Message</option>
                                <option value="Declined">Declined</option>
                                <option value="Snail Mail">Snail Mail</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.preferredCommunication && (
                                <span className="text-danger">
                                    {errors.preferredCommunication.message}
                                </span>
                            )}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Reminder Language</Form.Label>
                            <Form.Select
                                {...register('reminderLanguage')}
                                data-has-value={!!watch('reminderLanguage')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </div>
                <hr className="mt-2" />
                <div className="row">
                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group className="responnsible-party-select">
                            <Form.Label className="mb-0">Primary Provider (Doctor Name)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={doctorName}
                                value={doctorName}
                                {...register('selectedDoctor',)}
                                data-has-value={!!watch('selectedDoctor')}
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Medication History Concent</Form.Label>
                            <Form.Select
                                {...register('medicationHistoryConsent')}
                                data-has-value={!!watch('medicationHistoryConsent')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value={'true'}>Yes</option>
                                <option value={'false'}>No</option>
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Payment Profile</Form.Label>
                            <Form.Select
                                {...register('paymentProfile')}
                                aria-label="Payment Profile"
                                data-has-value={!!watch('paymentProfile')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="Cash">Cash</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Insurance Out of Network">
                                    Insurance Out of Network
                                </option>
                                <option value="Auto Accident">Auto Accident</option>
                                <option value="Worker's Comp">Worker's Comp</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.paymentProfile && (
                                <span className="text-danger">{errors.paymentProfile.message}</span>
                            )}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Patient's Copay (in $)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Patient's Copay"
                                {...register('patientCopayAmount', {
                                    pattern: {
                                        value: /^[0-9]+(\.[0-9]+)?$/,
                                        message: 'Only numbers or decimals are allowed',
                                    },
                                })}
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="DOB" className="mb-0">
                                Follow Up Date
                            </Form.Label>
                            <Form.Control
                                type="date" // Change type to "date" for date input
                                placeholder="Follow Up Date"
                                {...register('followupDate')}
                            />
                            {errors.followupDate && (
                                <span className="text-danger">{errors.followupDate.message}</span>
                            )}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Follow Up Reason</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Follow Up Reason"
                                {...register('followupReason')}
                            />
                        </Form.Group>
                    </div>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2 justify-content-end mb-2 mt-md-4">
                    <Button
                        className="cancel-button"
                        onClick={() => {
                            reset();
                            setSelectedDoctor(null);
                            setLogo(null);
                            setLogoName(null);
                        }}>
                        Clear
                    </Button>
                    <Button
                        onClick={() => setSubmissionType('saveAndReset')}
                        disabled={
                            store?.createPatientsReducer?.loading ||
                            store?.updatePatientsReducer?.loading
                        }
                        className="custom-buttons "
                        type="submit">
                        Save & Add Another
                    </Button>
                    <Button
                        onClick={() => {
                            setSubmissionType('saveAndNext');
                        }}
                        disabled={
                            store?.createPatientsReducer?.loading ||
                            store?.updatePatientsReducer?.loading
                        }
                        className="custom-buttons "
                        type="submit">
                        Save & Continue Editing
                    </Button>
                    {/* <Button
                                        onClick={() => setSubmissionType('saveOnly')}
                                        disabled={
                                            store?.createPatientsReducer?.loading ||
                                            store?.updatePatientsReducer?.loading
                                        }
                                        className="custom-buttons "
                                        type="submit">
                                        Save
                                    </Button> */}
                </div>
            </Form>

        </div>
    )
}

export default AddPatientDetails