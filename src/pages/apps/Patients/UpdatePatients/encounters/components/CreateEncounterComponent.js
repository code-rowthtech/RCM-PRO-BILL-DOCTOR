import React, { useState } from "react";
import EncounterForm from "./EncounterForm";
import EncounterLeftSection from "./EncounterLeftSection";

const CreateEncounterComponent = ({
    isCollapsed,
    activeKey,
    expanded,
    expandAllAccordions,
    appointmentData,
    onPrintRef,
    tabType,
    activeTabId
}) => {
    const [selectedFromList, setSelectedFromList] = useState({});
    const [populatedFields, setPopulatedFields] = useState({});
    return (
        <>
            <div className="row  h-100" >
                <div className={`border-end  ${isCollapsed ? 'd-none' : 'col-4'}`}>
                    <EncounterLeftSection
                        selectedFromList={selectedFromList}
                        setSelectedFromList={setSelectedFromList}
                        expanded={expanded}
                        activeHomeKey={activeKey}
                        populatedFields={populatedFields}
                    />
                </div>
                <div className={isCollapsed ? 'col-12' : 'col-8'}>
                    <EncounterForm
                        selectedFromList={selectedFromList}
                        expanded={expanded}
                        expandAllAccordions={expandAllAccordions}
                        activeHomeKey={activeKey}
                        appointmentData={appointmentData}
                        onPrintRef={onPrintRef}
                        tabType={tabType}
                        activeTabId={activeTabId}
                        onPopulatedFieldsChange={setPopulatedFields}
                    />
                </div>
            </div>
        </>
    );
};

export default CreateEncounterComponent;