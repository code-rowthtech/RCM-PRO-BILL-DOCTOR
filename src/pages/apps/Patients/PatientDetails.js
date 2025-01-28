import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom';
import { getPatientsByIdAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiUploadCloud } from 'react-icons/fi';
import { handleUpload } from "../../../helpers/HandleUpload";


const PatientDetails = () => {

    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, watch, getValues } = useForm();

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const store = useSelector((state) => state);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const logoFileInputRef = useRef(null);
    const [profileUploading, setProfileUploading] = useState(false);

    const patientsDataById = store?.getPatientsByIdReducer?.data?.patient || [];
    console.log(patientsDataById, 'data0987654321')

    useEffect(() => {
        const data = {
            id: id,
        }
        // console.log(data, 'dataaa123456789')
        dispatch(getPatientsByIdAction({ key: encryptMessage(data) }));
    }, [dispatch]);

    useEffect(() => {

        //   setSelectedDoctor(doctor);
        setValue('patientStatus', patientsDataById?.status);
        setValue('firstName', patientsDataById?.firstName);
        setValue('middleName', patientsDataById?.middleName);
        setValue('lastName', patientsDataById?.lastName);
        setValue('title', patientsDataById?.title);
        setValue('birthName', patientsDataById?.birthName);
        setValue('suffix', patientsDataById?.suffix);
        setValue('homePhone', patientsDataById?.homePhone
            ? patientsDataById?.homePhone.replace(/\D/g, '')
                .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                    p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`
                )
            : '');
        setValue('cellPhone', patientsDataById?.cellPhone
            ? patientsDataById?.cellPhone.replace(/\D/g, '')
                .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                    p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`
                )
            : '');
        setValue('officePhone', patientsDataById?.officePhone
            ? patientsDataById?.officePhone.replace(/\D/g, '')
                .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                    p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`
                )
            : '');
        setValue('email', patientsDataById?.email);
        setValue('alternateEmail', patientsDataById?.alternativeEmail);
        setValue('preferredCommunication', patientsDataById?.preferredCommunication);
        setValue('reminderLanguage', patientsDataById?.reminderLanguage);
        setValue('medicationHistoryConsent', patientsDataById?.medicationHistoryConsent);
        setValue('paymentProfile', patientsDataById?.paymentProfile);
        setValue('patientCopayAmount', patientsDataById?.patientCopayAmount);
        setValue(
            'followupDate',
            patientsDataById?.followupDate
                ? new Date(patientsDataById.followupDate).toISOString().split('T')[0] // Extract YYYY-MM-DD
                : ''
        );
        setValue('followupReason', patientsDataById?.followupReason);
        setLogo(patientsDataById?.patientChartPhoto?.url);
        setLogoName(patientsDataById?.patientChartPhoto?.fileName);


    }, [patientsDataById])

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setProfileUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
            clearErrors('profileImage')
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };

    return (
        <div>
            <Row>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Primary Provider</Form.Label>
                        <Form.Select>
                            <option value="1">Select Primary Provider</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">First Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter First Name'
                            {...register('firstName', { required: "First name is required" })}

                        />
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
                            <option hidden >Select status</option>
                            <option value="active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Inactive-Deceased">Inactive-Deceased</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>
                </Col>


                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Middle Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Middle Name'
                            {...register('middleName')}

                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Title</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Title'
                            {...register('title')}
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Last Name</Form.Label>
                        <Form.Control
                            type='text'
                            {...register('lastName')}
                            placeholder='Enter Last Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Previous Birth Name</Form.Label>
                        <Form.Control
                            type='text'
                            {...register('birthName')}

                            placeholder='Enter Previous Birth Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Suffix</Form.Label>
                        <Form.Control
                            type='text'
                            {...register('suffix')}
                            placeholder='Enter Previous Birth Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <div className="mb-1 d-flex flex-column position-relative">
                        <Form.Label className="mb-0">Patient Photo</Form.Label>
                        <div
                            onClick={() => logoFileInputRef.current.click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName || profileUploading ? '' : 'custom-form-fields'}`}
                            style={{ backgroundColor: '#e5f4ff' }}
                        >
                            {logoName
                                ? logoName.length > 25
                                    ? `${logoName.substring(0, 22)}...`
                                    : logoName
                                : profileUploading
                                    ? 'Uploading...'
                                    : 'Upload Patient Photo'}
                            <p className="mb-0">
                                <FiUploadCloud />
                            </p>
                        </div>
                        <Form.Control
                            type="file"
                            className="d-none  border-0"
                            {...register('profileImage', {})}
                            accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                            ref={logoFileInputRef}
                            onChange={handleFileChange}
                        />
                        {errors.profileImage && (
                            <span className="text-danger">{errors.profileImage.message}</span>
                        )}
                    </div>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Home Phone</Form.Label>
                        <Form.Control
                            type='text'
                            {...register('homePhone')}
                            placeholder='Enter Home Phone'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Cell Phone</Form.Label>
                        <Form.Control
                            type='text'
                            {...register('cellPhone')}
                            placeholder='Enter Cell Phone'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group>
                        <Form.Label className="mb-0">Preferred Communication</Form.Label>
                        <Form.Select
                            {...register('preferredCommunication')}
                            aria-label="Select Title"
                        >
                            <option hidden>Select Preferred Communication</option>
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
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Office Phone</Form.Label>
                        <Form.Control
                            type='text'
                            {...register('officePhone')}
                            placeholder='Enter Office Phone'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group>
                        <Form.Label className="mb-0">Reminder Language</Form.Label>
                        <Form.Select
                            {...register('reminderLanguage',
                            )}
                        >
                            <option hidden>Select Reminder Language</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Email</Form.Label>
                        <Form.Control
                            type='text'
                            {...register('email')}
                            placeholder='Enter Email'
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
                            <option hidden>Select Medication History Concent</option>
                            <option value={'true'}>Yes</option>
                            <option value={'false'}>No</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Alternate Email</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Alternate Email'
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
                            <option hidden>Select Payment Profile</option>
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
                        className='custom-buttons fs-6 d-flex align-items-center justify-content-center'
                        style={{ height: '30px', padding: '0 15px' }}
                    >
                        Save
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default PatientDetails