import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { Button, Col, Form, Row, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import us from '../../../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../../../cryptoUtils';
import {
    getCities2Action,
    getCities3Action,
    getCitiesAction,
    getStatesByCountryAction,
    updatePatientsAction,
} from '../../../../../redux/actions';
import IdentifierForm from '../../../Common Pages/IdentifierForm';

import { dataList } from '../../../../../utils/DataSets/relations.data';
import AddressForm from '../../../Common Pages/AddressForm';
import Select from 'react-select';
import { genderIdentityOptions } from 'utils/DataSets/genderIdentities';
import { sexAssignedAtBirthOptions } from 'utils/DataSets/sex';
import { personalPronounsOptions } from 'utils/DataSets/personalPronouns';
import { raceOptions } from 'utils/DataSets/race.data';
import { ethnicityOptions } from 'utils/DataSets/enthnicity.data';
import { tribalEntitiesOptions } from 'utils/DataSets/tribalEntities';
import { sexParameterOptions } from 'utils/DataSets/SexParameterforClinicalUse';
import { maritalStatusOptions } from 'utils/DataSets/maritalStatus';

// Memoized select styles to prevent recreation on every render
const selectStyles = {
    control: (provided) => ({
        ...provided,
        color: 'black',
        fontWeight: 500,
        fontSize: '12px',
        backgroundColor: '#e8f0fe',
        border: 0,
        minHeight: '30px',
        height: '30px',
        boxShadow: 'none',
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 6px',
        height: '30px',
    }),
    input: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
        fontSize: '12px',
        color: 'black',
        fontWeight: 500,
    }),
    placeholder: (provided) => ({
        ...provided,
        fontSize: '12px',
        color: 'black',
        fontWeight: 500,
    }),
    singleValue: (provided) => ({
        ...provided,
        fontSize: '12px',
        color: 'black',
        fontWeight: 500,
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: '30px',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        padding: '0 6px',
    }),
};

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const Demographics = memo(({ patientId }) => {
    // Memoized selectors to prevent unnecessary re-renders
    const statesData = useSelector((state) => state?.getStatesReducer?.data);
    const cities1 = useSelector((state) => state?.getCitiesReducer?.cities1?.data?.cities);
    const cities2 = useSelector((state) => state?.getCitiesReducer?.cities2?.data?.cities);
    const cities3 = useSelector((state) => state?.getCitiesReducer?.cities3?.data?.cities);
    const patientDetails = useSelector((state) => state?.getPatientsByIdReducer?.data?.data || []);
    const isLoading = useSelector((state) => state?.updatePatientsReducer?.loading);
    const citiesLoading = useSelector((state) => state?.getCitiesReducer?.loading);

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        clearErrors,
        watch
    } = useForm();

    const [employerFocused, setEmployerFocused] = useState(false);
    const [searchedEmployerLocations, setSearchedEmployerLocations] = useState(null);
    const [primaryCitySearch, setPrimaryCitySearch] = useState(null);
    const [mailingCitySearch, setMailingCitySearch] = useState(null);
    const [employerCitySearch, setEmployerCitySearch] = useState(null);
    const [selectedEthnicity, setSelectedEthnicity] = useState(null);
    const [selectedTribe, setSelectedTribe] = useState(null);
    const [selectedRelationship, setSelectedRelationship] = useState(null);
    const [identifiers, setIdentifiers] = useState([]);
    const [rela, setRela] = useState(null);
    const [demographicAddresses, setDemographicAddresses] = useState([
        { type: 'physical', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);

    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    useEffect(() => {
        if (primaryCitySearch) {
            setValue('primaryCity', cities1 && cities1.find((data) => data?.name === primaryCitySearch)?.name);
        }
        if (mailingCitySearch) {
            setValue('mailingCity', cities2 && cities2.find((data) => data?.name === mailingCitySearch)?.name);
        }
        if (employerCitySearch) {
            setValue('employerCity', cities3 && cities3.find((data) => data?.name === employerCitySearch)?.name);
        }
    }, [primaryCitySearch, cities1, mailingCitySearch, cities2, employerCitySearch, cities3]);

    const formatPhoneNumber = useCallback((phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]})${match[2]}-${match[3]}`;
        }
        return phone;
    }, []);

    useEffect(() => {
        if (patientDetails && statesData) {
            setValue('patientStudentStatus', patientDetails?.patientStudentStatus);
            setValue('nationalIdNumber', patientDetails?.nationalIdNumber);
            setValue('notes', patientDetails?.notes);
            setValue('epsdtServices', patientDetails?.epsdtServices);
            setValue('epsdtReferralCondition', patientDetails?.epsdtReferralCondition);
            setValue('race', patientDetails?.race?.[0]?.display || '');
            setValue('raceSubcategories', patientDetails?.raceSubcategories);
            setValue('gender', patientDetails?.gender || '');
            setValue('genderIdentity', patientDetails?.genderIdentity?.[0]?.code || '');
            setValue('sexParameter', patientDetails?.sexParameterForClinicalUse?.[0]?.code || '');
            setValue('personalPronouns', patientDetails?.personalPronouns?.[0]?.code || '');
            setValue('preferredLanguage', patientDetails?.preferredCommunication || '');
            setValue('birthSex', patientDetails?.birthSex?.code || '');
            setValue('maritalStatus', patientDetails?.maritalStatus?.coding?.[0]?.display || '');
            // Set demographic values
            setSelectedEthnicity(patientDetails?.ethnicity?.[0] || null);
            setSelectedTribe(patientDetails?.tribalAffiliation?.[0] || null);
            // ✅ Emergency Contact Fix
            setValue('emergencyContactName', patientDetails?.contact?.[0]?.relationship?.[0]?.text || '');
            setValue('emergencyContactPhone', formatPhoneNumber(patientDetails?.contact?.[0]?.telecom?.[0]?.value));
            setSelectedRelationship(patientDetails?.contact?.[0]?.relationship?.[0]?.coding?.[0] || null);
            setRela(patientDetails?.contact?.[0]?.relationship?.[0]?.coding);
            // ✅ Employer Details Fix
            setValue('employerName', patientDetails?.employerDetails?.employerName || '');
            setValue('employmentStatus', patientDetails?.employerDetails?.employmentStatus || '');
            setValue('occupation', patientDetails?.employerDetails?.occupation || '');
            // ✅ Employer Address Fix
            setValue('employerCity', patientDetails?.employerDetails?.workLocation?.address?.city || '');
            setValue('employerStateName', patientDetails?.employerDetails?.workLocation?.address?.state || '');
            setValue('employerZip', patientDetails?.employerDetails?.workLocation?.address?.postalCode || '');
            setValue('employerPhone', formatPhoneNumber(patientDetails?.employerDetails?.employerPhone || ''));
            setValue('employerAddress', patientDetails?.employerDetails?.workLocation?.address?.line || '');
            const defaultIdentifiers = patientDetails?.identifier?.map((data, index) => ({
                expiry: data?.expiry ? new Date(data.expiry).toISOString().split('T')[0] : '',
                file: data?.file?.[0],
                issuingAuthority: data?.issuingAuthority,
                number: data?.value,
                system: data?.system,
                type: {
                    label: data?.type?.coding?.[0]?.display,
                    value: data?.type?.coding?.[0]?.system,
                    code: data?.type?.coding?.[0]?.code,
                },
            }));
            setIdentifiers(defaultIdentifiers || []);
            const newAddresses = patientDetails?.address?.map((addr) => ({
                type: addr.type || '',
                use: addr.use || '',
                line: addr.line && Array.isArray(addr.line) ? addr.line : [''],
                city: addr.city || '',
                state: addr.state || '',
                postalCode: addr.postalCode || '',
                country: addr.country || 'US',
            })) || [{ type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }];
            setDemographicAddresses(newAddresses);
            if (statesData?.states) {
                newAddresses.forEach((address) => {
                    const state = statesData.states.find((s) => s.name === address.state);
                    if (!state) return;
                    if (address.type === 'physical') {
                        dispatch(
                            getCitiesAction({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    } else if (address.type === 'postal') {
                        dispatch(
                            getCities2Action({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    } else {
                        dispatch(
                            getCities3Action({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    }
                });
            }
        }
    }, [patientDetails, statesData, setValue, formatPhoneNumber, setSelectedEthnicity, setSelectedTribe, setSelectedRelationship, setRela, setIdentifiers, setDemographicAddresses, dispatch]);

    useEffect(() => {
        if (statesData?.states?.length > 0 && patientDetails) {
            if (patientDetails?.address?.state) {
                setValue('primaryStateName', patientDetails?.address?.state);
                const stateCity1 = statesData?.states?.find(
                    (data) => data?.state_code === patientDetails?.address?.state
                )?.id;
                dispatch(
                    getCitiesAction({
                        state_code: stateCity1,
                        name: patientDetails?.address?.city || '',
                        limit: 25,
                        skip: '',
                    })
                );
            }
            if (patientDetails?.mailingAddress?.state) {
                setValue('mailingStateName', patientDetails?.mailingAddress?.state);
                const stateCity2 = statesData?.states?.find(
                    (data) => data?.state_code === patientDetails?.mailingAddress?.state
                )?.id;
                dispatch(
                    getCities2Action({
                        state_code: stateCity2,
                        name: patientDetails?.mailingAddress?.city || '',
                        limit: 25,
                        skip: '',
                    })
                );
            }
            if (patientDetails?.employerAddress?.state) {
                setValue('employerStateName', patientDetails?.employerAddress?.state);
                const stateCity3 = statesData?.states?.find(
                    (data) => data?.state_code === patientDetails?.employerAddress?.state
                )?.id;
                dispatch(
                    getCities3Action({
                        state_code: stateCity3,
                        name: patientDetails?.employerAddress?.city || '',
                        limit: 25,
                        skip: '',
                    })
                );
            }
        }
    }, [statesData, patientDetails, setValue, dispatch]);

    useEffect(() => {
        if (cities1?.length > 0 && patientDetails?.address?.city) {
            setPrimaryCitySearch(patientDetails?.address?.city);
        }
        if (cities2?.length > 0 && patientDetails?.mailingAddress?.city) {
            setMailingCitySearch(patientDetails?.mailingAddress?.city);
        }
        if (cities3?.length > 0 && patientDetails?.employerAddress?.city) {
            setEmployerCitySearch(patientDetails?.employerAddress?.city);
        }
    }, [cities1, cities2, cities3, patientDetails]);

    const onSubmit = useCallback((data) => {
        const selectedGenderIdentity = genderIdentityOptions.find((option) => option.value === data.genderIdentity);
        const selectedSexualOrientation = sexParameterOptions.find((option) => option.value === data.sexParameter);
        const selectedPersonalPronouns = personalPronounsOptions.find(
            (option) => option.value === data.personalPronouns
        );
        const selectedMaritalStatus = maritalStatusOptions.find((option) => option.show === data.maritalStatus);
        const selectedRaceOption = raceOptions.find((option) => option.display === data.race);
        const selectedBirthSex = sexAssignedAtBirthOptions.find((option) => option.value === data.birthSex);

        let finalIdentifiers = [];
        identifiers.forEach((element) => {
            const identifierData = {
                expiry: element?.expiry,
                file: element?.file,
                value: element?.number || element?.value,
                use: 'official',
                system: element?.type?.value || element?.system,
                type: {
                    coding: [
                        {
                            system: element?.type?.value || element?.system,
                            code: element?.type?.code || element?.type?.coding?.[0]?.code,
                            display: element?.type?.label || element?.type?.coding?.[0]?.display,
                        },
                    ],
                    text: element?.type?.label || element?.type?.coding?.[0]?.display,
                },
                issuingAuthority: element?.issuingAuthority,
            };
            finalIdentifiers.push(identifierData);
        });

        const payload = { id };

        if (selectedBirthSex) {
            payload.birthSex = {
                ...selectedBirthSex,
                code: selectedBirthSex?.value,
                display: selectedBirthSex?.label,
                system: selectedBirthSex?.system,
            };
        }
        if (data.gender) {
            payload.gender = data.gender;
        }
        if (selectedGenderIdentity) {
            payload.genderIdentity = [{
                ...selectedGenderIdentity,
                code: selectedGenderIdentity?.value,
                display: selectedGenderIdentity?.show,
                text: selectedGenderIdentity?.label,
            }];
        }

        if (selectedSexualOrientation) {
            payload.sexParameterForClinicalUse = [{
                ...selectedSexualOrientation,
                code: selectedSexualOrientation?.value,
                display: selectedSexualOrientation?.show,
                text: selectedSexualOrientation?.label,
                system: selectedSexualOrientation?.system,
            }];
        }

        if (selectedPersonalPronouns) {
            payload.personalPronouns = [{
                ...selectedPersonalPronouns,
                code: selectedPersonalPronouns?.value,
                display: selectedPersonalPronouns?.show,
                text: selectedPersonalPronouns?.label,
                system: selectedPersonalPronouns?.system,
            }];
        }

        if (selectedRaceOption) {
            payload.race = [{
                ...selectedRaceOption,
                code: selectedRaceOption?.code,
                display: selectedRaceOption?.display,
                text: selectedRaceOption?.display,
            }];
        }

        if (selectedEthnicity) {
            payload.ethnicity = [{
                ...selectedEthnicity,
                text: selectedEthnicity?.display,
            }];
        }

        if (selectedTribe) {
            payload.tribalAffiliation = [{
                ...selectedTribe,
                text: selectedTribe?.display,
            }];
        }

        if (selectedMaritalStatus) {
            payload.maritalStatus = {
                coding: [{
                    ...(selectedMaritalStatus.system && { system: selectedMaritalStatus.system }),
                    ...(selectedMaritalStatus.value && { code: selectedMaritalStatus.value }),
                    ...(selectedMaritalStatus.show && { display: selectedMaritalStatus.show })
                }],
                ...(selectedMaritalStatus.show && { text: selectedMaritalStatus.show })
            };
        }
        if (data?.preferredLanguage) {
            payload.preferredCommunication = data?.preferredLanguage;
        }
        if (data?.emergencyContactName || data?.emergencyContactPhone) {
            payload.contact = [{
                relationship: [{
                    coding: [selectedRelationship || rela],
                    text: data?.emergencyContactName,
                }],
                telecom: [{
                    system: 'phone',
                    value: data?.emergencyContactPhone?.replace(/\D/g, ''),
                    use: 'home',
                }],
            }];
        }

        const employerDetails = {};
        if (data?.employerName) employerDetails.employerName = data.employerName;
        if (data?.employerPhone) employerDetails.employerPhone = data.employerPhone.replace(/\D/g, '');
        if (data?.employmentStatus) employerDetails.employmentStatus = data.employmentStatus;
        if (data?.occupation) employerDetails.occupation = data.occupation;
        if (data?.employerAddress) {
            employerDetails.workLocation = {
                address: {
                    line: [data.employerAddress],
                    city: data?.employerCity,
                    state: data?.employerStateName,
                    postalCode: data?.employerZip,
                    country: 'United States',
                },
            };
        }
        if (Object.keys(employerDetails).length > 0) {
            payload.employerDetails = employerDetails;
        }

        if (finalIdentifiers.length > 0) {
            payload.identifier = finalIdentifiers;
        }

        const validAddresses = demographicAddresses?.filter(addr =>
            addr.line?.[0] || addr.city || addr.state || addr.postalCode
        );
        if (validAddresses?.length > 0) {
            payload.address = validAddresses;
        }

        if (data?.notes) {
            payload.notes = data.notes;
        }
        console.log(payload, 'payloadpayloadpayloadpayload');
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    }, [dispatch, id, identifiers, demographicAddresses, rela, selectedEthnicity, selectedTribe, selectedRelationship]);

    const getEmployerGeolocation = useCallback(
        debounce(async (addressToSearch) => {
            if (!addressToSearch || addressToSearch.length < 3) return;

            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                addressToSearch
            )}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setSearchedEmployerLocations(data?.results || []);
            } catch (error) {
                console.error('Failed to fetch geocode data:', error);
                setSearchedEmployerLocations([]);
            }
        }, 300),
        []
    );



    const formattedEthnicityOptions = useMemo(() =>
        ethnicityOptions?.sort((a, b) => a.display.localeCompare(b.display))?.map((ethnicity) => ({
            value: ethnicity,
            label: ethnicity.display,
        })) || [], []
    );

    const formattedTribleOptions = useMemo(() =>
        tribalEntitiesOptions?.sort((a, b) => a.display.localeCompare(b.display))?.map((tribal) => ({
            value: tribal,
            label: tribal.display,
        })) || [], []
    );

    const relationshipOption = useMemo(() =>
        dataList?.sort((a, b) => a.display.localeCompare(b.display))?.map((relation) => ({
            value: relation,
            label: relation.display,
        })) || [], []
    );

    const sortedGenderIdentityOptions = useMemo(() =>
        genderIdentityOptions?.sort((a, b) => a.show.localeCompare(b.show)) || [], []
    );

    const sortedRaceOptions = useMemo(() =>
        raceOptions?.sort((a, b) => a.display.localeCompare(b.display)) || [], []
    );

    const sortedLanguageOptions = useMemo(() =>
        ["English", "Chinese", "French", "Italian", "Japanese", "Spanish",
            "Portuguese", "Russian", "Castilian", "Other", "Unknown", "Declined to specify"]
            .sort((a, b) => a.localeCompare(b)), []
    );

    const handleEthnicityChange = useCallback((opt) => setSelectedEthnicity(opt?.value ?? null), []);
    const handleRelationChange = useCallback((opt) => {
        setSelectedRelationship(opt?.value ?? null);
        setRela(opt?.value ?? null);
    }, []);
    const handleTribalChange = useCallback((opt) => setSelectedTribe(opt?.value ?? null), []);

    // Get selected options for display
    const selectedEthnicityOption = useMemo(() =>
        formattedEthnicityOptions.find(opt =>
            opt.value?.code === selectedEthnicity?.code || opt.value?.display === selectedEthnicity?.display
        ) || null, [formattedEthnicityOptions, selectedEthnicity]
    );

    const selectedTribalOption = useMemo(() =>
        formattedTribleOptions.find(opt =>
            opt.value?.code === selectedTribe?.code || opt.value?.display === selectedTribe?.display
        ) || null, [formattedTribleOptions, selectedTribe]
    );

    const selectedRelationOption = useMemo(() =>
        relationshipOption.find(opt =>
            opt.value?.code === selectedRelationship?.code || opt.value?.display === selectedRelationship?.display
        ) || null, [relationshipOption, selectedRelationship]
    );
    return (
        <Form className="h-100" onSubmit={handleSubmit(onSubmit)}>
            <div className="scroll-container px-2" style={{ height: '90%' }}>
                <IdentifierForm
                    defaultIdentifiers={[
                        {
                            label: '',
                            value: '',
                            code: '',
                        }
                    ]}
                    identifiers={identifiers}
                    setIdentifiers={setIdentifiers}
                />
                <Row className='mt-1 pb-2'>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0" htmlFor="sex">Gender <span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                id="gender"
                                {...register('gender', { required: 'Gender is required' })}
                                isInvalid={!!errors.gender}
                                className='text-capitalize'
                            >
                                <option value="" hidden>
                                    Select Gender
                                </option>
                                {['female', 'male', 'other'].map((option, index) => (
                                    <option className='text-capitalize' key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.gender && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.gender.message}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0" htmlFor="genderIdentity">Gender Identity</Form.Label>
                            <Form.Select
                                id="genderIdentity"
                                {...register('genderIdentity')}
                                isInvalid={!!errors.genderIdentity}>
                                <option value="" hidden>Select</option>
                                {sortedGenderIdentityOptions.map((option) => (
                                    <option key={option?.value} value={option?.value}>
                                        {option?.show}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0" htmlFor="birthSex">Sex Assigned At Birth</Form.Label>
                            <Form.Select
                                id="birthSex"
                                {...register('birthSex')}
                                isInvalid={!!errors.birthSex}
                            >
                                <option value="" hidden>
                                    Select
                                </option>
                                {sexAssignedAtBirthOptions?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0" htmlFor="personalPronouns">Preferred Pronouns</Form.Label>
                            <Form.Select
                                id="personalPronouns"
                                {...register('personalPronouns')}
                                isInvalid={!!errors.personalPronouns}
                            >
                                <option value="" hidden>
                                    Select Pronouns
                                </option>
                                {personalPronounsOptions?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.show}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="pb-2">
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0" htmlFor="race">Race</Form.Label>
                            <Form.Select
                                id="race"
                                {...register('race')}
                                isInvalid={!!errors.race}
                            >
                                <option value="">Select Race</option>
                                {sortedRaceOptions.map((race) => (
                                    <option key={race.code} value={race.display} className="text-capitalize">
                                        {race.display}
                                    </option>
                                ))}
                                <option value="Declined To Specify">Declined To Specify</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0" htmlFor="ethnicity">Ethnicity</Form.Label>
                            <Select
                                inputId="ethnicity"
                                options={formattedEthnicityOptions}
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select Ethnicity"
                                value={selectedEthnicityOption}
                                onChange={handleEthnicityChange}
                                styles={selectStyles}
                                menuPlacement="auto"
                                menuPosition="fixed"
                            />
                        </Form.Group>
                    </Col>

                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0" htmlFor="preferredLanguage">Preferred Language</Form.Label>
                            <Form.Select
                                id="preferredLanguage"
                                {...register('preferredLanguage')}
                                isInvalid={!!errors.preferredLanguage}
                            >
                                <option value="">Select Preferred Language</option>
                                {sortedLanguageOptions.map(language => (
                                    <option key={language} value={language}>{language}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0" htmlFor="tribalEntity">Tribal Entity</Form.Label>
                            <Select
                                inputId="tribalEntity"
                                options={formattedTribleOptions}
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                value={selectedTribalOption}
                                placeholder="Select Tribal Entity"
                                onChange={handleTribalChange}
                                styles={selectStyles}
                                menuPlacement="auto"
                                menuPosition="fixed"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="pb-2">
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label htmlFor="maritalStatus" className="mb-0">
                                Marital Status
                            </Form.Label>
                            <Form.Select
                                id="maritalStatus"
                                {...register('maritalStatus')}
                                isInvalid={!!errors.maritalStatus}
                            >
                                <option value="">Select marital status</option>
                                {maritalStatusOptions?.map((option) => (
                                    <option key={option?.value} value={option?.show}>
                                        {option?.show}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.maritalStatus && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.maritalStatus.message}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <AddressForm addresses={demographicAddresses} setAddresses={setDemographicAddresses} />
                <Row className="mt-1 pb-2">
                    <Col sm={12}>
                        <h5>Emergency Contact Details</h5>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Name</Form.Label>
                            <Form.Control
                                {...register('emergencyContactName')}
                                type="text"
                                placeholder="Enter Emergency Contact Name"
                            />
                            {errors.emergencyContactName && (
                                <span className="text-danger">{errors.emergencyContactName.message}</span>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-0 position-relative">
                            <Form.Label className="mb-0">Emergency Contact Phone </Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                        <img src={us} alt="country code flag" width={16} />
                                        +1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        style={{ height: '33px' }}
                                        {...register('emergencyContactPhone', {
                                            pattern: {
                                                value: /^\(\d{3}\)\d{3}-\d{4}$/,
                                                message: 'Contact must be in the format (XXX)XXX-XXXX',
                                            },
                                            maxLength: {
                                                value: 13,
                                                message: 'Contact must not exceed 13 characters',
                                            },
                                            minLength: {
                                                value: 13,
                                                message: 'Contact must not be less than 13 characters',
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
                                            clearErrors('emergencyContactPhone');
                                        }}
                                        placeholder="(XXX)XXX-XXXX"
                                        maxLength={14}
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Relation</Form.Label>
                            <Select
                                options={relationshipOption}
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="Select Relation"
                                value={selectedRelationOption}
                                onChange={handleRelationChange}
                                styles={selectStyles}
                                menuPlacement="auto"
                                menuPosition="fixed"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className="mt-1">
                                <h5>Employer Details</h5>
                            </Col>
                            <Col sm={12}>
                                <Row>
                                    <Col sm={3}>
                                        <Form.Group>
                                            <Form.Label className="mb-0">Employer Name</Form.Label>
                                            <Form.Control
                                                {...register('employerName')}
                                                type="text"
                                                placeholder="Enter Employer Name"
                                            />
                                            {errors.employerName && (
                                                <span className="text-danger">{errors.employerName.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-0 position-relative">
                                            <Form.Label className="mb-0">Employer Phone </Form.Label>
                                            <Form.Group>
                                                <InputGroup>
                                                    <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                                        <img src={us} alt="country code flag" width={16} />
                                                        +1
                                                    </InputGroup.Text>
                                                    {/* This is the prefix */}
                                                    <Form.Control
                                                        type="tel"
                                                        style={{ height: '33px' }}
                                                        {...register('employerPhone', {
                                                            pattern: {
                                                                value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                                message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                            },
                                                            maxLength: {
                                                                value: 13, // Includes characters for (XXX)XXX-XXXX
                                                                message: 'Contact must not exceed 13 characters',
                                                            },
                                                            minLength: {
                                                                value: 13,
                                                                message: 'Contact must not be less than 13 characters',
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
                                                            clearErrors('employerPhone');
                                                        }}
                                                        placeholder="(XXX)XXX-XXXX"
                                                        maxLength={14}
                                                        onKeyPress={(event) => {
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                    {errors.employerPhone && (
                                                        <span className="text-danger">
                                                            {errors.employerPhone.message}
                                                        </span>
                                                    )}
                                                </InputGroup>
                                            </Form.Group>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Employment Status</Form.Label>
                                            <Form.Select {...register('employmentStatus')}>
                                                <option value="">Select Employment Status</option>
                                                <option value="employed">Employed</option>
                                                <option value="self-employed">Self-Employed</option>
                                                <option value="unemployed">Unemployed</option>
                                                <option value="retired">Retired</option>
                                                <option value="student">Student</option>
                                                <option value="unknown">Unknown</option>
                                            </Form.Select>
                                            {errors.employmentStatus && (
                                                <span className="text-danger">{errors.employmentStatus.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Occupation</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Occupation"
                                                {...register('occupation', {
                                                    minLength: {
                                                        value: 2,
                                                        message: 'Occupation must be at least 2 characters long',
                                                    },
                                                })}
                                            />
                                            {errors.occupation && (
                                                <span className="text-danger">{errors.occupation.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row className="position-relative">
                                    <Col sm={12}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    {...register('employerAddress', {})}
                                                    onChange={(e) => {
                                                        getEmployerGeolocation(e.target.value);
                                                        setEmployerFocused(true);
                                                        clearErrors('employerAddress');
                                                    }}
                                                    onFocus={() => setEmployerFocused(true)}
                                                    onBlur={() => {
                                                        setTimeout(() => setEmployerFocused(false), 200);
                                                    }}
                                                    placeholder="Search for address"
                                                    autoComplete="off"
                                                />
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: 0,
                                                        width: '100%',
                                                        maxHeight: '150px',
                                                        zIndex: 111,
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #ced4da',
                                                        borderTop: 'none',
                                                    }}
                                                    className={`scroll-container hover-bg-change ${searchedEmployerLocations?.length === 0 || !employerFocused ? 'd-none' : ''}`}>
                                                    {searchedEmployerLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setValue('employerZip', data?.components?.postcode);
                                                                setValue(
                                                                    'employerStateName',
                                                                    data?.components?.state_code
                                                                );
                                                                setValue('employerStreet', data?.components?.road);
                                                                setValue(
                                                                    'employerTimeZone',
                                                                    data?.annotations?.timezone?.name
                                                                );
                                                                setEmployerCitySearch(data?.components?.county);
                                                                setValue('employerAddress', data?.formatted);
                                                                setEmployerFocused(false);
                                                            }}
                                                            style={{
                                                                margin: 0,
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                            }}
                                                            className="hover-bg-change text-black">
                                                            {data?.formatted}
                                                        </p>
                                                    ))}
                                                    {searchedEmployerLocations?.length === 0 && (
                                                        <p className="text-muted px-2 py-1">No results found</p>
                                                    )}
                                                </div>
                                            </div>
                                            {errors.employerAddress && (
                                                <span className="text-danger">{errors.employerAddress.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">State</Form.Label>
                                            <Form.Select {...register('employerStateName')}>
                                                <option value="" hidden>
                                                    State
                                                </option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.name}
                                                        data-key={data?.id}
                                                        value={data?.state_code}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.employerStateName && (
                                                <span className="text-danger">{errors.employerStateName.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">City</Form.Label>
                                            <Form.Select
                                                disabled={citiesLoading}
                                                {...register('employerCity')}>
                                                <option hidden value="">
                                                    {citiesLoading ? 'Loading...' : 'City'}
                                                </option>
                                                {cities3?.map((data) => (
                                                    <option key={data?.name} value={data?.name}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.employerCity && (
                                                <span className="text-danger">{errors.employerCity.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">Zip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('employerZip', {
                                                    minLength: {
                                                        value: 5,
                                                        message: 'ZIP code must be at least 5 characters long',
                                                    },
                                                    pattern: {
                                                        value: /^[0-9]+$/,
                                                        message: 'ZIP code must contain numbers only',
                                                    },
                                                })}
                                                placeholder="Zip"
                                                maxLength={5}
                                            />
                                            {errors.employerZip && (
                                                <span className="text-danger">{errors.employerZip.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='my-2'>
                    <Col sm={12}>
                        <Form.Group>
                            <Form.Label className="mb-0">Notes</Form.Label>
                            {/* <Form.Control as={'textarea'} placeholder="Enter Notes" {...register('notes')} /> */}
                            <Form.Control
                                id="notes"
                                as="textarea"
                                rows={3}
                                placeholder="Enter any additional notes or comments"
                                {...register('notes', {
                                    maxLength: {
                                        value: 500,
                                        message: 'Notes cannot exceed 500 characters'
                                    }
                                })}
                                isInvalid={!!errors.notes}
                            />
                            {errors.notes && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.notes.message}
                                </Form.Control.Feedback>
                            )}
                            <Form.Text className="text-muted">
                                {watch('notes')?.length || 0}/500 characters
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
            </div>
            <Row className="my-2 pe-2">
                <Col className="d-flex justify-content-end ">
                    <Button
                        className="custom-buttons btn-height"
                        disabled={isLoading}
                        style={{ width: '70px' }}
                        type="submit">
                        {isLoading ? (
                            <Spinner color="white" className="spinner-border-sm" />
                        ) : (
                            '  Update'
                        )}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}
);

export default Demographics;
