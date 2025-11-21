import React, { useState } from "react";
import EncounterForm from "./EncounterForm";
import EncounterLeftSection from "./EncounterLeftSection";

const CreateEncounterComponent = ({ isCollapsed, activeKey, expanded, expandAllAccordions }) => {
    const [selectedFromList, setSelectedFromList] = useState({});

    return (
        <>
            <div className="row  h-100" >
                <div className={`border-end  ${isCollapsed ? 'd-none' : 'col-4'}`}>
                    <EncounterLeftSection
                        selectedFromList={selectedFromList}
                        setSelectedFromList={setSelectedFromList}
                        expanded={expanded}
                        activeHomeKey={activeKey}
                    />
                </div>
                <div className={isCollapsed ? 'col-12' : 'col-8'}>
                    <EncounterForm
                        selectedFromList={selectedFromList}
                        expanded={expanded}
                        expandAllAccordions={expandAllAccordions}
                        activeHomeKey={activeKey}
                    />
                </div>
            </div>
        </>
    );
};

export default CreateEncounterComponent;