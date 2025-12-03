import React, { useEffect, useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { handleFirstSpace } from '../../helpers/noSpace';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { handleUpload } from '../../helpers/HandleUpload';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getDoctorsAction, updateDoctorAction } from '../../redux/doctors/actions';
import { useForm } from 'react-hook-form';
import us from '../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../cryptoUtils';
import DoctorAddress from './DoctorAddress';

const PersonalDetails = ({ setActiveTab }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
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
    const store = useSelector((state) => state);
    const updateId = store?.getDoctorsReducer?.data?.result?._id;
    const updateLoading = store?.UpdateDoctorsReducer?.loading;
    const password = watch('password');
    const [logoUploading, setLogoUploading] = useState(false);
    const dispatch = useDispatch();
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const [personalAddresses, setPersonalAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
    const [shouldNavigateNext, setShouldNavigateNext] = useState(false);
    const updateSuccess = store?.UpdateDoctorsReducer?.success;

    useEffect(() => {
        dispatch(getDoctorsAction());
    }, [dispatch]);

    useEffect(() => {
        if (updateSuccess && shouldNavigateNext && setActiveTab) {
            setActiveTab('professionalInformation');
            setShouldNavigateNext(false);
        }
    }, [updateSuccess, shouldNavigateNext, setActiveTab]);

    useEffect(() => {
        setValue('firstName', doctorDetails?.name?.[0]?.given);
        setValue('lastName', doctorDetails?.name?.[0]?.family);
        setValue('email', doctorDetails?.userId?.email);
        setValue('phone', doctorDetails?.telecom?.[0]?.value
            ? doctorDetails?.telecom?.[0]?.value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                    p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`)
            : '');
        setValue('gender', doctorDetails?.userId?.gender);
        setValue('department', doctorDetails?.departmentId?._id);
        if (doctorDetails?.address) {
            setPersonalAddresses(doctorDetails.address);
        }
        if (doctorDetails?.photo) {
            setLogoName(doctorDetails.photo?.[0]?.title);
        }
        const formattedDateOfBirth = doctorDetails?.userId?.dob
            ? new Date(doctorDetails?.userId?.dob).toISOString().split('T')[0]
            : '';
        setValue('dateOfBirth', formattedDateOfBirth);
        setValue('password', '********');
        setValue('confirmPassword', '********');
        setValue('specialist', doctorDetails?.specialties?.[0]);
    }, [doctorDetails, setValue]);

    const submitData = (data, shouldNavigate = false) => {
        const payload = {
            doctorId: updateId,
            email: data?.email,
            ...(!updateId ? { password: data?.password } : {}),
            dob: data?.dateOfBirth,
            gender: data?.gender,
            name: {
                use: 'official',
                text: `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
                family: data?.lastName,
                given: data?.firstName,
            },
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
            telecom: [
                {
                    system: 'phone',
                    value: data?.phone,
                    use: 'work',
                },
                {
                    system: 'email',
                    value: data?.email,
                    use: 'work',
                },
            ],
            address: personalAddresses,
            specialties: [data?.specialist],
        };
        if (shouldNavigate) {
            setShouldNavigateNext(true);
        }
        dispatch(updateDoctorAction({ key: encryptMessage(payload) }));
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setLogo(url);
            setLogoName(selectedFile?.name);
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };

    return (
        <div className="container-fluid px-0">
            <div className="col-12 mt-1">
                <Form onSubmit={handleSubmit(submitData)}>
                    {store?.getDoctorsReducer?.loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '75vh' }}>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-md-6 col-lg-3 col-sm-6  col-12">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            onKeyDown={(event) => handleFirstSpace(event, 5)}
                                            {...register('firstName', {
                                                required: 'First name is required',
                                                pattern: {
                                                    value: /^[a-zA-Z]{3,}$/,
                                                    message:
                                                        'First name must contain only letters and be at least 3 characters long',
                                                },
                                            })}
                                            onChange={(e) => {
                                                clearErrors('firstName');
                                                setFormData({ ...formData, firstName: e.target.value });
                                            }}
                                            placeholder="Enter first name"
                                        />
                                        {errors.firstName && (
                                            <span className="text-danger">{errors.firstName.message}</span>
                                        )}
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            onKeyDown={(event) => handleFirstSpace(event, 5)}
                                            {...register('lastName', {
                                                required: 'Last name is required',
                                                pattern: {
                                                    value: /^[a-zA-Z]{3,}$/,
                                                    message:
                                                        'Last name must contain only letters and be at least 3 characters long',
                                                },
                                            })}
                                            onChange={(e) => {
                                                clearErrors('lastName');
                                                setFormData({ ...formData, lastName: e.target.value });
                                            }}
                                            placeholder="Enter last name"
                                        />
                                        {errors.lastName && (
                                            <span className="text-danger">{errors.lastName.message}</span>
                                        )}
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                    <div className="mb-1">
                                        <Form.Group className="mb-0 position-relative">
                                            <Form.Label className="mb-0">Phone</Form.Label>
                                            <Form.Group>
                                                <InputGroup>
                                                    <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                                        <img src={us} alt="country code flag" width={16} />
                                                        +1
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="tel"
                                                        {...register('phone', {
                                                            required: 'This field is required',
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
                                                            let rawValue = e.target.value.replace(/\D/g, '');
                                                            if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);
                                                            const formattedValue = rawValue.replace(
                                                                /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                                (match, p1, p2, p3) => {
                                                                    if (p3) return `(${p1})${p2}-${p3}`;
                                                                    if (p2) return `(${p1})${p2}`;
                                                                    return `(${p1}`;
                                                                }
                                                            );
                                                            e.target.value = formattedValue;
                                                            clearErrors('phone');
                                                        }}
                                                        placeholder="1234-234-234"
                                                        maxLength={14}
                                                        onKeyPress={(event) => {
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                </InputGroup>
                                                {errors.phone && (
                                                    <span className="text-danger">{errors.phone.message}</span>
                                                )}
                                            </Form.Group>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Date of Birth</Form.Label>
                                        <Form.Control
                                            type="date"
                                            className="form-control"
                                            max={new Date().toISOString().split('T')[0]}
                                            {...register('dateOfBirth', {
                                                required: 'Date of birth is required',
                                                validate: (value) => {
                                                    const selectedDate = new Date(value);
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);
                                                    return (
                                                        selectedDate <= today || 'Date of birth cannot be in the future'
                                                    );
                                                },
                                            })}
                                            onChange={(e) => {
                                                clearErrors('dateOfBirth');
                                                setFormData({ ...formData, dateOfBirth: e.target.value });
                                            }}
                                        />
                                        {errors.dateOfBirth && (
                                            <span className="text-danger">{errors.dateOfBirth.message}</span>
                                        )}
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 col-lg-3 col-sm-6 col-12 ">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Enter a valid email address',
                                                },
                                            })}
                                            onChange={(e) => {
                                                clearErrors('email');
                                                setFormData({ ...formData, email: e.target.value });
                                            }}
                                            placeholder="Enter email"
                                        />
                                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Gender</Form.Label>
                                        <Form.Select
                                            as="select"
                                            data-has-value={!!watch('gender')}
                                            {...register('gender', { required: 'Gender is required' })}
                                            onChange={(e) => {
                                                clearErrors('gender');
                                                setFormData((prev) => ({ ...prev, gender: e.target.value }));
                                            }}
                                            className="custom-select form-control">
                                            <option value="" hidden>
                                                Select Gender
                                            </option>
                                            {['Male', 'Female', 'Other']?.map((gender, i) => (
                                                <option value={gender} key={i}>{gender}</option>
                                            ))}
                                        </Form.Select>
                                        {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Password</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                defaultValue={updateId ? '*********' : ''}
                                                onCopy={(e) => e.preventDefault()}
                                                onCut={(e) => e.preventDefault()}
                                                placeholder={'Password'}
                                                readOnly={updateId}
                                                onChange={(e) => {
                                                    clearErrors('password');
                                                    setFormData({ ...formData, password: e.target.value });
                                                }}
                                                {...register('password')}
                                            />
                                            <span
                                                className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                    <Form.Group className="mb-1 ">
                                        <Form.Label className="mb-0">Confirm Password </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm Password"
                                                onCopy={(e) => e.preventDefault()}
                                                onCut={(e) => e.preventDefault()}
                                                onChange={(e) => {
                                                    clearErrors('confirmPassword');
                                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                                }}
                                                {...register('confirmPassword')}
                                            />
                                            <span
                                                className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 col-12 ">
                                    <div className="mb-1 d-flex flex-column position-relative">
                                        <Form.Label className="mb-0">Profile Image</Form.Label>
                                        <div
                                            onClick={() => logoFileInputRef.current.click()}
                                            className={`custom-file-upload justify-content-between cursor-pointer form-control ${logoName || logoUploading ? '' : 'custom-form-fields'
                                                }`}>
                                            {logoName
                                                ? logoName
                                                : logoUploading
                                                    ? 'Uploading...'
                                                    : 'Upload Profile Image'}
                                            <p className="mb-0">
                                                <FiUploadCloud />
                                            </p>
                                        </div>
                                        <Form.Control
                                            type="file"
                                            className="d-none "
                                            {...register('profileImage', {})}
                                            accept=".png, .jpg, .jpeg, .svg"
                                            ref={logoFileInputRef}
                                            onChange={handleFileChange}
                                        />
                                        {errors.profileImage && (
                                            <p className="text-danger">{errors.profileImage.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-3 col-12">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">Specialist </Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...register('specialist')}
                                            onChange={(e) => {
                                                clearErrors('specialist');
                                            }}
                                            placeholder="Enter Specialist Name"
                                        />
                                    </Form.Group>
                                </div>
                                <hr className="my-1" />
                                <DoctorAddress
                                    addresses={personalAddresses}
                                    setAddresses={setPersonalAddresses}
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        className="custom-buttons"
                                        style={{ width: "70px" }}
                                        onClick={handleSubmit((data) => submitData(data, false))}
                                        disabled={updateLoading}>
                                        {updateLoading ? (
                                            <Spinner color="white" className="spinner-border-sm" />
                                        ) : (
                                            'Update'
                                        )}
                                    </Button>
                                    <Button
                                        className="custom-buttons"
                                        style={{ width: "120px" }}
                                        onClick={handleSubmit((data) => submitData(data, true))}
                                        disabled={updateLoading}>
                                        {updateLoading ? (
                                            <Spinner color="white" className="spinner-border-sm" />
                                        ) : (
                                            'Update & Next'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default PersonalDetails;
