import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getDoctorsAction, updateDoctorAction } from '../../redux/doctors/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import IdentifierForm from '../apps/Common Pages/IdentifierForm';
import { handleUpload } from '../../helpers/HandleUpload';
import Select from 'react-select';
import { qualificationsData } from '../../utils/DataSets/qualificationsData';
import { FiUploadCloud } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { encryptMessage } from '../../cryptoUtils';
import DoctorIdentifierForm from './DoctorIdentifiers';
import AsyncSelect from 'react-select/async';
import { taxonomyOptions as taxonomy } from '../../utils/DataSets/commonDataSet';

const ProfessionalInformation = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        clearErrors,
        setValue,
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [showCAQHPassword, setShowCAQHPassword] = useState(false);
    const [degreeUploading, setDegreeUploading] = useState(false);
    const defaultIdentifiers = [
        {
            label: 'National Provider Identifier (NPI)',
            value: 'http://hl7.org/fhir/sid/us-npi',
            code: 'NPI',
        },
    ];
    const [constantIdentifiers, setConstantIdentifiers] = useState([]);
    const [identifiers, setIdentifiers] = useState([]);
    const [licensure, setLicensure] = useState([]);
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [taxonmy, setTaxonomy] = useState(null);
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const updateLoading = store?.UpdateDoctorsReducer?.loading;

    console.log(doctorDetails, 'doctorDetails');

    const updateId = store?.getDoctorsReducer?.data?.result?._id;
    console.log(doctorDetails, '123456789');
    const statesData = store?.getStatesReducer?.data?.states;

    const [taxonomyCodesList, setTaxonomyCodesList] = useState([
        { type: 'primary', code: '', state: '', licenseNumber: '', status: '' },
    ]);
    const defaultLicensure = [
        {
            label: '',
            value: '',
            code: '',
        },
    ];
    useEffect(() => {
        dispatch(getDoctorsAction());
    }, [dispatch]);
    const handleTaxonomyChange = (selectedOption, index) => {
        const updatedList = [...taxonomyCodesList];
        updatedList[index] = {
            ...updatedList[index],
            code: selectedOption?.value || '',
            displayName: selectedOption?.label || '',
        };
        setTaxonomyCodesList(updatedList);
    };
    const [qualifications, setQualifications] = useState([
        { id: 1, degreeName: '', degreeFile: null, issuerOrganisation: '' },
    ]);
    const degreeFileInputRef = useRef(null);
    // Add a new qualification
    const addQualification = () => {
        const newQualification = {
            id: qualifications.length + 1,
            degreeName: '',
            degreeFile: null,
            issuerOrganisation: '',
        };
        setQualifications([...qualifications, newQualification]);
    };

    // Remove a qualification by its ID, but ensure the first row is not deleted
    const removeQualification = (id) => {
        if (qualifications.length > 1) {
            // Ensure at least one row remains
            const updatedQualifications = qualifications.filter((qual) => qual.id !== id);
            setQualifications(updatedQualifications);
        }
    };

    // Handle changes in qualification fields
    const handleQualificationChange = (index, field, value) => {
        const updatedQualifications = qualifications.map((qual, i) =>
            i === index ? { ...qual, [field]: field === 'degreeName' ? value?.data : value } : qual
        );
        setQualifications(updatedQualifications);
    };

    // Handle file upload for degree
    const handleFileChangeDegree = async (index, event) => {
        const file = event.target.files[0];
        try {
            const url = await handleUpload(file, setDegreeUploading);
            const fileName = file.name;
            handleQualificationChange(index, 'degreeFile', { url: url?.url, fileName });
        } catch (error) {}
    };

    useEffect(() => {
        setConstantIdentifiers(
            defaultIdentifiers.map((type) => ({
                type,
                number: '',
                file: '',
                expiry: '',
                issuingAuthority: '',
                use: '',
            }))
        );
    }, []);

    const submitData = (data) => {
        const qualificationData = qualifications?.map((item) => ({
            code: item?.degreeName,
            documents: item?.degreeFile,
            issuer: item?.issuerOrganisation,
        }));
        let finalIdentifiersData = [];
        if (identifiers) {
            identifiers.forEach((element) => {
                let data = {
                    expiry: element?.expiry,
                    file: element?.file,
                    value: element?.number,
                    use: 'official',
                    system: element?.type?.value,
                    type: {
                        coding: [
                            {
                                system: element?.type?.value,
                                code: element?.type?.code,
                                display: element?.type?.label,
                            },
                        ],
                        text: element?.type?.label,
                    },
                    issuingAuthority: element?.issuingAuthority,
                    status: element?.status,
                    ennumerationDate: element?.ennumerationDate,
                };
                finalIdentifiersData.push(data);
            });
        }
        let finalLicensureData = [];
        if (licensure) {
            licensure.forEach((element) => {
                let licensureData = {
                    expiry: element?.expiry,
                    file: element?.file,
                    value: element?.number,
                    use: 'official',
                    system: element?.type?.value,
                    type: {
                        coding: [
                            {
                                system: element?.type?.value,
                                code: element?.type?.code,
                                display: element?.type?.label,
                            },
                        ],
                        text: element?.type?.label,
                    },
                    issuingAuthority: element?.issuingAuthority,
                    licenseState: element?.licenseState,
                    status: element?.status,
                    ennumerationDate: element?.ennumerationDate,
                };
                finalLicensureData.push(licensureData);
            });
        }
        const taxonomyCodes = taxonomyCodesList?.map((item) => ({
            type: item?.type,
            code: item?.code?.code, // Taxonomy code
            Grouping: item?.code?.grouping, // Taxonomy grouping
            Classification: item?.code?.classification, // Taxonomy classification
            Specialization: item?.code?.specialization, // Taxonomy specialization
            Definition: item?.code?.definition, // Taxonomy definition
            Notes: item?.code?.notes, // Taxonomy notes
            displayName: item?.code?.displayName, // Taxonomy display name
            section: item?.code?.section, // Taxonomy section
            state: item?.state, // Taxonomy state
            licenseNumber: item?.licenseNumber, // Taxonomy license number
            status: item?.status === 'active' ? true : false, // Taxonomy sta
        }));
        const payload = {
            doctorId: updateId,
            identifier: [...finalIdentifiersData, ...finalLicensureData],
            taxonomy: taxonomyCodes,
        };
        console.log(payload, 'payload');
        dispatch(updateDoctorAction({ key: encryptMessage(payload) }));
    };
    useEffect(() => {
        if (doctorDetails) {
            const updatedTaxonomyCodes = doctorDetails?.taxonomy?.map((item, index) => ({
                type: item?.type || '',
                displayName: item?.displayName || '',
                code: { code: item?.code, grouping: item?.Grouping, classification: item?.Classification } || {},
                state: item?.state || '',
                licenseNumber: item?.licenseNumber || '',
                status: item?.status === true ? 'active' : 'inactive' || '',
            }));
            setTaxonomyCodesList(updatedTaxonomyCodes);
        }
    }, [doctorDetails, setValue]);

    const QualificationOptions = qualificationsData?.map((qualification) => ({
        value: qualification.code,
        label: qualification.display,
        data: qualification, // Store full object for later use
    }));
    const formattedTaxonomyOptions = taxonomy.map((option) => ({
        value: option,
        label: option.code + ' - ' + option.displayName,
    }));

    const addTaxonomyCode = () => {
        setTaxonomyCodesList([
            ...taxonomyCodesList,
            {
                type: '',
                code: '',
                Grouping: '',
                Classification: '',
                Specialization: '',
                Definition: '',
                Notes: '',
                displayName: '',
                section: '',
                state: '',
                licenseNumber: '',
                status: '',
            },
        ]);
    };
    const selectedTaxonomyOption =
        formattedTaxonomyOptions.find((option) => option?.value?.displayName === taxonomy?.text) ||
        formattedTaxonomyOptions.find((option) => option?.displayName === taxonomy);
    const loadTaxonomyOptions = (inputValue, callback) => {
        if (!inputValue) {
            callback(formattedTaxonomyOptions.slice(0, 10));
            return;
        }
        const filteredOptions = formattedTaxonomyOptions.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions.slice(0, 20)); // Return up to 20 results on search
    };
    const removeTaxonomyItem = (index) => {
        setTaxonomyCodesList((prev) => prev.filter((_, i) => i !== index));
    };
    return (
        <div className="container-fluid px-0">
            <Form onSubmit={handleSubmit(submitData)}>
                {store?.getDoctorsReducer?.loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '75vh' }}>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <Row>
                            <Col sm={12}>
                                <DoctorIdentifierForm
                                    defaultIdentifiers={defaultIdentifiers}
                                    defaultLicensure={defaultLicensure}
                                    identifiers={identifiers}
                                    setIdentifiers={setIdentifiers}
                                    licensure={licensure}
                                    setLicensure={setLicensure}
                                />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col sm={12}>
                                <h5>
                                    Taxonomy Codes
                                    <span
                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                        onClick={addTaxonomyCode}></span>
                                </h5>
                            </Col>
                            {taxonomyCodesList?.map((data, index) => (
                                <Row key={index} className="mb-2">
                                    <Col sm={3}>
                                        <Form.Label className="mb-0">Code</Form.Label>
                                        <AsyncSelect
                                            loadOptions={loadTaxonomyOptions}
                                            defaultOptions={formattedTaxonomyOptions.slice(0, 10)}
                                            isSearchable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="&nbsp; Select"
                                            value={
                                                formattedTaxonomyOptions.find((opt) => opt.value === data.code) ||
                                                formattedTaxonomyOptions.find(
                                                    (opt) => opt.value.code === data.code.code
                                                )
                                            }
                                            onChange={(selected) => handleTaxonomyChange(selected, index)}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: '0px',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',
                                                    paddingBottom: '5px',
                                                }),
                                            }}
                                        />
                                    </Col>

                                    <Col sm={3}>
                                        <Form.Label className="mb-0">License Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="License Number"
                                            value={data.licenseNumber}
                                            onChange={(e) => {
                                                const updatedList = [...taxonomyCodesList];
                                                updatedList[index].licenseNumber = e.target.value.toUpperCase();
                                                setTaxonomyCodesList(updatedList);
                                            }}
                                            maxLength={10}
                                        />
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Label className="mb-0">Type</Form.Label>
                                        <Form.Select
                                            value={data.type || 'primary'}
                                            onChange={(e) => {
                                                const updatedList = [...taxonomyCodesList];
                                                updatedList[index].type = e.target.value;
                                                setTaxonomyCodesList(updatedList);
                                            }}>
                                            <option value="">Select</option>
                                            <option value="primary">Primary</option>
                                            <option value="secondary">Secondary</option>
                                        </Form.Select>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Label className="mb-0">State</Form.Label>
                                        <Form.Select
                                            value={data.state}
                                            onChange={(e) => {
                                                const updatedList = [...taxonomyCodesList];
                                                updatedList[index].state = e.target.value;
                                                setTaxonomyCodesList(updatedList);
                                            }}>
                                            <option value="">Select State</option>
                                            {statesData?.map((state, idx) => (
                                                <option key={idx} value={state?.name}>
                                                    {state?.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col sm={3} className="position-relative">
                                        <Form.Label className="mb-0">Status</Form.Label>
                                        <Form.Select
                                            value={data.status}
                                            onChange={(e) => {
                                                const updatedList = [...taxonomyCodesList];
                                                updatedList[index].status = e.target.value;
                                                setTaxonomyCodesList(updatedList);
                                            }}>
                                            <option value="" hidden>
                                                Select Status
                                            </option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </Form.Select>

                                        {/* Minus icon, aligned to the right */}
                                        {index > 0 && (
                                            <span
                                                className="text-danger cursor-pointer fs-5 fw-bold position-absolute"
                                                style={{ right: '-5px', top: '50%',  }}
                                                onClick={() => removeTaxonomyItem(index)}>
                                                <CiCircleMinus />
                                            </span>
                                        )}
                                    </Col>

                                    {taxonomyCodesList?.length >= 1 && index < taxonomyCodesList?.length - 1 && (
                                        <hr className="mt-2" />
                                    )}
                                </Row>
                            ))}
                        </Row>

                        <div className="d-flex justify-content-end gap-2 my-1">
                            <Button className="cancel-button">Cancel</Button>

                            <Button
                                className="custom-buttons"
                                style={{ width: '70px' }}
                                type="submit"
                                disabled={updateLoading}>
                                {updateLoading ? <Spinner color="white" className="spinner-border-sm" /> : 'Update'}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
};

export default ProfessionalInformation;
