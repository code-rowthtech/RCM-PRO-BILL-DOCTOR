export const appointmentStatus = [
  {
      code: "proposed",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Proposed",
      definition: "None of the participant(s) have finalized their acceptance of the appointment request, and the start/end time might not be set yet."
  },
  {
      code: "pending",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Pending",
      definition: "Some or all of the participant(s) have not finalized their acceptance of the appointment request."
  },
  {
      code: "booked",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Booked",
      definition: "All participant(s) have been considered and the appointment is confirmed to go ahead at the date/times specified."
  },
  {
      code: "arrived",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Arrived",
      definition: "The patient/patients has/have arrived and is/are waiting to be seen."
  },
  {
      code: "fulfilled",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Fulfilled",
      definition: "The planning stages of the appointment are now complete, the encounter resource will exist and will track further status changes. Note that an encounter may exist before the appointment status is fulfilled for many reasons."
  },
  {
      code: "cancelled",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Cancelled",
      definition: "The appointment has been cancelled."
  },
  {
      code: "noshow",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "No Show",
      definition: "Some or all of the participant(s) have not/did not appear for the appointment (usually the patient)."
  },
  {
      code: "entered-in-error",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Entered in error",
      definition: "This instance should not have been part of this patient's medical record."
  },
  {
      code: "checked-in",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Checked In",
      definition: "When checked in, all pre-encounter administrative work is complete, and the encounter may begin. (where multiple patients are involved, they are all present)."
  },
  {
      code: "waitlist",
      system: "http://hl7.org/fhir/appointmentstatus",
      display: "Waitlisted",
      definition: "The appointment has been placed on a waitlist, to be scheduled/confirmed in the future when a slot/service is available. A specific time might or might not be pre-allocated."
  }
]

export const appointmentRecurrence = [
    {
        "code": "d",
        "system": "http://unitsofmeasure.org",
        "display": "day",
    },
    {
        "code": "wk",
        "system": "http://unitsofmeasure.org",
        "display": "week",
    },
    // {
    //     "code": "mo",
    //     "system": "http://unitsofmeasure.org",
    //     "display": "month",
    // },
    // {
    //     "code": "a",
    //     "system": "http://unitsofmeasure.org",
    //     "display": "year",
    // }
]
  