// React imports
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

// Redux imports
import { getNoteSettingAimport } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotesCategoriesAction } from "redux/noteCategories/action";
import { getEncounterSettingsAction } from "redux/actions";

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

/**
 * Encountersindex Component
 * Main container for encounter management with tabbed interface
 * Features: Tab management, encounter list/create views, settings, expand/collapse
 */
const Encountersindex = (props) => {
    // Props destructuring
    const {
        encounterTabs,
        setEncounterTabs,
        expanded,
        setExpanded,
        createEncounter,
        setCreateEncounter
    } = props;

    // Hooks initialization
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    // Component state management
    const [activeTab, setActiveTab] = useState(encounterTabs[0]?.id || ''); // Currently active tab
    const [isCollapsed, setIsCollapsed] = useState(false); // Tab bar collapse state
    const [newEncounterModal, setNewEncounterModal] = useState(false); // Duplicate encounter modal
    const [showSettings, setShowSettings] = useState(false); // Settings panel visibility
    const [expandAllAccordions, setExpandAllAccordions] = useState(false); // Accordion expand state

    // Effect hooks

    // Load encounter settings on component mount
    useEffect(() => {
        dispatch(getEncounterSettingsAction({ doctorId: store?.Auth?.user?.doctorId }));
    }, [dispatch, store?.Auth?.user?.doctorId]);

    // Handle create encounter trigger
    useEffect(() => {
        if (createEncounter) {
            handleCreateEncounterRequest();
            setCreateEncounter(false);
        }
    }, [createEncounter, encounterTabs, setEncounterTabs, setCreateEncounter]);

    // Event handlers

    /**
     * Handle create encounter request
     * Checks for existing tab and shows modal if duplicate exists
     */
    const handleCreateEncounterRequest = () => {
        const today = new Date().toISOString().split('T')[0];

        // Check if there's already a createEncounter tab for today
        const existingTodayTab = encounterTabs.find(
            (tab) => tab.type === 'createEncounter' && tab.title === today
        );

        if (existingTodayTab) {
            setNewEncounterModal(true);
        } else {
            createNewEncounterTab();
        }
    };

    /**
     * Create new encounter tab
     * Adds new tab and sets it as active
     */
    const createNewEncounterTab = () => {
        const newTab = {
            id: Date.now(),
            title: new Date().toISOString().split('T')[0],
            type: 'createEncounter',
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
        if (activeTabData?.type !== 'default') {
            const encounterData = {
                providerId: { name: [{ use: 'official', text: store?.Auth?.user?.name || 'Provider' }] },
                period: { start: new Date().toISOString() },
                status: 'in-progress',
                type: [{ coding: [{ display: 'Standard Visit' }] }],
                data: []
            };
            const patientDetails = store?.getPatientsByIdReducer?.data?.data;
            // Import and use print function
            import('./utils/handlePrintEncounter').then(({ handlePrintEncounters }) => {
                handlePrintEncounters(encounterData, patientDetails);
            });
        }
    };

    // Ready for billing handler
    const handleReadyForBilling = () => {
        console.log('Ready for billing clicked');
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

                    {/* Settings Panel */}
                    <EncounterSettingsForm
                        showSettings={showSettings}
                        closeSettings={() => setShowSettings(false)}
                    />

                    {/* Tab List */}
                    {encounterTabs?.map((tab) => (
                        <div
                            key={tab?.id}
                            className={`cursor-pointer p-1 fs-6 rounded-0 list-group-item  
                                d-flex align-items-center flex-fill justify-content-center fw-bold 
                                ${activeTab === tab?.id
                                    ? 'active-patient-chart-tab fw-medium border border-muted'
                                    : 'border border-muted'}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            <span className="text-nowrap">{tab?.title}</span>

                            {/* Close button for non-default tabs */}
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

                {/* Action Buttons */}
                <div className="d-flex align-items-center gap-2">
                    {(() => {
                        const activeTabData = encounterTabs.find(tab => tab.id === activeTab);
                        const isFormTab = activeTabData?.type !== 'default';
                        return isFormTab && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline-secondary"
                                    className="d-flex align-items-center gap-1 px-2 py-1"
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
                                    variant="outline-primary"
                                    className="d-flex align-items-center gap-1 px-2 py-1"
                                    onClick={handlePrint}
                                    title="Print"
                                >
                                    <MdPrint size={18} />
                                    <span className="small">Print</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline-success"
                                    className="d-flex align-items-center gap-1 px-2 py-1"
                                    form="encounter-form"
                                    type="submit"
                                    title="Save"
                                >
                                    <MdSave size={18} />
                                    <span className="small">Save</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline-info"
                                    className="d-flex align-items-center gap-1 px-2 py-1"
                                    onClick={handleReadyForBilling}
                                    title="Ready for Billing"
                                >
                                    <FaFileInvoiceDollar size={16} />
                                    <span className="small">Billing</span>
                                </Button>
                            </>
                        );
                    })()}

                    {/* Expand/Collapse Toggle */}
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

            {/* Tab Content Section */}
            <Row>
                <Col sm={12}>
                    {encounterTabs?.map((tab) => (
                        <div
                            key={tab.id}
                            className="mt-1"
                            style={{ display: activeTab === tab.id ? 'block' : 'none' }}
                        >
                            {/* Render appropriate component based on tab type */}
                            {tab?.type === 'default' ? (
                                <EncounterList {...encounterListProps} />
                            ) : (
                                <CreateEncounterComponent
                                    activeTabId={activeTab}
                                    tabType={tab?.type}
                                    expanded={expanded}
                                    isCollapsed={isCollapsed}
                                    expandAllAccordions={expandAllAccordions}
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
        </div>
    );
};

export default Encountersindex;