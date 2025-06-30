import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const EncounterSummary = () => {
    const store = useSelector((state) => state);
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    const defaultTabs = ['Summary', 'Templates', 'Past Encounters'];
    const visibleTabs =
        settingsDataMainItems?.length > 0
            ? settingsDataMainItems?.filter((item) => item?.show === true)
            : defaultTabs.map((name, index) => ({
                _id: index.toString(),
                name,
            }));
    const [leftTab, setLeftTab] = useState('Summary');

    return (
        <div>
            <ul className='d-flex list-unstyled mt-0 mb-0' style={{ height: 'fit-content' }}>
                {visibleTabs?.map((item) => (
                    <li
                        key={item?._id}
                        onClick={() => setLeftTab(item?.name)}
                        className={`cursor-pointer p-1 fs-6 rounded-0 list-group-item  
                    d-flex align-items-center flex-fill justify-content-center fw-bold 
                    ${item.name === leftTab ? 'active-patient-chart-tab fw-medium' : 'border border-muted'}`}>
                        {item?.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default EncounterSummary;