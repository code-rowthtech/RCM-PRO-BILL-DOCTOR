# Encounter Data Population Changes - Doctor Module

## Summary
Updated the doctor module's encounter form to properly handle populated data (from summary items like allergies, problems, medications) in both create and update operations, matching the clinic panel's EncountersV2 structure.

## Key Changes Made

### 1. EncounterForm.js - Enhanced Data Population on Update

**Location:** `src/pages/apps/Patients/UpdatePatients/encounters/components/EncounterForm.js`

#### Change 1: Improved Encounter Data Loading (Lines ~95-140)
- **Before:** Only loaded field content values, didn't preserve populated data
- **After:** Now properly loads and preserves:
  - `populatedData` arrays for each field
  - `populatedIds` arrays for tracking source items
  - `attachedRecords` for file attachments
  
```javascript
// Populate form fields and track populated data
if (encounterById?.data && Array.isArray(encounterById?.data)) {
    const newPopulatedFields = {};
    const newPopulatedFieldIds = {};

    encounterById?.data?.forEach(field => {
        if (field?.type && field?.content?.value) {
            setValue(field?.type, field?.content?.value);
        }
        if (field?.populatedData?.length > 0) {
            newPopulatedFields[field.type] = field.populatedData;
        }
        if (field?.populatedIds?.length > 0) {
            newPopulatedFieldIds[field.type] = field.populatedIds;
        }
    });

    setPopulatedFields(newPopulatedFields);
    setPopulatedFieldIds(newPopulatedFieldIds);
}

// Populate attached records if they exist
if (encounterById?.attachedRecords) {
    setAttachedRecords(encounterById.attachedRecords);
}
```

#### Change 2: Optimized Update Payload (Lines ~240-260)
- **Before:** Sent entire encounter object on update
- **After:** Sends only modified fields to match clinic structure:
  - `id` - encounter ID
  - `data` - fields data with populated info
  - `attachedRecords` - file attachments
  - `consentForms` - selected consent forms

```javascript
if (encounterById) {
    // For update, send only the fields that need to be updated
    const updatePayload = {
        id: encounterById._id,
        data: fieldsData,
        attachedRecords,
        consentForms: selectedConsentForms?.map((form) => form.value) || []
    };
    dispatch(updateEncounterAction({ key: encryptMessage(updatePayload) }));
} else {
    dispatch(createEncounterAction({ key: encryptMessage(encounterPayload) }));
}
```

## Data Structure

### Field Data Structure (Sent to Backend)
```javascript
{
    type: "Subjective",  // or "Assessment", "Plan", etc.
    content: {
        type: "html",  // or "text"
        value: "<p>Patient reports...</p>"
    },
    populatedIds: ["allergy_id_1", "problem_id_2"],  // IDs of source items
    populatedData: [
        "Allergy: Penicillin - Severe reaction",
        "Problem: Hypertension - Active"
    ]  // Human-readable data
}
```

### Update Payload Structure
```javascript
{
    id: "encounter_id",
    data: [
        {
            type: "Subjective",
            content: { type: "html", value: "..." },
            populatedIds: [...],
            populatedData: [...]
        },
        // ... more fields
    ],
    attachedRecords: [
        { url: "...", fileName: "..." }
    ],
    consentForms: ["consent_id_1", "consent_id_2"]
}
```

## How It Works

### 1. Creating an Encounter
1. User populates fields from summary (allergies, problems, medications)
2. `window.populateEncounterField()` tracks data in `populatedFields` and `populatedFieldIds`
3. On submit, data is structured with both content and populated metadata
4. Backend saves complete structure

### 2. Updating an Encounter
1. Encounter data loaded with `populatedData` and `populatedIds` preserved
2. User can add/remove populated items
3. On submit, only changed fields sent with updated populated metadata
4. Backend merges changes while preserving structure

### 3. Data Flow
```
Summary Item Click 
  → window.populateEncounterField(fieldName, data, itemId)
  → populatedFields[fieldName].push(data)
  → populatedFieldIds[fieldName].push(itemId)
  → On Submit: Include in field data structure
  → Backend: Save with encounter
  → On Load: Restore populated data
```

## Benefits

1. **Data Traceability:** Track which summary items were used in each field
2. **Duplicate Prevention:** Check `populatedFieldIds` to prevent re-adding same item
3. **Removal Support:** Users can remove individual populated items
4. **Update Preservation:** Populated data maintained across updates
5. **Consistency:** Matches clinic panel's proven structure

## Testing Checklist

- [ ] Create new encounter with populated data from summary
- [ ] Verify populated data appears in field tables
- [ ] Update encounter and verify populated data preserved
- [ ] Add new populated data to existing encounter
- [ ] Remove populated data items
- [ ] Verify no duplicates when re-adding same item
- [ ] Check attached records persist on update
- [ ] Verify consent forms maintained on update

## Files Modified

1. `src/pages/apps/Patients/UpdatePatients/encounters/components/EncounterForm.js`
   - Enhanced data loading on update
   - Optimized update payload structure
   - Preserved populated data tracking

## Notes

- The `NotesFormFields.js` component already properly displays populated data
- The `window.populateEncounterField` function is already implemented
- Backend API endpoints remain unchanged
- Data encryption/decryption handled by existing saga layer
