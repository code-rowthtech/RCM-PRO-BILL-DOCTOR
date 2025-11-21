import React, { useState } from 'react'
import { Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import SummarySection from './SummarySection';
import TemplatesSection from './TemplatesSection';
import PastEncountersSection from './PastEncountersSection';

const EncounterLeftSection = ({ selectedFromList, setSelectedFromList, expanded, activeHomeKey }) => {
    const store = useSelector((state) => state);
    const [leftSectionActive, setLeftSectionActive] = useState('Summary');
    const defaultTabs = ['Summary', 'Templates', 'Past Encounters'];
    const [activeKey, setActiveKey] = useState("0");

    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    const visibleTabs =
        settingsDataMainItems?.length > 0
            ? settingsDataMainItems?.filter((item) => item?.show === true)
            : defaultTabs.map((name, index) => ({
                _id: index.toString(),
                name,
            }));

    const handleToggle = (key) => {
        setActiveKey(prev => (prev === key ? null : key));
    };


    return (
        <div className='d-flex flex-column '>
            <ul className='d-flex  list-unstyled mt-0 mb-0 flex-shrink-0'>
                {visibleTabs?.map((item) => (
                    <li
                        key={item?._id}
                        onClick={() => setLeftSectionActive(item?.name)}
                        className={`cursor-pointer p-1 fs-6 rounded-0 list-group-item  
                    d-flex align-items-center flex-fill justify-content-center fw-bold 
                    ${item.name === leftSectionActive ? 'active-patient-chart-tab fw-medium' : 'border border-muted'}`}>
                        {item?.name}
                    </li>
                ))}
            </ul>
            <div className='  scroll-container flex-grow-1 ' style={{ height: expanded ? '77vh' : activeHomeKey ? '60vh' : '73vh' }} >
                <Row className='position-relative scroll-container '>
                    {leftSectionActive === 'Summary' && (
                        <SummarySection
                            activeKey={activeKey}
                            handleToggle={handleToggle}
                        />
                    )}
                    {leftSectionActive === 'Templates' && (
                        <TemplatesSection
                            selectedFromList={selectedFromList}
                            setSelectedFromList={setSelectedFromList}
                        />
                    )}
                    {leftSectionActive === 'Past Encounters' && <PastEncountersSection />}
                </Row>
            </div>
        </div>
    )
}

export default EncounterLeftSection