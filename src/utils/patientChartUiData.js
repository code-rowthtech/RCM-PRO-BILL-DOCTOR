import { MdMedicalInformation } from 'react-icons/md';
import { MdOutlinePreview } from 'react-icons/md';
import { AiOutlineInteraction } from 'react-icons/ai';
import { FaPersonHarassing, FaUserDoctor } from 'react-icons/fa6';
import { TbHeartRateMonitor, TbReportSearch } from 'react-icons/tb';
import { SiPrivateinternetaccess } from 'react-icons/si';
import { GrContact } from 'react-icons/gr';
import { RiImageEditFill } from 'react-icons/ri';
import { FiPlus } from 'react-icons/fi';
import { IoDocumentsOutline } from 'react-icons/io5';

export const patientMenuItems = [
    { label: 'Patient Summary', tab: "Patient Summary", icon: <MdMedicalInformation /> },
    { label: 'Demographics', tab: "Demographics", icon: <TbHeartRateMonitor /> },
    { label: 'Documents', tab: "Documents", icon: <IoDocumentsOutline /> },
    { label: 'Encounters', tab: "Encounter", icon: <FaPersonHarassing /> },
    {
        label: 'Clinical Review',
        icon: <MdOutlinePreview />,
        subItems: [
            { label: 'Allergy List', tab: "Allergy List", icon: <FiPlus /> },
            { label: 'Problem List', tab: "Problem List", icon: <FiPlus /> },
            { label: 'Medication List', tab: "Medication List", icon: <FiPlus /> },
            { label: 'Vitals List', tab: "Vitals List", icon: <FiPlus /> },
        ],
    },
    {
        label: 'Social History',
        icon: <MdOutlinePreview />,
        subItems: [
            { label: 'Tobacco History', tab: "Tobacco", icon: <FiPlus /> },
            { label: 'Medical History', tab: "Medical", icon: <FiPlus /> },
            { label: 'Surgical History', tab: "Surgical", icon: <FiPlus /> },
            { label: 'Family History', tab: "Family / Genetic", icon: <FiPlus /> },
            { label: 'Alcohol History', tab: "Alcohol", icon: <FiPlus /> },
        ],
    },
    { label: 'Drug Interactions', tab: "Drug Interactions", icon: <AiOutlineInteraction /> },
    { label: 'Lab Request', tab: "Lab Request", icon: <TbReportSearch /> },
    { label: 'Patient Access', tab: "Patient Access", icon: <SiPrivateinternetaccess /> },
    { label: 'Imaging Requests', tab: "Imaging Requests", icon: <RiImageEditFill /> },
    { label: 'Communication', tab: "Communication", icon: <GrContact /> },
    { label: 'Task', tab: "Task", icon: <FaUserDoctor /> },
];

export const PatientDemographicTabs = [
    'Patient Details',
    'Demographics',
    'Responsible Party',
    'Reffering Doctor',
    // 'Insurances',
    // 'Eligibility',
    // 'Authorizations',
]

export const clinicalReviewTabs = [
    'Allergy List', 'Problem List', 'Medication List', 'Vitals List',
]

export const socialHistoryTabs = [
    'Tobacco', 'Medical', 'Surgical', 'Family / Genetic', 'Alcohol'
]