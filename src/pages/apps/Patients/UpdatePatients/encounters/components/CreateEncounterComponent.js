import React, { useState } from "react";
import EncounterForm from "./EncounterForm";
import EncounterLeftSection from "./EncounterLeftSection";

const CreateEncounterComponent = ({ isCollapsed, expanded }) => {
    const [selectedFromList, setSelectedFromList] = useState({});

    return (
        <>
            <div className="row">
                <div className="border-end col-4">
                    <EncounterLeftSection 
                        selectedFromList={selectedFromList}
                        setSelectedFromList={setSelectedFromList}
                        expanded={expanded}
                    />
                </div>
                <div className="col-8">
                    <EncounterForm 
                        selectedFromList={selectedFromList}
                        expanded={expanded}
                    />
                </div>
            </div>
        </>
    );
};

export default CreateEncounterComponent;