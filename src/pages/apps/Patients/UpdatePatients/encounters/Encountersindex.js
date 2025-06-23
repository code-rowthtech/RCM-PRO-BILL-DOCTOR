import { useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import { HiMiniBars3BottomLeft } from 'react-icons/hi2';
import { BiCollapse, BiExpand } from 'react-icons/bi';
import { useDispatch } from "react-redux";
import { IoClose } from 'react-icons/io5';
import NewEncounterModal from "./components/NewEncounterModal";
import { Col, Row } from "react-bootstrap";
import EncounterList from "./components/EncounterList";
import CreateEncounter from "./components/CreateEncounter";
import EncounterSettings from "./components/EncounterSettings";

const Encountersindex = (props) => {
    const { encounterTabs, setEncounterTabs, expanded, setExpanded, createEncounter, setCreateEncounter } = props;
    const [activeTab, setActiveTab] = useState(encounterTabs[0]?.id || '');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [newEncounterModal, setNewEncounterModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const encounterListProps = {
        expanded, setExpanded, setCreateEncounter, encounterTabs, setEncounterTabs, setActiveTab
    }
    const removeEncounterTab = (idToRemove, e) => {
        if (e) e.stopPropagation();
        const newTabs = encounterTabs.filter(tab => tab.id !== idToRemove);
        setEncounterTabs(newTabs);

        if (activeTab === idToRemove) {
            setActiveTab(newTabs.length > 0 ? newTabs[0].id : '');
        }
    };

    useEffect(() => {
        if (createEncounter) {
            const today = new Date().toISOString().split('T')[0];

            // Check if there's already a createEncounter tab for today
            const existingTodayTab = encounterTabs.find(
                (tab) => tab.type === 'createEncounter' && tab.title === today
            );

            if (existingTodayTab) {
                setNewEncounterModal(true);
            } else {
                // Proceed to create new tab
                const newTab = {
                    id: Date.now(),
                    title: today,
                    type: 'createEncounter',
                };
                setEncounterTabs([...encounterTabs, newTab]);
                setActiveTab(newTab.id);
            }

            setCreateEncounter(false);
        }
    }, [createEncounter]);

    const closeNewEncounterModal = () => setNewEncounterModal(false);

    const createNewEncounter = () => {
        const newTab = {
            id: Date.now(),
            title: new Date().toISOString().split('T')[0],
            type: 'createEncounter',
        };
        setEncounterTabs([...encounterTabs, newTab]);
        setActiveTab(newTab.id);
        setNewEncounterModal(false);
    }
    return (
        <div className="row pt-2 pb-1">
            <div className="col-12 d-flex align-items-center justify-content-between px-2 " style={{ height: 'fit-content' }}>
                <div className="d-flex align-items-center ">
                    {encounterTabs?.length > 1 &&
                        <>
                            <HiMiniBars3BottomLeft
                                onClick={toggleCollapse}
                                className='fw-bold fs-4 mx-1 cursor-pointer text-black' />
                            <CiSettings
                                onClick={() => setShowSettings(!showSettings)}
                                className='fw-bold fs-4 mx-1 cursor-pointer text-black' />
                        </>}
                    <EncounterSettings showSettings={showSettings} closeSettings={() => setShowSettings(false)} />
                    {encounterTabs?.map((tab) => (
                        <div
                            key={tab?.id}
                            className={`cursor-pointer p-1 fs-6 rounded-0 list-group-item  
                                    d-flex align-items-center flex-fill justify-content-center fw-bold 
                                     ${activeTab === tab?.id ? 'active-patient-chart-tab fw-medium border border-muted' : 'border border-muted'}`}
                            onClick={() => {
                                if (tab?.type !== 'default') {
                                    setExpanded(true);
                                }
                                if (tab?.type === 'updateEncounter') {
                                    // dispatch(getEncounterByIdAction({ encounterId: tab?.id }))
                                }
                                setActiveTab(tab?.id)
                            }}
                        >
                            <span className="text-nowrap">{tab?.title}</span>
                            {tab.type !== 'default' && (
                                <span
                                    className="p-0 ms-2 m-0"
                                    onClick={(e) => removeEncounterTab(tab?.id, e)}
                                >
                                    <IoClose />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                {expanded ?
                    <BiCollapse className='text-primary fw-bold fs-4 cursor-pointer me-2' onClick={() => setExpanded(!expanded)} />
                    :
                    <BiExpand className='text-primary fw-bold fs-4 cursor-pointer me-2' onClick={() => setExpanded(!expanded)} />
                }
            </div>
            <Row>
                <Col sm={12}>
                    {encounterTabs?.map((tab) => (
                        <div key={tab.id} className="mt-1" style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                            {tab?.type === 'default' ? (
                                <EncounterList {...encounterListProps} />
                            ) : (
                                <CreateEncounter isCollapsed={isCollapsed} />
                            )}
                        </div>
                    ))}
                </Col>
            </Row>
            <NewEncounterModal showModal={newEncounterModal} closeNewEncounterModal={closeNewEncounterModal} createNewEncounter={createNewEncounter} />
        </div>
    )
}

export default Encountersindex;