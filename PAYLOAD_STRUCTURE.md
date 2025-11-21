# Encounter Payload Structure - Doctor Module

## ✅ Payload Structure Matches Clinic Module

The doctor module's encounter payload now includes all the same fields as the clinic module.

## Complete Payload Structure

```javascript
const encounterPayload = {
    // Basic encounter information
    status: 'in-progress',
    
    // FHIR-compliant class structure
    class: {
        coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'AMB',
            display: 'Ambulatory'
        }],
        text: 'Ambulatory'
    },
    
    // FHIR-compliant type structure
    type: [{
        coding: [{
            system: 'http://snomed.info/sct',
            code: '185349003',
            display: 'Encounter for check up'
        }],
        text: 'Encounter for check up'
    }],
    
    // Time period
    period: {
        start: '2025-11-18T10:30:00.000Z'
    },
    
    // References
    subject: 'patient-id-123',
    providerId: 'doctor-id-456',
    noteType: 'note-type-id-789',
    
    // Dynamic form fields with auto-population tracking
    data: [
        {
            type: 'Subjective',
            content: {
                type: 'html',
                value: '<p>Patient reports headache...</p>'
            },
            populatedIds: ['allergy-id-1', 'problem-id-2'],  // ✅ IDs of auto-populated items
            populatedData: [                                   // ✅ Actual auto-populated data
                'Allergy: Penicillin - Severe reaction',
                'Problem: Chronic migraine - Active'
            ]
        },
        {
            type: 'Objective',
            content: {
                type: 'html',
                value: '<p>Vital signs stable...</p>'
            },
            populatedIds: [],
            populatedData: []
        },
        {
            type: 'Assessment',
            content: {
                type: 'html',
                value: '<p>Diagnosis: Tension headache...</p>'
            },
            populatedIds: ['diagnosis-id-3'],
            populatedData: ['ICD-10: G44.209 - Tension-type headache']
        },
        {
            type: 'Plan',
            content: {
                type: 'html',
                value: '<p>Prescribe ibuprofen...</p>'
            },
            populatedIds: ['medication-id-4'],
            populatedData: ['Medication: Ibuprofen 400mg - Take twice daily']
        },
        {
            type: 'Chief Complaint',
            content: {
                type: 'text',
                value: 'Severe headache for 3 days'
            },
            populatedIds: [],
            populatedData: []
        },
        {
            type: 'History of Present Illness',
            content: {
                type: 'text',
                value: 'Patient reports gradual onset...'
            },
            populatedIds: ['history-id-5'],
            populatedData: ['Medical History: Hypertension - Controlled']
        }
    ],
    
    // Attached files
    attachedRecords: [
        {
            url: 'https://storage.example.com/files/lab-result-123.pdf',
            fileName: 'lab-result-123.pdf'
        },
        {
            url: 'https://storage.example.com/files/xray-456.jpg',
            fileName: 'xray-456.jpg'
        }
    ]
};
```

## Field Data Structure

Each field in the `data` array contains:

### Required Fields
- **type** (string): Field name (e.g., 'Subjective', 'Objective', 'Chief Complaint')
- **content** (object):
  - **type** (string): 'html' or 'text'
  - **value** (string): The actual content

### Optional Fields (Auto-population)
- **populatedIds** (array): IDs of items that were auto-populated into this field
  - Used for tracking and potential updates
  - Example: `['allergy-id-1', 'problem-id-2']`
  
- **populatedData** (array): The actual text that was auto-populated
  - Used for display and printing
  - Example: `['Allergy: Penicillin - Severe reaction', 'Problem: Chronic migraine']`

## Benefits of Including populatedIds

1. **Traceability**: Know exactly which items from patient records were used
2. **Updates**: If source data changes, can identify affected encounters
3. **Audit Trail**: Track what information was considered during encounter
4. **Data Integrity**: Verify that populated data matches source records
5. **Reporting**: Generate reports on which conditions/medications are most commonly referenced

## Update Payload

For updates, the payload is simplified:

```javascript
const updatePayload = {
    id: 'encounter-id-123',
    data: fieldsData,  // Same structure as above
    attachedRecords: attachedRecords
};
```

## Comparison with Clinic Module

| Feature | Clinic Module | Doctor Module | Status |
|---------|--------------|---------------|--------|
| populatedIds | ✅ Included | ✅ Included | ✅ Match |
| populatedData | ✅ Included | ✅ Included | ✅ Match |
| attachedRecords | ✅ Included | ✅ Included | ✅ Match |
| FHIR compliance | ✅ Yes | ✅ Yes | ✅ Match |
| Field structure | ✅ Dynamic | ✅ Dynamic | ✅ Match |

## Example Usage in Code

```javascript
// Auto-populate from summary panel
window.populateEncounterField('Subjective', 'Allergy: Penicillin', 'allergy-id-1');

// This will:
// 1. Add data to populatedFields state
// 2. Add ID to populatedFieldIds state
// 3. Display in table above field
// 4. Include in payload on submit

// On form submission:
// - populatedFields['Subjective'] = ['Allergy: Penicillin']
// - populatedFieldIds['Subjective'] = ['allergy-id-1']
// - Both are included in the payload
```

## Conclusion

✅ The doctor module's payload structure is **100% compatible** with the clinic module.
✅ All auto-population tracking features are implemented.
✅ Data integrity and traceability are maintained.

---

**Last Updated**: November 18, 2025  
**Status**: ✅ Complete and Verified
