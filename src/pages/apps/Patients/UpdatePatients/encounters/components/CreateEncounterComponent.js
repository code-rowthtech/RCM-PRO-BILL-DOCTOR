import React, { useState } from "react";
import EncounterForm from "./EncounterForm";
import EncounterLeftSection from "./EncounterLeftSection";

const CreateEncounterComponent = ({ isCollapsed, expanded, expandAllAccordions }) => {
    const [selectedFromList, setSelectedFromList] = useState({});

    return (
        <>
            <div className="row">
                <div className={`border-end ${isCollapsed ? 'd-none' : 'col-4'}`}>
                    <EncounterLeftSection
                        selectedFromList={selectedFromList}
                        setSelectedFromList={setSelectedFromList}
                        expanded={expanded}
                    />
                </div>
                <div className={isCollapsed ? 'col-12' : 'col-8'}>
                    <EncounterForm
                        selectedFromList={selectedFromList}
                        expanded={expanded}
                        expandAllAccordions={expandAllAccordions}
                    />
                </div>
            </div>
        </>
    );
};

export default CreateEncounterComponent;