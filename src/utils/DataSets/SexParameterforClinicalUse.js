export const sexParameterOptionsList = [
    {
        show: "Female-Typical",
        value: "female-typical",
        label: "Apply female-typical setting or reference range",
        system: "http://terminology.hl7.org/CodeSystem/sex-parameter-for-clinical-use"
    },
    {
        show: "Male-Typical",
        value: "male-typical",
        label: "Apply male-typical setting or reference range",
        system: "http://terminology.hl7.org/CodeSystem/sex-parameter-for-clinical-use"
    },
    {
        show: "Specified",
        value: "specified",
        label: "Apply specified setting or reference range",
        system: "http://terminology.hl7.org/CodeSystem/sex-parameter-for-clinical-use"
    },
    {
        show: "Unknown",
        value: "unknown",
        label: "Unknown",
        system: "http://terminology.hl7.org/CodeSystem/data-absent-reason"
    }
];

export const sexParameterOptions = sexParameterOptionsList?.sort((a, b) =>
    a.show.localeCompare(b.show)
);
