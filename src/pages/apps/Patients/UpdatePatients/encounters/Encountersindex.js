// React imports
import { useEffect, useState, useRef } from "react";
import { Col, Row } from "react-bootstrap";

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { getNotesCategoriesAction } from "redux/noteCategories/action";
import { getEncounterSettingsAction, getDoctorsAction } from "redux/actions";

// Icon imports
import { CiSettings } from "react-icons/ci";
import { HiMiniBars3BottomLeft } from 'react-icons/hi2';
import { BiCollapse, BiExpand } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { MdPrint, MdSave } from 'react-icons/md';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

// Component imports
import EncounterList from "./components/EncounterList";
import DuplicateEncounterModal from "./components/DuplicateEncounterModal";
import CreateEncounterComponent from "./components/CreateEncounterComponent";
import EncounterSettingsForm from "./components/EncounterSettings";
import AppointmentSelectionModal from "./components/AppointmentSelectionModal";

// Hooks
import { useAppointmentIntegration } from './hooks/useAppointmentIntegration';
import { useFieldPopulation } from './hooks/useFieldPopulation';

// Utils
import { formatDate } from '../../../../../helpers/dateFormat';
import { useSearchParams } from 'react-router-dom';

const Encountersindex = (props) => {
    // Props destructuring
    const {
        encounterTabs,
        setEncounterTabs,
        expanded,
        setExpanded,
        createEncounter,
        setCreateEncounter, activeKey
    } = props;

    // Hooks initialization
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(encounterTabs[0]?.id || '');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [newEncounterModal, setNewEncounterModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [expandAllAccordions, setExpandAllAccordions] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    const { processAppointmentSelection, selectedAppointmentData } = useAppointmentIntegration();
    const { markPopulatedDataComplete } = useFieldPopulation();
    const printRef = useRef();
    const id = searchParams.get('id');

    // Load encounter settings on component mount
    useEffect(() => {
        dispatch(getEncounterSettingsAction({ doctorId: store?.Auth?.user?.doctorId }));
    }, [dispatch, store?.Auth?.user?.doctorId]);

    // Handle create encounter trigger with appointment selection
    useEffect(() => {
        if (createEncounter) {
            setShowAppointmentModal(true);
            setCreateEncounter(false);
        }
    }, [createEncounter, setCreateEncounter]);

    /**
     * Handle appointment selection for encounter creation
     */
    const handleAppointmentSelection = (appointmentData) => {
        processAppointmentSelection(appointmentData);

        const today = new Date().toISOString().split('T')[0];
        const existingTodayTab = encounterTabs.find(
            (tab) => tab.type === 'createEncounter' && tab.title === today
        );

        if (existingTodayTab) {
            setNewEncounterModal(true);
        } else {
            const newTab = {
                id: Date.now(),
                title: today,
                type: 'createEncounter',
                appointmentData: appointmentData
            };
            setEncounterTabs([...encounterTabs, newTab]);
            setActiveTab(newTab.id);
        }
        setShowAppointmentModal(false);
    };

    /**
     * Create new encounter tab with appointment data
     */
    const createNewEncounterTab = () => {
        const newTab = {
            id: Date.now(),
            title: new Date().toISOString().split('T')[0],
            type: 'createEncounter',
            appointmentData: selectedAppointmentData
        };
        setEncounterTabs([...encounterTabs, newTab]);
        setActiveTab(newTab.id);
    };

    /**
     * Remove encounter tab
     * Handles tab removal and active tab switching
     */
    const removeEncounterTab = (idToRemove, e) => {
        if (e) e.stopPropagation();

        const newTabs = encounterTabs.filter(tab => tab.id !== idToRemove);
        setEncounterTabs(newTabs);

        // Switch active tab if removed tab was active
        if (activeTab === idToRemove) {
            setActiveTab(newTabs.length > 0 ? newTabs[0].id : '');
        }
    };

    /**
     * Handle tab click
     * Sets active tab and manages expanded state
     */
    const handleTabClick = (tab) => {
        if (tab?.type !== 'default') {
            setExpanded(true);
        }
        setActiveTab(tab?.id);
    };

    // UI control handlers
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const closeNewEncounterModal = () => setNewEncounterModal(false);
    const createNewEncounter = () => {
        createNewEncounterTab();
        setNewEncounterModal(false);
    };

    // Print handler
    const handlePrint = () => {
        const activeTabData = encounterTabs.find(tab => tab.id === activeTab);

        if (activeTabData?.type === 'updateEncounter' || activeTabData?.type === 'createEncounter') {
            if (printRef.current) {
                printRef.current();
            } else {
                console.warn('Cannot print: Print function not available');
            }
        } else {
            console.warn('Cannot print: No active encounter selected');
        }
    };

    // Ready for billing handler with populated data completion
    const handleReadyForBilling = () => {
        const isComplete = markPopulatedDataComplete();
        if (isComplete) {
            console.log('Ready for billing - all populated data marked as complete');
            // Additional billing logic can be added here
        } else {
            console.log('Ready for billing clicked - no populated data to mark');
        }
    };

    // Props for child components
    const encounterListProps = {
        expanded,
        setExpanded,
        setCreateEncounter,
        encounterTabs,
        setEncounterTabs,
        setActiveTab
    };
    return (
        <div className="row pt-2 pb-1">
            {/* Tab Header Section */}
            <div className="col-12 d-flex align-items-center justify-content-between px-2"
                style={{ height: 'fit-content' }}>
                {/* Tab Navigation */}
                <div className="d-flex align-items-center">
                    {/* Control Icons - Only show when multiple tabs exist */}
                    {encounterTabs?.length > 1 && (
                        <>
                            <HiMiniBars3BottomLeft
                                onClick={toggleCollapse}
                                className='fw-bold fs-4 mx-1 cursor-pointer text-black'
                                title="Toggle tab collapse"
                            />
                            <CiSettings
                                onClick={() => setShowSettings(!showSettings)}
                                className='fw-bold fs-4 mx-1 cursor-pointer text-black'
                                title="Encounter settings"
                            />
                        </>
                    )}
                    <EncounterSettingsForm
                        showSettings={showSettings}
                        closeSettings={() => setShowSettings(false)}
                    />
                    {encounterTabs?.map((tab) => (
                        <div
                            key={tab?.id}
                            className={`${encounterTabs?.length > 1 ? 'cursor-pointer' : ''} p-1 fs-6 rounded-0 list-group-item  
                                d-flex align-items-center flex-fill justify-content-center fw-bold 
                                ${activeTab === tab?.id
                                    ? 'active-patient-chart-tab fw-medium border border-muted'
                                    : 'border border-muted'}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            <span className="text-nowrap">{tab?.title === 'Encounter list' ? tab?.title : formatDate(tab?.title)}</span>

                            {tab.type !== 'default' && (
                                <span
                                    className="p-0 ms-2 m-0"
                                    onClick={(e) => removeEncounterTab(tab?.id, e)}
                                    title="Close tab"
                                >
                                    <IoClose />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="d-flex align-items-center gap-2">
                    {(() => {
                        const activeTabData = encounterTabs.find(tab => tab.id === activeTab);
                        const isFormTab = activeTabData?.type !== 'default';
                        return isFormTab && (
                            <>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="encounter-header-buttons gap-1 px-2 py-1"
                                    onClick={() => {
                                        const newState = !expandAllAccordions;
                                        setExpandAllAccordions(newState);
                                    }}
                                    title={expandAllAccordions ? 'Minimize All' : 'Expand All'}
                                >
                                    <span className="small">{expandAllAccordions ? 'Minimize All' : 'Expand All'}</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    className="encounter-header-buttons gap-1 px-2 py-1"
                                    onClick={handlePrint}
                                    title="Print"
                                >
                                    <MdPrint size={18} />
                                    <span className="small">Print</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="success"
                                    className="encounter-header-buttons gap-1 px-2 py-1"
                                    form="encounter-form"
                                    type="submit"
                                    title="Save"
                                    disabled={store?.createEncounterReducer?.loading || store?.updateEncounterReducer?.loading}
                                >
                                    <MdSave size={18} />
                                    <span className="small">Save</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="info"
                                    className="encounter-header-buttons gap-1 px-2 py-1"
                                    onClick={handleReadyForBilling}
                                    title="Ready for Billing"
                                >
                                    <FaFileInvoiceDollar size={16} />
                                    <span className="small">Billing</span>
                                </Button>
                            </>
                        );
                    })()}
                    {expanded ? (
                        <BiCollapse
                            className='text-primary fw-bold fs-4 cursor-pointer'
                            onClick={() => setExpanded(!expanded)}
                            title="Collapse panel"
                        />
                    ) : (
                        <BiExpand
                            className='text-primary fw-bold fs-4 cursor-pointer'
                            onClick={() => setExpanded(!expanded)}
                            title="Expand panel"
                        />
                    )}
                </div>
            </div>
            <Row>
                <Col sm={12}>
                    {encounterTabs?.map((tab) => (
                        <div
                            key={tab.id}
                            className="mt-1 "
                            style={{ display: activeTab === tab.id ? 'block' : 'none' }}
                        >
                            {tab?.type === 'default' ? (
                                <EncounterList {...encounterListProps} />
                            ) : (
                                <CreateEncounterComponent
                                    activeTabId={activeTab}
                                    tabType={tab?.type}
                                    expanded={expanded}
                                    activeKey={activeKey}
                                    isCollapsed={isCollapsed}
                                    expandAllAccordions={expandAllAccordions}
                                    appointmentData={tab?.appointmentData}
                                    onPrintRef={printRef}
                                />
                            )}
                        </div>
                    ))}
                </Col>
            </Row>
            {/* Duplicate Encounter Modal */}
            <DuplicateEncounterModal
                show={newEncounterModal}
                onHide={closeNewEncounterModal}
                onCreateNew={createNewEncounter}
            />

            {/* Appointment Selection Modal */}
            <AppointmentSelectionModal
                show={showAppointmentModal}
                onHide={() => setShowAppointmentModal(false)}
                onAppointmentSelect={handleAppointmentSelection}
                patientId={id}
            />
        </div>
    );
};

export default Encountersindex;