import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { createVitalsAction, getVitalsByPatientIdAction, updateVitalsAction } from 'redux/actions';
import { encryptMessage } from 'cryptoUtils';
import { loggedInUser } from 'helpers/loggedInUser';
import Spinner from 'constants/Spinner';
import ToastHandle from 'helpers/ToastMessage';

const VitalsModal = ({ onClose, initialDate, onDateChange }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');

    const { createVitalsReducer, updateVitalsReducer, getVitalsByPatientIdReducer } = useSelector((state) => state);
    const isLoading = createVitalsReducer?.loading || updateVitalsReducer?.loading;
    const createStatus = createVitalsReducer?.data?.status;
    const updateStatus = updateVitalsReducer?.data?.status;
    const allVitalsData = getVitalsByPatientIdReducer?.data?.data || [];

    const [vitals, setVitals] = useState({
        temperature: '',
        pulse: '',
        systolic: '',
        diastolic: '',
        respiratory_rate: '',
        oxygen_saturation: '',
        height: '',
        weight: '',
        bmi: '',
        pain_level: '',
        smoking_status: '',
        head_circumference: '',
        weight_for_length_percentile: '',
        bmi_percentile: '',
        oxygen_concentration: '',
        inhaled_oxygen_flow_rate: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [existingVitals, setExistingVitals] = useState(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const [visitDateTime, setVisitDateTime] = useState(() => {
        const now = new Date();
        return {
            date: initialDate || now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 5)
        };
    });

    // Update visitDateTime when initialDate changes
    useEffect(() => {
        if (initialDate && initialDate !== visitDateTime.date) {
            setVisitDateTime(prev => ({
                ...prev,
                date: initialDate
            }));
        }
    }, [initialDate, visitDateTime.date]);

    const smokingOptions = [
        'Former smoker', 'Smoker, current status unknown', 'Never smoker', 'Unknown if ever smoked',
        'Current every day smoker', 'Light tobacco smoker', 'Heavy tobacco smoker', 'Current some day smoker'
    ];

    // Validation rules for each vital sign
    const validationRules = {
        temperature: { min: 93, max: 108, label: 'Temperature (°F)' },
        pulse: { min: 30, max: 200, label: 'Pulse (bpm)' },
        systolic: { min: 70, max: 250, label: 'Systolic BP (mmHg)' },
        diastolic: { min: 40, max: 150, label: 'Diastolic BP (mmHg)' },
        respiratory_rate: { min: 8, max: 40, label: 'Respiratory Rate (rpm)' },
        oxygen_saturation: { min: 70, max: 100, label: 'Oxygen Saturation (%)' },
        height: { min: 12, max: 96, label: 'Height (in)' },
        weight: { min: 5, max: 1000, label: 'Weight (lbs)' },
        pain_level: { min: 0, max: 10, label: 'Pain Level' },
        head_circumference: { min: 10, max: 30, label: 'Head Circumference (in)' },
        weight_for_length_percentile: { min: 0, max: 100, label: 'Weight-for-length Percentile (%)' },
        bmi_percentile: { min: 0, max: 100, label: 'BMI Percentile (%)' },
        oxygen_concentration: { min: 21, max: 100, label: 'Oxygen Concentration (%)' },
        inhaled_oxygen_flow_rate: { min: 0, max: 15, label: 'Inhaled Oxygen Flow Rate (l/min)' }
    };

    const vitalsList = [
        { key: 'temperature', label: 'Temperature', unit: '°F', type: 'number' },
        { key: 'pulse', label: 'Pulse', unit: 'bpm', type: 'number' },
        { key: 'systolic', label: 'Systolic BP', unit: 'mmHg', type: 'number' },
        { key: 'diastolic', label: 'Diastolic BP', unit: 'mmHg', type: 'number' },
        { key: 'respiratory_rate', label: 'Respiratory Rate', unit: 'rpm', type: 'number' },
        { key: 'oxygen_saturation', label: 'Oxygen Saturation', unit: '%', type: 'number' },
        { key: 'height', label: 'Height', unit: 'in', type: 'number' },
        { key: 'weight', label: 'Weight', unit: 'lbs', type: 'number' },
        { key: 'bmi', label: 'BMI', unit: 'kg/m²', type: 'calculated' },
        { key: 'pain_level', label: 'Pain Level', unit: '(0-10)', type: 'number' },
        { key: 'head_circumference', label: 'Head Circumference', unit: 'in', type: 'number' },
        { key: 'weight_for_length_percentile', label: 'Weight-for-length Percentile', unit: '%', type: 'number' },
        { key: 'bmi_percentile', label: 'BMI Percentile', unit: '%', type: 'number' },
        { key: 'oxygen_concentration', label: 'Oxygen Concentration', unit: '%', type: 'number' },
        { key: 'inhaled_oxygen_flow_rate', label: 'Inhaled Oxygen Flow Rate', unit: 'l/min', type: 'number' },
        { key: 'smoking_status', label: 'Smoking Status', type: 'dropdown' }
    ];

    // Auto-calculate BMI
    useEffect(() => {
        const weight = parseFloat(vitals.weight);
        const height = parseFloat(vitals.height);

        if (weight > 0 && height > 0) {
            const bmi = ((weight / (height * height)) * 703).toFixed(1);
            setVitals(prev => ({ ...prev, bmi }));
        } else {
            setVitals(prev => ({ ...prev, bmi: '' }));
        }
    }, [vitals.weight, vitals.height]);

    // Check for existing vitals when date changes
    useEffect(() => {
        const selectedDate = visitDateTime.date;
        const existingVitalsForDate = allVitalsData.find(
            vitalGroup => vitalGroup.effectiveDateTime === selectedDate
        );

        if (existingVitalsForDate) {
            setExistingVitals(existingVitalsForDate);
            setIsUpdateMode(true);

            // Pre-populate form with existing values
            const newVitals = {
                temperature: '', pulse: '', systolic: '', diastolic: '', respiratory_rate: '',
                oxygen_saturation: '', height: '', weight: '', bmi: '', pain_level: '',
                smoking_status: '', head_circumference: '', weight_for_length_percentile: '',
                bmi_percentile: '', oxygen_concentration: '', inhaled_oxygen_flow_rate: ''
            };

            // Debug: Log the vital data structure
            console.log('Existing vitals data:', existingVitalsForDate.vitals);

            existingVitalsForDate.vitals.forEach(vital => {
                const display = vital.code?.coding?.[0]?.display;
                const loincCode = vital.code?.coding?.[0]?.code;

                if (vital.component?.length > 0) {
                    // Handle blood pressure components
                    const systolic = vital.component.find(c => c.code?.coding?.[0]?.code === '8480-6')?.valueQuantity?.value;
                    const diastolic = vital.component.find(c => c.code?.coding?.[0]?.code === '8462-4')?.valueQuantity?.value;
                    if (systolic) newVitals.systolic = systolic.toString();
                    if (diastolic) newVitals.diastolic = diastolic.toString();
                } else if (vital.valueQuantity?.value) {
                    // Comprehensive mapping by LOINC code and display name
                    const loincToKey = {
                        '8310-5': 'temperature',
                        '8867-4': 'pulse',
                        '9279-1': 'respiratory_rate',
                        '2708-6': 'oxygen_saturation',
                        '8302-2': 'height',
                        '29463-7': 'weight',
                        '39156-5': 'bmi',
                        '72514-3': 'pain_level',
                        '9843-4': 'head_circumference',
                        '77606-2': 'weight_for_length_percentile',
                        '59576-9': 'bmi_percentile',
                        '3150-0': 'oxygen_concentration',
                        '3151-8': 'inhaled_oxygen_flow_rate'
                    };

                    // Comprehensive display name mapping
                    const displayToKey = {
                        // Temperature variations
                        'Body temperature': 'temperature',
                        'Temperature': 'temperature',
                        'Body Temperature': 'temperature',

                        // Pulse/Heart rate variations
                        'Heart rate': 'pulse',
                        'Pulse': 'pulse',
                        'Heart Rate': 'pulse',

                        // Respiratory rate variations
                        'Respiratory rate': 'respiratory_rate',
                        'Respiratory Rate': 'respiratory_rate',

                        // Oxygen saturation variations
                        'Oxygen saturation in Arterial blood': 'oxygen_saturation',
                        'Oxygen Saturation': 'oxygen_saturation',
                        'Oxygen saturation': 'oxygen_saturation',

                        // Height variations
                        'Body height': 'height',
                        'Height': 'height',
                        'Body Height': 'height',

                        // Weight variations
                        'Body weight': 'weight',
                        'Weight': 'weight',
                        'Body Weight': 'weight',

                        // BMI variations
                        'Body mass index': 'bmi',
                        'BMI': 'bmi',
                        'Body Mass Index': 'bmi',

                        // Pain level variations
                        'Pain Level': 'pain_level',
                        'Pain severity - 0-10 verbal numeric rating [Score] - Reported': 'pain_level',
                        'Pain severity': 'pain_level',

                        // Head circumference variations
                        'Head Occipital-frontal circumference': 'head_circumference',
                        'Head Circumference': 'head_circumference',
                        'Head circumference': 'head_circumference',

                        // Other vitals
                        'Weight-for-length Percentile': 'weight_for_length_percentile',
                        'BMI Percentile': 'bmi_percentile',
                        'Oxygen Concentration': 'oxygen_concentration',
                        'Inhaled Oxygen Flow Rate': 'inhaled_oxygen_flow_rate'
                    };

                    // Try LOINC code first, then display name, then partial match
                    let key = loincToKey[loincCode] || displayToKey[display];

                    // If no exact match, try partial matching for common patterns
                    if (!key && display) {
                        const lowerDisplay = display.toLowerCase();
                        if (lowerDisplay.includes('temperature')) key = 'temperature';
                        else if (lowerDisplay.includes('pulse') || lowerDisplay.includes('heart rate')) key = 'pulse';
                        else if (lowerDisplay.includes('respiratory')) key = 'respiratory_rate';
                        else if (lowerDisplay.includes('oxygen') && lowerDisplay.includes('saturation')) key = 'oxygen_saturation';
                        else if (lowerDisplay.includes('height')) key = 'height';
                        else if (lowerDisplay.includes('weight') && !lowerDisplay.includes('percentile')) key = 'weight';
                        else if (lowerDisplay.includes('bmi') && !lowerDisplay.includes('percentile')) key = 'bmi';
                        else if (lowerDisplay.includes('pain')) key = 'pain_level';
                        else if (lowerDisplay.includes('head') && lowerDisplay.includes('circumference')) key = 'head_circumference';
                    }

                    if (key) {
                        newVitals[key] = vital.valueQuantity.value.toString();
                        console.log(`Mapped ${display} (${loincCode}) to ${key} = ${vital.valueQuantity.value}`);
                    } else {
                        console.log(`No mapping found for: ${display} (${loincCode})`);
                    }
                } else if (vital.valueString) {
                    const lowerDisplay = display?.toLowerCase() || '';
                    if (lowerDisplay.includes('smoking') || loincCode === '365980008') {
                        newVitals.smoking_status = vital.valueString;
                    }
                }
            });

            setVitals(newVitals);
        } else {
            setExistingVitals(null);
            setIsUpdateMode(false);
            // Reset form when no existing vitals found
            setVitals({
                temperature: '', pulse: '', systolic: '', diastolic: '', respiratory_rate: '',
                oxygen_saturation: '', height: '', weight: '', bmi: '', pain_level: '',
                smoking_status: '', head_circumference: '', weight_for_length_percentile: '',
                bmi_percentile: '', oxygen_concentration: '', inhaled_oxygen_flow_rate: ''
            });
            setErrors({});
            setTouched({});
        }
    }, [visitDateTime.date, allVitalsData]);

    // Fetch vitals data when component mounts
    useEffect(() => {
        if (patientId) {
            dispatch(getVitalsByPatientIdAction({ patientId, limit: 30 }));
        }
    }, [dispatch, patientId]);

    // Handle successful creation or update
    useEffect(() => {
        if (createStatus === 201 || updateStatus === 200) {
            // Reset form state before closing
            setVitals({
                temperature: '', pulse: '', systolic: '', diastolic: '', respiratory_rate: '',
                oxygen_saturation: '', height: '', weight: '', bmi: '', pain_level: '',
                smoking_status: '', head_circumference: '', weight_for_length_percentile: '',
                bmi_percentile: '', oxygen_concentration: '', inhaled_oxygen_flow_rate: ''
            });
            setErrors({});
            setTouched({});
            setExistingVitals(null);
            setIsUpdateMode(false);
            onClose();
        }
    }, [createStatus, updateStatus, onClose]);

    // Cleanup effect when component unmounts
    useEffect(() => {
        return () => {
            // Reset form state on unmount
            setVitals({
                temperature: '', pulse: '', systolic: '', diastolic: '', respiratory_rate: '',
                oxygen_saturation: '', height: '', weight: '', bmi: '', pain_level: '',
                smoking_status: '', head_circumference: '', weight_for_length_percentile: '',
                bmi_percentile: '', oxygen_concentration: '', inhaled_oxygen_flow_rate: ''
            });
            setErrors({});
            setTouched({});
            setExistingVitals(null);
            setIsUpdateMode(false);
        };
    }, []);

    const validateVital = useCallback((key, value) => {
        if (!value || value === '') return '';

        const rule = validationRules[key];
        if (!rule) return '';

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return `${rule.label} must be a valid number`;

        if (numValue < rule.min || numValue > rule.max) {
            return `${rule.label} must be between ${rule.min} and ${rule.max}`;
        }

        // Special validation for blood pressure
        if (key === 'systolic' && vitals.diastolic) {
            const diastolic = parseFloat(vitals.diastolic);
            if (!isNaN(diastolic) && numValue <= diastolic) {
                return 'Systolic BP must be higher than diastolic BP';
            }
        }
        if (key === 'diastolic' && vitals.systolic) {
            const systolic = parseFloat(vitals.systolic);
            if (!isNaN(systolic) && numValue >= systolic) {
                return 'Diastolic BP must be lower than systolic BP';
            }
        }

        return '';
    }, [vitals.systolic, vitals.diastolic]);

    const handleInputChange = useCallback((key, value) => {
        setVitals(prev => ({
            ...prev,
            [key]: value
        }));

        // Validate on change
        const error = validateVital(key, value);
        setErrors(prev => ({
            ...prev,
            [key]: error
        }));
    }, [validateVital]);

    const handleBlur = useCallback((key) => {
        setTouched(prev => ({
            ...prev,
            [key]: true
        }));

        const error = validateVital(key, vitals[key]);
        setErrors(prev => ({
            ...prev,
            [key]: error
        }));
    }, [validateVital, vitals]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        // Validate all fields before submission
        const newErrors = {};
        let hasErrors = false;

        Object.keys(vitals).forEach(key => {
            if (vitals[key] && validationRules[key]) {
                const error = validateVital(key, vitals[key]);
                if (error) {
                    newErrors[key] = error;
                    hasErrors = true;
                }
            }
        });

        // Check if at least one vital is entered
        const hasAnyVital = Object.keys(vitals).some(key =>
            vitals[key] && vitals[key] !== '' && key !== 'bmi'
        );

        if (!hasAnyVital) {
            ToastHandle('Please enter at least one vital sign', 'error');
            return;
        }

        if (hasErrors) {
            setErrors(newErrors);
            setTouched(Object.keys(newErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            ToastHandle('Please correct the validation errors before submitting', 'error');
            return;
        }

        const effectiveDateTime = `${visitDateTime.date}T${visitDateTime.time}:00`;
        const observations = [];

        // Create observations for each vital with a value
        vitalsList.forEach(vital => {
            const value = vitals[vital.key];
            if (!value || value === '' || vital.type === 'calculated') return;

            const baseObservation = {
                effectiveDateTime,
                subject: patientId,
                createdBy: loggedInUser?._id,
            };

            if (vital.key === 'systolic' || vital.key === 'diastolic') {
                // Handle blood pressure as a single observation with components
                if (vitals.systolic && vitals.diastolic) {
                    const bpObservation = {
                        ...baseObservation,
                        code: {
                            coding: [{
                                system: "http://loinc.org",
                                code: "85354-9",
                                display: "Blood pressure panel with all children optional"
                            }]
                        },
                        component: [
                            {
                                code: {
                                    coding: [{
                                        system: "http://loinc.org",
                                        code: "8480-6",
                                        display: "Systolic blood pressure"
                                    }]
                                },
                                valueQuantity: {
                                    value: parseFloat(vitals.systolic),
                                    unit: "mmHg",
                                    system: "http://unitsofmeasure.org",
                                    code: "mm[Hg]"
                                }
                            },
                            {
                                code: {
                                    coding: [{
                                        system: "http://loinc.org",
                                        code: "8462-4",
                                        display: "Diastolic blood pressure"
                                    }]
                                },
                                valueQuantity: {
                                    value: parseFloat(vitals.diastolic),
                                    unit: "mmHg",
                                    system: "http://unitsofmeasure.org",
                                    code: "mm[Hg]"
                                }
                            }
                        ]
                    };

                    // Only add BP observation once
                    if (vital.key === 'systolic' && !observations.find(obs => obs.code?.coding?.[0]?.code === "85354-9")) {
                        observations.push(bpObservation);
                    }
                }
            } else if (vital.type === 'dropdown') {
                observations.push({
                    ...baseObservation,
                    code: {
                        coding: [{
                            system: "http://snomed.info/sct",
                            code: "365980008",
                            display: vital.label
                        }]
                    },
                    valueString: value
                });
            } else {
                // Get appropriate LOINC code for each vital
                const loincCodes = {
                    temperature: "8310-5",
                    pulse: "8867-4",
                    respiratory_rate: "9279-1",
                    oxygen_saturation: "2708-6",
                    height: "8302-2",
                    weight: "29463-7",
                    pain_level: "72514-3",
                    head_circumference: "9843-4",
                    weight_for_length_percentile: "77606-2",
                    bmi_percentile: "59576-9",
                    oxygen_concentration: "3150-0",
                    inhaled_oxygen_flow_rate: "3151-8"
                };

                observations.push({
                    ...baseObservation,
                    code: {
                        coding: [{
                            system: "http://loinc.org",
                            code: loincCodes[vital.key] || "unknown",
                            display: vital.label
                        }]
                    },
                    valueQuantity: {
                        value: parseFloat(value),
                        unit: vital.unit,
                        system: "http://unitsofmeasure.org",
                        code: vital.unit
                    }
                });
            }
        });

        // Submit observations (create or update)
        if (isUpdateMode && existingVitals) {
            observations.forEach(observation => {
                const existingVital = existingVitals.vitals.find(v => {
                    const display = v.code?.coding?.[0]?.display;
                    const observationDisplay = observation.code?.coding?.[0]?.display;
                    return display === observationDisplay;
                });

                if (existingVital) {
                    observation._id = existingVital._id;
                    dispatch(updateVitalsAction({ key: encryptMessage(observation), id: existingVital?._id }));
                } else {
                    dispatch(createVitalsAction({ key: encryptMessage(observation) }));
                }
            });
        } else {
            observations.forEach(observation => {
                dispatch(createVitalsAction({ key: encryptMessage(observation) }));
            });
        }
    }, [vitals, visitDateTime, patientId, dispatch, validateVital, touched, errors]);

    const hasValidationErrors = Object.values(errors).some(error => error);
    const enteredVitals = Object.keys(vitals).filter(key => vitals[key] && vitals[key] !== '' && key !== 'bmi');

    return (
        <Form onSubmit={handleSubmit} className="d-flex flex-column" style={{ height: '75vh' }}>
            <div className="flex-grow-1 overflow-auto pe-2" style={{ maxHeight: 'calc(75vh - 80px)' }}>
                {isUpdateMode && (
                    <Alert variant="info" className="mb-3">
                        <Alert.Heading className="h6">📝 Update Mode</Alert.Heading>
                        <p className="mb-1 small">
                            Vitals already exist for {new Date(visitDateTime.date).toLocaleDateString()}.
                            Any changes will update the existing records.
                        </p>
                        <p className="mb-0 small">
                            <strong>Previously recorded:</strong> {Object.values(vitals).filter(v => v && v !== '').length} vital sign(s)
                        </p>
                    </Alert>
                )}

                {hasValidationErrors && (
                    <Alert variant="warning" className="mb-3">
                        <Alert.Heading className="h6">Please correct the following errors:</Alert.Heading>
                        <ul className="mb-0 small">
                            {Object.entries(errors).map(([key, error]) =>
                                error && touched[key] ? (
                                    <li key={key}>{error}</li>
                                ) : null
                            )}
                        </ul>
                    </Alert>
                )}

                <Row className="mb-1">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>
                                Date
                                <small className="text-muted ms-1">
                                    (synced with vitals card)
                                </small>
                            </Form.Label>
                            <Form.Control
                                type="date"
                                value={visitDateTime.date}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    setVisitDateTime(prev => ({ ...prev, date: newDate }));
                                    // Notify parent component about date change
                                    if (onDateChange) {
                                        onDateChange(newDate);
                                    }
                                }}
                                max={new Date().toISOString().split('T')[0]}
                                className="border-primary"
                            />
                            <Form.Text className="text-muted small">
                                Changing this date will update the vitals card filter
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={visitDateTime.time}
                                onChange={(e) => setVisitDateTime(prev => ({ ...prev, time: e.target.value }))}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    {vitalsList.map((vital) => (
                        <Col md={6} lg={4} key={vital.key} className="mb-1">
                            <Form.Group>
                                <Form.Label>
                                    {vital.label} {vital.unit && <small className="text-muted">({vital.unit})</small>}
                                    {isUpdateMode && vitals[vital.key] && (
                                        <small className="text-success ms-2">
                                            ✓ Previously recorded
                                        </small>
                                    )}
                                </Form.Label>
                                {vital.type === 'dropdown' ? (
                                    <Form.Select
                                        value={vitals[vital.key]}
                                        onChange={(e) => handleInputChange(vital.key, e.target.value)}
                                        className={isUpdateMode && vitals[vital.key] ? 'border-success' : ''}
                                    >
                                        <option value="">
                                            {isUpdateMode && vitals[vital.key] ?
                                                `Current: ${vitals[vital.key]}` :
                                                `Select ${vital.label}`
                                            }
                                        </option>
                                        {smokingOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                ) : vital.type === 'calculated' ? (
                                    <Form.Control
                                        type="text"
                                        value={vitals[vital.key]}
                                        readOnly
                                        className="bg-light"
                                    />
                                ) : (
                                    <>
                                        <Form.Control
                                            type="number"
                                            step="0.1"
                                            value={vitals[vital.key]}
                                            onChange={(e) => handleInputChange(vital.key, e.target.value)}
                                            onBlur={() => handleBlur(vital.key)}
                                            placeholder={isUpdateMode && vitals[vital.key] ?
                                                `Current: ${vitals[vital.key]}` :
                                                `Enter ${vital.label.toLowerCase()}`
                                            }
                                            isInvalid={touched[vital.key] && errors[vital.key]}
                                            isValid={touched[vital.key] && vitals[vital.key] && !errors[vital.key]}
                                            className={isUpdateMode && vitals[vital.key] ? 'border-success' : ''}
                                        />
                                        {touched[vital.key] && errors[vital.key] && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors[vital.key]}
                                            </Form.Control.Feedback>
                                        )}
                                        {validationRules[vital.key] && (
                                            <Form.Text className="text-muted small">
                                                Range: {validationRules[vital.key].min} - {validationRules[vital.key].max}
                                            </Form.Text>
                                        )}
                                    </>
                                )}
                            </Form.Group>
                        </Col>
                    ))}
                </Row>

                {/* <Row className="mt-1">
                    <Col>
                        <div className="mb-2">
                            <small className="text-muted">
                                {isUpdateMode ? (
                                    <>
                                        <strong>Vitals to be {enteredVitals.length > 0 ? 'updated/saved' : 'updated'}:</strong> {enteredVitals.length} vital sign(s)
                                        {Object.values(vitals).filter(v => v && v !== '').length > enteredVitals.length && (
                                            <span className="text-success ms-2">
                                                ({Object.values(vitals).filter(v => v && v !== '').length - enteredVitals.length} unchanged)
                                            </span>
                                        )}
                                    </>
                                ) : enteredVitals.length > 0 ? (
                                    <><strong>Vitals to be saved:</strong> {enteredVitals.length} vital sign(s)</>
                                ) : null}
                            </small>
                        </div>
                    </Col>
                </Row> */}
            </div>

            <div className="border-top pt-3 mt-2 bg-white">
                <Row>
                    <Col className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            {enteredVitals.length === 0 ? (
                                <span className="text-warning">⚠️ Please enter at least one vital sign</span>
                            ) : hasValidationErrors ? (
                                <span className="text-danger">❌ Please fix validation errors</span>
                            ) : (
                                <span className="text-success">✅ Ready to save</span>
                            )}
                        </small>
                        <div className="d-flex gap-2">
                            <Button
                                // variant="secondary"
                                className='custom-buttons'
                                onClick={() => {
                                    // Reset form state when canceling
                                    setVitals({
                                        temperature: '', pulse: '', systolic: '', diastolic: '', respiratory_rate: '',
                                        oxygen_saturation: '', height: '', weight: '', bmi: '', pain_level: '',
                                        smoking_status: '', head_circumference: '', weight_for_length_percentile: '',
                                        bmi_percentile: '', oxygen_concentration: '', inhaled_oxygen_flow_rate: ''
                                    });
                                    setErrors({});
                                    setTouched({});
                                    setExistingVitals(null);
                                    setIsUpdateMode(false);
                                    onClose();
                                }}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="custom-buttons"
                                disabled={isLoading || hasValidationErrors || enteredVitals.length === 0}
                            >
                                {isLoading ? <Spinner className="spinner-border-sm me-2" /> : null}
                                {isUpdateMode ? 'Update' : 'Save'} Vitals ({enteredVitals.length})
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};

export default VitalsModal;