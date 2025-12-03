import { Card, Col, Row } from 'react-bootstrap';
import TopMenu from './components/topMenu';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPatientsByIdAction } from '../../../../redux/actions';
import PatientInfoAccordion from './components/PatientInfoAccordion';
import { decryptMessage } from '../../../../cryptoUtils';
import PatientDemographics from './demographics';
import Spinner from '../../../../constants/Spinner';
import { useSelector } from 'react-redux';
import PatientSummary from './patientSummary/patientSummary';
import Documentsindex from './documents/Documentsindex';
import Encountersindex from './encounters/Encountersindex';
import ClinicalReview from './clinicalReview/ClinicalReview';
import SocialHistory from './socialHistory/socialHistory';
import LabRequest from './labRequest/LabRequest';

const UpdateIndex = () => {
    // Declarations
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const store = useSelector((state) => state);
    // VARIABLES AND STATE VARIABLES
    const id = searchParams.get('id');

    const [selectedMainTab, setSelectedMainTab] = useState('Patient Summary');
    const [activeKey, setActiveKey] = useState('0');
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [encounterTabs, setEncounterTabs] = useState([
        {
            id: 1,
            title: 'Encounter list',
            type: 'default',
        },
    ]);
    const [expanded, setExpanded] = useState(false);
    const [createEncounter, setCreateEncounter] = useState(false);

    // PROPS
    const topMenuProps = {
        selectedMainTab,
        setSelectedMainTab,
        activeSubmenu,
        setActiveSubmenu,
    };
    const encounterTabProps = {
        encounterTabs,
        setEncounterTabs,
        expanded,
        setExpanded,
        createEncounter,
        setCreateEncounter,
        activeKey
    };
    const patientInfoProps = {
        setSelectedMainTab,
        setCreateEncounter,
        setActiveKey,
        activeKey,
    };

    // USEEFFECTS
    useEffect(() => {
        if (id) {
            dispatch(getPatientsByIdAction({ id }));
        }
    }, [id]);

    useEffect(() => {
        try {
            const encryptedTab = sessionStorage?.getItem('selectedMainTab');
            const savedSubmenu = sessionStorage?.getItem('activeSubmenu');

            if (encryptedTab && encryptedTab !== 'undefined' && encryptedTab.trim().length > 0) {
                const tab = decryptMessage(encryptedTab);
                if (tab) {
                    setSelectedMainTab(tab);
                }
            } else {
                setSelectedMainTab('Patient Summary');
            }

            if (savedSubmenu && savedSubmenu !== 'null') {
                setActiveSubmenu(savedSubmenu);
            }
        } catch (error) {
            console.error('Error decrypting selectedMainTab:', error);
        }
    }, []);

    return (
        <div>
            {store?.getPatientsByIdReducer?.loading || !store?.getPatientsByIdReducer?.data?.data ? (
                <div className="d-flex align-items-center justify-content-center" style={{ height: '93vh' }}>
                    <Spinner />
                </div>
            ) : (
                <>
                    {!expanded && (
                        <Row>
                            <TopMenu {...topMenuProps} />
                            <PatientInfoAccordion {...patientInfoProps} />
                        </Row>
                    )}

                    <Row>
                        <Col sm={12}>
                            <Card className={`mt-1 pt-1 px-2 ${!activeKey ? 'patientChartCardClose' : 'patientChartCard'}`} style={{ height: expanded ? '90vh' : activeKey ? '74vh' : '85vh' }}>
                                {selectedMainTab === 'Patient Summary' && <PatientSummary activeKey={activeKey} />}
                                {selectedMainTab === 'Demographics' && <PatientDemographics activeKey={activeKey} />}
                                {selectedMainTab === 'Documents' && <Documentsindex />}
                                {selectedMainTab === 'Encounter' && <Encountersindex {...encounterTabProps} />}
                                {['Allergy List', 'Problem List', 'Medication List', 'Vitals List'].includes(
                                    selectedMainTab
                                ) && <ClinicalReview selectedMainTab={selectedMainTab} activeKey={activeKey} />}
                                {[
                                    'Tobacco',
                                    'Medical',
                                    'Surgical',
                                    'Family / Genetic',
                                    'Alcohol',
                                ].includes(selectedMainTab) && (
                                        <SocialHistory
                                            selectedMainTab={selectedMainTab}
                                            setSelectedMainTab={setSelectedMainTab}
                                        />
                                    )}
                                {selectedMainTab === 'Lab Request' && <LabRequest isAccordionOpen={!!activeKey} />}
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default UpdateIndex;
