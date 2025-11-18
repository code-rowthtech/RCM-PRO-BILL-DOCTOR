import { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { updatePatientsAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiUploadCloud } from 'react-icons/fi';
import { handleUpload } from '../../../../../helpers/HandleUpload';
import Spinner from '../../../../../constants/Spinner';
import us from '../../../../../assets/images/flags/us.jpg';
import { loggedInUser } from '../../../../../helpers/loggedInUser';
import { calculateAge, formatDateToISO, formatPhone } from '../../../../../helpers/helperFunctions';

const PatientDetails = () => {
    const dispatch = useDispatch();
    const {
        register, handleSubmit, watch,
        formState: { errors }, setValue, clearErrors, getValues
    } = useForm();

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const store = useSelector((state) => state);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const logoFileInputRef = useRef(null);
    const patientStatus = watch('patientStatus'); // Watch selected option
    const [deceasedDateTime, setDeceasedDateTime] = useState('');
    const [profileUploading, setProfileUploading] = useState(false);
    const doctorName = loggedInUser?.name?.text;
    const patientsDataById = store?.getPatientsByIdReducer?.data?.data;

    useEffect(() => {
        setValue('primaryProvider', doctorName);
    }, [doctorName, setValue]);

    const gender = watch('gender');
    const title = watch('title');

    useEffect(() => {
        if (!patientsDataById) return;
        const telecom = patientsDataById.telecom || [];
        const name = patientsDataById.name || [];
        const fieldsToSet = {
            patientStatus: patientsDataById.patientStatus || '',
            firstName: name?.[0]?.given?.[0] || '',
            middleName: name?.[0]?.given?.[1] || '',
            lastName: name?.[0]?.family || '',
            suffix: name?.[0]?.suffix?.[0] || '',
            title: name?.[0]?.prefix?.[0] || '',
            previousBirthName: name?.[1]?.text || '',
            approxAge: patientsDataById.approxAge || '',
            gender: patientsDataById.gender || '',
            dateOfBirth: formatDateToISO(patientsDataById.birthDate),
            followupDate: formatDateToISO(patientsDataById.followupDate),
            followupReason: patientsDataById.followupReason || '',
            birthName: patientsDataById.birthName || '',
            email: telecom?.[3]?.value || '',
            alternateEmail: telecom?.[4]?.value || '',
            preferredCommunication: patientsDataById.preferredCommunication || '',
            reminderLanguage: patientsDataById.reminderLanguage || '',
            medicationHistoryConsent: patientsDataById.medicationHistoryConsent ?? false,
            paymentProfile: patientsDataById.paymentProfile || '',
            patientCopayAmount: patientsDataById.patientCopayAmount || '',
            homePhone: formatPhone(telecom?.[0]?.value),
            cellPhone: formatPhone(telecom?.[1]?.value),
            officePhone: formatPhone(telecom?.[2]?.value),
        };

        Object.entries(fieldsToSet).forEach(([key, value]) => {
            setValue(key, value);
        });

        setLogo(patientsDataById?.photo?.[0]?.url || '');
        setLogoName(patientsDataById?.photo?.[0]?.title || '');
    }, [patientsDataById]);


    const onSubmit = (data) => {
        const payload = {
            id,
            birthDate: data?.dateOfBirth || '',
            approxAge: data?.approxAge || '0',
            followupDate: data?.followupDate || '',
            gender: data?.gender || '',
            followupReason: data?.followupReason || '',
            medicationHistoryConsent: data?.medicationHistoryConsent ?? false,
            patientCopayAmount: data?.patientCopayAmount || '0',
            paymentProfile: data?.paymentProfile || '',
            preferredCommunication: data?.preferredCommunication || '',
            reminderLanguage: data?.reminderLanguage || '',
            patientStatus: data?.patientStatus || '',
            name: [
                {
                    given: [data?.firstName, data?.middleName].filter(Boolean),
                    family: data?.lastName || '',
                    preferred: true,
                    text: `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
                    use: 'official',
                    suffix: [data?.suffix || ''],
                    prefix: [data?.title || ''],
                },
            ],
            telecom: [
                { system: 'phone', use: 'home', value: data?.homePhone || '' },
                { system: 'phone', use: 'mobile', value: data?.cellPhone || '' },
                { system: 'phone', use: 'work', value: data?.officePhone || '' },
                { system: 'email', use: 'mobile', value: data?.email || '' },
                { system: 'email', use: 'work', value: data?.alternateEmail || '' },
            ].filter((t) => t.value), // Remove empty telecom entries
        };

        // Add previous birth name if present
        if (data?.previousBirthName) {
            payload.name.push({
                use: 'old',
                text: data.previousBirthName,
                family: data.lastName || '',
                given: [data.firstName, data.middleName].filter(Boolean),
                period: {
                    start: data.previousBirthNameStartDate
                        ? new Date(data.previousBirthNameStartDate).toISOString()
                        : null,
                    end: data.previousBirthNameEndDate
                        ? new Date(data.previousBirthNameEndDate).toISOString()
                        : null,
                },
            });
        }

        // Add photo if available
        if (logo?.url) {
            payload.photo = [
                {
                    contentType: logo?.fileType || 'image/jpeg',
                    url: logo.url.split('?')[0],
                    data: logo?.base64,
                    hash: logo?.hash || '',
                    title: logoName || '',
                    creation: new Date().toISOString(),
                },
            ];
        }

        // Handle deceased flag
        if (data?.patientStatus === 'Inactive-Deceased') {
            payload.deceasedBoolean = true;
            if (data?.deceasedDateTime) {
                payload.deceasedDateTime = new Date(data.deceasedDateTime).toISOString();
            }
        }

        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };

    useEffect(() => {
        const currentTitle = getValues('title');
        if (!currentTitle || ['Mr.', 'Mrs.', 'Miss'].includes(currentTitle)) {
            if (gender === 'male') setValue('title', 'Mr.');
            else if (gender === 'female') setValue('title', 'Miss');
            else if (gender === 'other') setValue('title', 'Other');
            else if (gender === 'unknown') setValue('title', '');
        }
    }, [gender, title, setValue, getValues]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setProfileUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
            clearErrors('profileImage');
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };


    return (
        <Form autoComplete="off" className='h-100' onSubmit={handleSubmit(onSubmit)}>
            <div className='scroll-container px-2' style={{ height: '90%' }}>
                <div className="row ">
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
                                        value: /^[\p{L}'’-]{3,}$/u,
                                        message: 'Only letters (including accents), apostrophes, and hyphens are allowed. Minimum 3 characters, no spaces.',
                                    }

                                })}
                                onInput={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z]/g, ''))} // Prevent spaces/numbers while typing
                            />
                            {errors.lastName && (
                                <span className="text-danger err-font">{errors.lastName.message}</span>
                            )}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">Home Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                        <img src={us} alt="country code flag" width={16} />
                                        +1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        style={{ height: '30px!important' }}
                                        {...register('homePhone', {
                                            pattern: {
                                                value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                message: 'Contact must be in the format (XXX)XXX-XXXX',
                                            },
                                            maxLength: {
                                                value: 13,
                                                message: 'Contact must not exceed 13 digits',
                                            },
                                            minLength: {
                                                value: 13,
                                                message: 'Contact must not be less than 13 digits',
                                            },
                                        })}
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
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">
                                Cell Phone <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                        <img src={us} alt="country code flag" width={16} />
                                        +1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        style={{ height: '30px!important' }}
                                        {...register('cellPhone', {
                                            pattern: {
                                                value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                message: 'Contact must be in the format (XXX)XXX-XXXX',
                                            },
                                            maxLength: {
                                                value: 13,
                                                message: 'Contact must not exceed 13 digits',
                                            },
                                            minLength: {
                                                value: 13,
                                                message: 'Contact must not be less than 13 digits',
                                            },
                                        })}
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
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">Office Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                        <img src={us} alt="country code flag" width={16} />
                                        +1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        style={{ height: '30px!important' }}
                                        {...register('officePhone', {
                                            pattern: {
                                                value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                message: 'Contact must be in the format (XXX)XXX-XXXX',
                                            },
                                            maxLength: {
                                                value: 13,
                                                message: 'Contact must not exceed 13 digits',
                                            },
                                            minLength: {
                                                value: 13,
                                                message: 'Contact must not be less than 13 digits',
                                            },
                                        })}
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
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12 mb-2">
                        <Form.Group>
                            <Form.Label htmlFor="email" className="mb-0">
                                Email <span className="text-danger">*</span>
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
                    <Col md={3} className="mb-2">
                        <Form.Group>
                            <Form.Label className="mb-0">Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                data-has-value={!!watch('dateOfBirth')}
                                {...register('dateOfBirth')}
                                onChange={(e) => {
                                    const dob = e.target.value;
                                    const calculatedAge = calculateAge(dob);
                                    setValue('approxAge', calculatedAge); // update the form field
                                }}
                                max={new Date().toISOString().split('T')[0]} // Restricts future dates
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Approx age</Form.Label>
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
                                )}
                                data-has-value={!!watch('gender')}
                                defaultValue=""
                                className="form-select text-capitalize"
                            >
                                <option value="" disabled  >
                                    Select
                                </option>
                                {['male', 'female', 'other', 'unknown']?.map((gendder, index) => (
                                    <option className='text-capitalize' value={gendder} key={index}>{gendder}</option>
                                ))}
                            </Form.Select>
                            {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                        </Form.Group>
                    </div>
                </div>
                <hr className="mt-2" />

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
                                <option value="">Select Status</option> {/* Default option */}
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Inactive-Deceased">Inactive-Deceased</option>
                                <option value="Inactive-In Collections">Inactive-In Collections</option>
                                <option value="Inactive-Terminated">Inactive-Terminated</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <div className="mb-2 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Patient Photo</Form.Label>
                            <div
                                onClick={() => logoFileInputRef.current.click()}
                                style={{ height: '30px' }}
                                className={`custom-file-upload justify-content-between cursor-pointer ${logoName || profileUploading ? '' : 'custom-form-fields'
                                    }`}>
                                {logoName ? logoName : profileUploading ? 'Uploading...' : 'Upload Patient Photo'}
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
                                {["Mr.", "Mrs.", "Miss", "Dr.", "Other"]?.sort((a, b) => a.localeCompare(b))?.map((title, index) => (
                                    <option value={title} key={index}>{title}</option>
                                ))}
                            </Form.Select>
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
                            <Form.Label className="mb-0">Preferred Language</Form.Label>
                            <Form.Select
                                {...register('reminderLanguage')}
                                data-has-value={!!watch('reminderLanguage')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="English">English</option>
                                <option value="French">French</option>
                                <option value="Spanish">Spanish</option>
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
                            <Form.Label className="mb-0">Financial Class</Form.Label>
                            <Form.Select
                                {...register('paymentProfile')}
                                aria-label="Financial Class"
                                data-has-value={!!watch('paymentProfile')}>
                                <option value="" hidden>
                                    Select Financial Class
                                </option>
                                {["Cash", "Insurance", "Insurance Out of Network", "Auto Accident", "Worker's Comp", "Other"]?.sort((a, b) => a.localeCompare(b))?.map((paymentProf, index) => (
                                    <option selected={paymentProf === 'Cash'} value={paymentProf} key={index}>{paymentProf}</option>
                                ))}
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
            </div>

            <div className="d-flex gap-2 justify-content-end mb-2 mt-md-2 pe-2">
                <Button
                    disabled={store?.updatePatientsReducer?.loading}
                    className="custom-buttons "
                    style={{ width: '70px' }}
                    type="submit">
                    {store?.updatePatientsReducer?.loading ? (
                        <Spinner color="white" className="spinner-border-sm" />
                    ) : (
                        '  Update'
                    )}
                </Button>
            </div>
        </Form>

    );
};

export default PatientDetails;
