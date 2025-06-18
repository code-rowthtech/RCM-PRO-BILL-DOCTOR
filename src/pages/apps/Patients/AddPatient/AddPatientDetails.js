import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createPatientsAction } from '../../../../redux/patients/actions';
import { useForm, Controller } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { FiUploadCloud } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import us from '../../../../assets/images/flags/us.jpg';
import { useLocation, useSearchParams } from 'react-router-dom';

const AddPatientDetails = ({
    setSubmissionType,
    setVisibleReffering,
    setVisibleResponsible,
    visibleResponsible,
    visibleReferring,
}) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const patientStatus = watch('patientStatus'); // Watch selected option
    const [logo, setLogo] = useState(null);
    const location = useLocation();
    const [logoName, setLogoName] = useState('');
    const [deceasedDateTime, setDeceasedDateTime] = useState('');
    const logoFileInputRef = useRef(null);
    const [profileUploading, setProfileUploading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    // const [submissionType, setSubmissionType] = useState(null);
    const [age, setAge] = useState(null);
    const store = useSelector((state) => state);

    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const doctorName = JSON.parse(sessionStorage.getItem('hyper_user'))?.name?.text;
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;

    // Function to calculate approximate age from date of birth
    const calculateApproxAge = (dob) => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const today = new Date();

        const ageInMilliseconds = today - birthDate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // More accurate with leap years
        return ageInYears.toFixed(1); // Keep one decimal place
    };

    // Watch for dateOfBirth changes
    const dateOfBirth = watch('dateOfBirth');

    useEffect(() => {
        if (dateOfBirth) {
            const approxAge = calculateApproxAge(dateOfBirth);
            if (approxAge !== getValues('approxAge')) {
                setValue('approxAge', approxAge);
            }
        }
    }, [dateOfBirth, setValue, getValues]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setProfileUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
            clearErrors('profileImage');
        } catch (error) {}
    };

    useEffect(() => {
        setValue('primaryProvider', doctorName);
    }, [doctorName, setValue]);
    const [showCellPhone, setShowCellPhone] = useState(false);
    const [showOfficePhone, setShowOfficePhone] = useState(false);
    const [showAltEmail, setShowAltEmail] = useState(false);
    const formatPhone = (value) => {
        let rawValue = value.replace(/\D/g, '');
        if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);
        return rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
            if (p3) return `(${p1})${p2}-${p3}`;
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });
    };
    const renderPhoneField = (label, name, iconToggle) => (
        <div className="col-md-3 col-12 mb-2 ">
            <Form.Group className="mb-1 position-relative p">
                <Form.Label className="mb-0 d-flex justify-content-start gap-1 align-items-center">
                    {label}
                    {iconToggle}
                </Form.Label>
                <InputGroup>
                    <InputGroup.Text className="ps-3 pe-1 fw-bold text-black" style={{ height: '30px' }}>
                        &nbsp;&nbsp;+1
                    </InputGroup.Text>
                    <Controller
                        name={name}
                        control={control}
                        rules={
                            !id
                                ? {
                                      pattern: {
                                          value: /^\(\d{3}\)\d{3}-\d{4}$/,
                                          message: 'Format must be (XXX)XXX-XXXX',
                                      },
                                      maxLength: { value: 13, message: 'Max 13 characters' },
                                      minLength: { value: 13, message: 'Min 13 characters' },
                                  }
                                : {}
                        }
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                type="tel"
                                style={{ height: '30px' }}
                                placeholder="(XXX)XXX-XXXX"
                                maxLength={14}
                                value={value || ''}
                                onChange={(e) => {
                                    const formatted = formatPhone(e.target.value);
                                    onChange(formatted);
                                    clearErrors(name);
                                }}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                                }}
                                ref={ref}
                            />
                        )}
                    />
                </InputGroup>
                <div className="position-absolute" style={{ top: '48%', left: '1%' }}>
                    <img src={us} alt="country code flag" width={20} />
                </div>
            </Form.Group>
        </div>
    );

    const maxInputsReached = showCellPhone && showOfficePhone;

    const onSubmit = (data) => {
        const payload = {
            resourceType: 'Patient',
            active: true,
            photo: [
                {
                    contentType: logo?.type || 'image/jpeg',
                    url: logo?.url?.split('?')[0] || logo,
                    data: logo?.data || null,
                    hash: logo?.hash || null,
                    title: logoName || null,
                    creation: new Date(),
                },
            ],
            gender: data?.gender || '',
            birthDate: data?.dateOfBirth || '',
            approxAge: data?.approxAge || '0',
            followupDate: data?.followupDate || '',
            followupReason: data?.followupReason || '',
            patientCopayAmount: data?.patientCopayAmount || '0',
            preferredCommunication: data?.preferredCommunication || '',
            paymentProfile: data?.paymentProfile || '',
            reminderLanguage: data?.reminderLanguage || '',
            patientStatus: data?.patientStatus || '',
            deceasedBoolean: false,
            medicationHistoryConsent: data?.medicationHistoryConsent || false,
            doctorId: doctorId,
            clinicId: clinicId,
            responsibleParty: visibleResponsible, // Convert string to boolean
            refferingDoctor: visibleReferring,

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
                prefix: [data?.title || ''],
            },
        ];
        if (data?.previousBirthName) {
            payload.name.push({
                use: 'old', // Assuming 'old' or 'maiden' is appropriate for previous birth names
                text: data.previousBirthName,
                family: data.lastName || '', // Assuming the last name remains unchanged
                given: [data.firstName || '', data.middleName || ''].filter(Boolean),
                prefix: [], // Add any prefix if available
                suffix: [], // Add any suffix if available
                preferred: true, // Assuming this is the preferred name
                period: {
                    start: data?.previousBirthNameStartDate
                        ? new Date(data.previousBirthNameStartDate).toISOString()
                        : null,
                    end: data?.previousBirthNameEndDate ? new Date(data.previousBirthNameEndDate).toISOString() : null,
                },
            });
        }
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

    const handleResponsibleChange = (e) => {
        if (e === 'true') {
            setVisibleResponsible(true);
        } else {
            setVisibleResponsible(false);
        }
    };

    const handleReferringChange = (e) => {
        if (e === 'true') {
            setVisibleReffering(true);
        } else {
            setVisibleReffering(false);
        }
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
                                {...register('firstName', {
                                    required: 'First name is required',
                                    // minLength: {
                                    //     value: 3,
                                    //     message: 'First name must be at least 3 characters',
                                    // },
                                    // pattern: {
                                    //     value: /^[A-Za-z]{3,}$/, // At least 3 letters, no spaces or numbers
                                    //     message: 'Only alphabets are allowed, minimum 3 characters',
                                    // },
                                })}
                                onInput={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z]/g, ''))} // Prevent spaces/numbers while typing
                            />
                            {errors.firstName && (
                                <span className="text-danger err-font">{errors.firstName.message}</span>
                            )}
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
                                onInput={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z]/g, ''))} // Prevent spaces/numbers while typing
                            />
                            {errors.middleName && <span className="text-danger">{errors.middleName.message}</span>}
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
                                {...register('lastName', {
                                    required: 'Last Name is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Last name must be at least 3 characters',
                                    },
                                    pattern: {
                                        value: /^[A-Za-z]{3,}$/, // At least 3 letters, no spaces or numbers
                                        message: 'Only alphabets are allowed, minimum 3 characters',
                                    },
                                })}
                                onInput={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z]/g, ''))} // Prevent spaces/numbers while typing
                            />
                            {errors.lastName && <span className="text-danger err-font">{errors.lastName.message}</span>}
                        </Form.Group>
                    </div>
                    {renderPhoneField(
                        'Home Phone',
                        'homePhone',
                        !maxInputsReached && (
                            <span
                                className=" uil-plus-circle plusicon cursor-pointer"
                                onClick={() => {
                                    if (!showCellPhone) setShowCellPhone(true);
                                    else if (!showOfficePhone) setShowOfficePhone(true);
                                }}
                            />
                        )
                    )}

                    {showCellPhone &&
                        renderPhoneField(
                            'Cell Phone',
                            'cellPhone',
                            <span
                                className=" uil-minus-circle minusicon text-danger cursor-pointer"
                                onClick={() => setShowCellPhone(false)}
                            />
                        )}

                    {showOfficePhone &&
                        renderPhoneField(
                            'Office Phone',
                            'officePhone',
                            <span
                                className=" uil-minus-circle minusicon text-danger cursor-pointer"
                                onClick={() => setShowOfficePhone(false)}
                            />
                        )}

                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group>
                            <Form.Label className="mb-0 d-flex justify-content-start gap-1 align-items-center">
                                Email ID
                                {!showAltEmail && (
                                    <span
                                        className=" uil-plus-circle plusicon cursor-pointer"
                                        onClick={() => setShowAltEmail(true)}
                                    />
                                )}
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
                    {showAltEmail && (
                        <div className="col-md-3 col-12 mb-2">
                            <Form.Group>
                                <Form.Label className="mb-0 d-flex justify-content-between align-items-center">
                                    Alternate Email
                                    <span
                                        onClick={() => setShowAltEmail(false)}
                                        className=" uil-minus-circle minusicon text-danger cursor-pointer"></span>
                                </Form.Label>
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
                    )}

                    <Col md={3} className="mb-2">
                        <Form.Group>
                            <Form.Label className="mb-0">Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                {...register('dateOfBirth')}
                                onChange={(e) => {
                                    const calculatedAge = calculateAge(e.target.value);
                                    setValue('approxAge', calculatedAge);
                                }}
                                max={new Date().toISOString().split('T')[0]} // Restricts future dates
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Approx age (if DOB is unknown)</Form.Label>
                            <Form.Control type="text" placeholder="Approx. age" {...register('approxAge')} />
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
                            {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                        </Form.Group>
                    </div>
                </div>
                <hr className="my-1" />

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
                                className={`custom-file-upload justify-content-between cursor-pointer ${
                                    logoName || profileUploading ? '' : 'custom-form-fields'
                                }`}>
                                {logoName ? logoName : profileUploading ? 'Uploading...' : 'Upload Photo'}
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
                            {errors.profileImage && <span className="text-danger">{errors.profileImage.message}</span>}
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
                            <Form.Label className="mb-0">Suffix </Form.Label>
                            <Form.Control type="text" placeholder="Suffix" {...register('suffix')} />
                            {errors.suffix && <span className="text-danger">{errors.suffix.message}</span>}
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

                    {/* <div className="col-md-3 col-12">
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
                    </div> */}

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
                                <span className="text-danger">{errors.preferredCommunication.message}</span>
                            )}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Reminder Language</Form.Label>
                            <Form.Select {...register('reminderLanguage')} data-has-value={!!watch('reminderLanguage')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Responsible Party</Form.Label>
                            <Form.Select onChange={(e) => handleResponsibleChange(e.target.value)}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Referring Doctor</Form.Label>
                            <Form.Select onChange={(e) => handleReferringChange(e.target.value)}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </div>
                <hr className="mt-1" />
                <div className="row">
                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group className="responnsible-party-select">
                            <Form.Label className="mb-0">Primary Provider (Doctor Name)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={doctorName}
                                value={doctorName}
                                {...register('selectedDoctor')}
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
                                <option value="Insurance Out of Network">Insurance Out of Network</option>
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
                            {errors.followupDate && <span className="text-danger">{errors.followupDate.message}</span>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Follow Up Reason</Form.Label>
                            <Form.Control type="text" placeholder="Follow Up Reason" {...register('followupReason')} />
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
                        onClick={() => {
                            if (location.pathname !== '/apps/patients/add-new-patient') {
                                setSubmissionType('saveAndReset');
                            }
                        }}
                        disabled={store?.createPatientsReducer?.loading}
                        className="custom-buttons "
                        type="submit">
                        Save & Add Another
                    </Button>
                    <Button
                        onClick={() => {
                            if (location.pathname !== '/apps/patients/add-new-patient') {
                                setSubmissionType('saveAndNext');
                            }
                        }}
                        disabled={store?.createPatientsReducer?.loading}
                        className="custom-buttons "
                        style={{ width: '200px' }}
                        type="submit">
                        {store?.createPatientsReducer?.loading ? (
                            <Spinner color="white" className="spinner-border-sm" />
                        ) : (
                            'Save & Continue Editing'
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddPatientDetails;
