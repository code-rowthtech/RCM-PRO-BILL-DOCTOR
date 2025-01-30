import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { createPatientsAction } from '../../../../redux/patients/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';
import { FiUploadCloud } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import us from '../../../../assets/images/flags/us.jpg'

const AddPatientDetails = () => {

    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors } = useForm();
    const [logo, setLogo] = useState(null);
    console.log(logo)
    const [logoName, setLogoName] = useState('');
    const logoFileInputRef = useRef(null);
    const [profileUploading, setProfileUploading] = useState(false);

    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const primaryProvider = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId
    const doctorName = JSON.parse(sessionStorage.getItem('hyper_user'))?.firstName

    // console.log(primaryProvider, 'primaryProvider')

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setProfileUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
            clearErrors('profileImage')
        } catch (error) {
        }
    };

    useEffect(() => {
        setValue("primaryProvider", doctorName);
    }, [doctorName, setValue]);

    const onSubmit = (data) => {
        const payload = {
            clinicId: clinicId,
            doctorId: primaryProvider,
            ...(data?.patientStatus ? { status: data?.patientStatus } : {}),
            ...(data?.title ? { title: data?.title } : {}),
            ...(data?.firstName ? { firstName: data?.firstName } : {}),
            ...(data?.middleName ? { middleName: data?.middleName } : {}),
            ...(data?.lastName ? { lastName: data?.lastName } : {}),
            ...(data?.birthName ? { birthName: data?.birthName } : {}),
            ...(data?.dateOfBirth ? { dateOfBirth: data?.dateOfBirth } : {}),
            ...(data?.suffix ? { suffix: data?.suffix } : {}),
            ...(logo?.url === null
                ? {}
                : {
                    patientChartPhoto: {
                        url: logo?.url?.split('?')[0],
                        fileName: logoName
                    }
                }),
            ...(data?.homePhone ? { homePhone: data?.homePhone?.replace(/\D/g, '') } : {}),
            ...(data?.cellPhone ? { cellPhone: data?.cellPhone?.replace(/\D/g, '') } : {}),
            ...(data?.officePhone ? { officePhone: data?.officePhone?.replace(/\D/g, '') } : {}),
            ...(data?.email ? { email: data?.email } : {}),
            ...(data?.alternateEmail ? { alternativeEmail: data?.alternateEmail } : {}),
            ...(data?.preferredCommunication ? { preferredCommunication: data?.preferredCommunication } : {}),
            ...(data?.reminderLanguage ? { reminderLanguage: data?.reminderLanguage } : {}),
            ...(data?.medicationHistoryConsent ? { medicationHistoryConsent: data?.medicationHistoryConsent === 'true' ? true : false } : {}),
            ...(data?.paymentProfile ? { paymentProfile: data?.paymentProfile } : {}),
            ...(data?.patientCopayAmount ? { patientCopayAmount: data?.patientCopayAmount } : {}),
            ...(data?.followupDate ? { followupDate: data?.followupDate } : {}),
            ...(data?.followupReason ? { followupReason: data?.followupReason } : {}),
        }

        dispatch(createPatientsAction({ key: encryptMessage(payload) }))
        reset();
        setLogoName(null);
        setLogo(null);
        console.log(payload, 'payloadpayloadpayload')
    };

    return (
        <div>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Row className='w-100 px-0 mx-0'>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label htmlFor="firstName" className="mb-0">First Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    id="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    {...register('firstName', { required: "First name is required" })}
                                />
                                {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label htmlFor="lastName" className="mb-0">Last Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    id="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    {...register('lastName', { required: 'Last Name is required' })}
                                />
                                {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-1 position-relative">
                                <Form.Label className='mb-0'>Cell Phone <span className="text-danger">*</span></Form.Label>
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Text className='ps-3 pe-1 fw-bold text-black' style={{ height: '30px' }}>&nbsp;&nbsp;+1</InputGroup.Text>
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
                                                    message: 'Contact must not exceed 13 digits'
                                                },
                                                minLength: {
                                                    value: 13,
                                                    message: 'Contact must not be less than 13 digits'
                                                }
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

                                <div
                                    className='position-absolute ' style={{ top: '48%', left: '1%' }}
                                >
                                    <img
                                        src={us}
                                        alt="country code flag"
                                        width={20} />
                                </div>


                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-0">Date of Birth <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('dateOfBirth')}
                                // onChange={(e) => {
                                //     const calculatedAge = calculateAge(e.target.value);
                                //     setAge(calculatedAge);
                                // }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <hr className='my-2' />
                    <Col sm={3}>
                        <Form.Group className="mb-1" controlId="templateSelect">
                            <Form.Label className="mb-0">Primary Provider</Form.Label>
                            <Form.Control
                                id="primaryProvider"
                                type="text"
                                {...register("primaryProvider")}
                                value={doctorName} // Ensures the value is displayed
                                readOnly // Prevent user modification
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3} className='mb-1'>
                        <Form.Group>
                            <Form.Label htmlFor="title" className="mb-0">Title</Form.Label>
                            <Form.Select
                                {...register('title')}
                                aria-label="Select Title"
                            >
                                <option hidden value=''>Select Title</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label htmlFor="middleName" className="mb-0">Middle Name</Form.Label>
                            <Form.Control
                                id="middleName"
                                type="text"
                                placeholder="Middle Name"
                                {...register('middleName')}
                            />
                            {errors.middleName && <span className="text-danger">{errors.middleName.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label htmlFor="patientstatus" className="mb-0">Status</Form.Label>
                            <Form.Select
                                as="select"  // Use 'select' to make it a dropdown
                                id="patientstatus"
                                {...register('patientStatus')}
                            >
                                <option hidden value=''>Select status</option>  {/* Default option */}
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Inactive-Deceased">Inactive-Deceased</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Previous Birth Name </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Previous Birth Name"
                                {...register('birthName')}
                            />
                            {errors.birthName && <span className="text-danger">{errors.birthName.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Suffix </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Suffix"
                                {...register('suffix')}
                            />
                            {errors.suffix && <span className="text-danger">{errors.suffix.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <div className="mb-1 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Patient Photo</Form.Label>
                            <div
                                onClick={() => logoFileInputRef.current.click()}
                                style={{ height: '30px', backgroundColor: '#e5f4ff' }}
                                className={`custom-file-upload justify-content-between cursor-pointer ${logoName || profileUploading ? '' : 'custom-form-fields'}`}
                            >
                                {logoName ? logoName : profileUploading ? 'Uploading...' : 'Upload Patient Photo'}
                                <p className="mb-0">
                                    <FiUploadCloud />
                                </p>
                            </div>
                            <Form.Control
                                type="file"
                                className="d-none "
                                style={{ height: '30px!important' }}
                                {...register('profileImage', {
                                })}
                                accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                                ref={logoFileInputRef}
                                onChange={handleFileChange}

                            />
                            {errors.profileImage && (<span className="text-danger">{errors.profileImage.message}</span>
                            )}
                        </div>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className='mb-0'>Home Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className='ps-3 pe-1 fw-bold text-black' style={{ height: '30px' }}>&nbsp;&nbsp;+1</InputGroup.Text>
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
                                                message: 'Contact must not exceed 13 digits'
                                            },
                                            minLength: {
                                                value: 13,
                                                message: 'Contact must not be less than 13 digits'
                                            }
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
                            <div className='position-absolute' style={{ top: '48%', left: '1%' }}>
                                <img
                                    src={us}
                                    alt="country code flag"
                                    width={20} />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className='mb-0'>Office Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className='ps-3 pe-1 fw-bold text-black' style={{ height: '30px' }}>&nbsp;&nbsp;+1</InputGroup.Text>
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
                                                message: 'Contact must not exceed 13 digits'
                                            },
                                            minLength: {
                                                value: 13,
                                                message: 'Contact must not be less than 13 digits'
                                            }
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

                            <div
                                className='position-absolute ' style={{ top: '48%', left: '1%' }}
                            >
                                <img
                                    src={us}
                                    alt="country code flag"
                                    width={20} />
                            </div>


                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Preferred Communication</Form.Label>
                            <Form.Select
                                {...register('preferredCommunication')}
                                aria-label="Select Title"
                            >
                                <option hidden value=''>Select Preferred Communication</option>
                                <option value="Home Phone">Home Phone</option>
                                <option value="Work Phone">Work Phone</option>
                                <option value="Cell Phone">Cell Phone</option>
                                <option value="Email">Email</option>
                                <option value="Text Message">Text Message</option>
                                <option value="Declined">Declined</option>
                                <option value="Snail Mail">Snail Mail</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.preferredCommunication && <span className="text-danger">{errors.preferredCommunication.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Reminder Language</Form.Label>
                            <Form.Select
                                {...register('reminderLanguage',
                                )}
                            >
                                <option hidden value=''>Select Reminder Language</option>
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label htmlFor="email" className="mb-0">Email ID</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email ID"
                                {...register('email', { pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" } })}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Medication History Concent</Form.Label>
                            <Form.Select
                                {...register('medicationHistoryConsent',
                                )}
                            >
                                <option hidden value=''>Select Medication History Concent</option>
                                <option value={'true'}>Yes</option>
                                <option value={'false'}>No</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Alternate Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Alternate Email ID"
                                {...register('alternateEmail', {
                                    pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" }
                                })}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Payment Profile</Form.Label>
                            <Form.Select
                                {...register('paymentProfile')}
                                aria-label="Payment Profile"
                            >
                                <option hidden value=''>Select Payment Profile</option>
                                <option value="Cash">Cash</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Insurance Out of Network">Insurance Out of Network</option>
                                <option value="Auto Accident">Auto Accident</option>
                                <option value="Worker's Comp">Worker's Comp</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.paymentProfile && <span className="text-danger">{errors.paymentProfile.message}</span>}
                        </Form.Group>
                    </Col>
                    {/* <Col sm={3}>
                        <Form.Group className="mb-1" controlId="templateSelect">
                            <Form.Label className="mb-0">Patient Chart Photo</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter Patient Chart Photo'
                            />
                        </Form.Group>
                    </Col> */}
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Patient's Copay (in $)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Patient's Copay"
                                {...register('patientCopayAmount', {
                                    pattern: {
                                        value: /^[0-9]+(\.[0-9]+)?$/,
                                        message: 'Only numbers or decimals are allowed'
                                    }
                                })}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label htmlFor="DOB" className="mb-0">Follow Up Date</Form.Label>
                            <Form.Control
                                type="date"  // Change type to "date" for date input
                                placeholder="Follow Up Date"
                                {...register('followupDate')}
                            />
                            {errors.followupDate && <span className="text-danger">{errors.followupDate.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Follow Up Reason</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Follow Up Reason"
                                {...register('followupReason')}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} className='d-flex justify-content-end mb-2'>
                        <Button
                            // variant='success'
                            className='custom-buttons d-flex align-items-center justify-content-center'
                            type='submit'
                        >
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>

        </div>
    )
}

export default AddPatientDetails