import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import DeviceOrder from "./CQIsTabs/DeviceOrder/DeviceOrder";
import Intervention from "./CQIsTabs/Intervention/Intervention";
import RiskCategory from "./CQIsTabs/RiskCategory/RiskCategory";
import PhysicalExam from "./CQIsTabs/PhysicalExam/PhysicalExam";
import Communication from "./CQIsTabs/Communication/Communication";
import Condition from "./ViewInformationTabs/Condition";
import Encounter from "./ViewInformationTabs/Encounter";
import Procedure from "./ViewInformationTabs/Procedure";
import Medication from "./ViewInformationTabs/Medication";
import LabTest from "./ViewInformationTabs/LabTest";

const CQIs = () => {
    const [activeTab, setActiveTab] = useState("Device Order");
    const [activeSubTab, setActiveSubTab] = useState("Condition/Diagnosis/Problem");
    const [showSubTabs, setShowSubTabs] = useState(false);

    const handleMainTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleSubTabChange = (subTab) => {
        setActiveSubTab(subTab);
    };

    const options = [
        { value: "device-order", label: "Device Order" },
        { value: "intervention", label: "Intervention" },
        { value: "risk-category", label: "Risk Category/Assessment" },
        { value: "physical-exam", label: "Physical Exam" },
        { value: "communication", label: "Communication" }
    ];

    return (
        <div className="mt-2">
            <Card className="px-2" style={{ height: "70vh" }}>
                <div className="pt-2 px-2">
                    <div className="d-flex justify-content-between">
                        <h4>Care Quality Indicators (CQIs)</h4>
                        <Button className="custom-buttons">
                            <FiPlus className="fs-5 text-white" /> &nbsp;Task
                        </Button>
                    </div>

                    {/* Tabs Section or SubTabs Section */}
                    {!showSubTabs ? (
                        <>
                            {/* Main Tabs */}
                            <div className="d-flex justify-content-between ">
                                <div style={{ borderBottom: "2px solid grey" }}>
                                    <ul className="nav nav-underline">
                                        {["Device Order", "Intervention", "Risk Category/Assessment", "Physical Exam", "Communication"].map((tab) => (
                                            <li className="nav-item" key={tab}>
                                                <a
                                                    className={`nav-link me-3 pb-0 tab-font-family ${activeTab === tab ? "active text-primary fw-bold" : "text-secondary fw-semibold"}`}
                                                    onClick={() => handleMainTabChange(tab)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {tab}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-1">
                                    <Button className="custom-buttons" onClick={() => setShowSubTabs(true)}>
                                        <FaEye className="fs-5 text-white" />
                                        &nbsp; Information
                                    </Button>
                                    <div className="btn-group">
                                        <button type="button" className="custom-buttons px-2 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            <FiPlus className="fs-5 text-white" /> &nbsp;Add New
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            {options.map((option) => (
                                                <li key={option.value}>
                                                    <label className="dropdown-item d-flex align-items-center">
                                                        <input type="radio" name="options" value={option.value} className="me-2" /> {option.label}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Section */}
                            <div className="mt-2 scroll-container" style={{ height: "65vh", overflow: "auto" }}>
                                {activeTab === "Device Order" && <DeviceOrder deviceOrders={[]} />}
                                {activeTab === "Intervention" && <Intervention interventions={[]} />}
                                {activeTab === "Risk Category/Assessment" && <RiskCategory riskCategories={[]} />}
                                {activeTab === "Physical Exam" && <PhysicalExam physicalExams={[]} />}
                                {activeTab === "Communication" && <Communication communications={[]} />}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* SubTabs */}
                            <div className="d-flex justify-content-between">
                                <div style={{ borderBottom: "2px solid grey" }}>
                                    <ul className="nav nav-underline">
                                        {[
                                            "Condition/Diagnosis/Problem",
                                            "Encounter",
                                            "Procedure",
                                            "Medication",
                                            "Lab Test/Function Status/Diagnostic Study",
                                        ].map((subTab) => (
                                            <li className="nav-item" key={subTab}>
                                                <a
                                                    className={`nav-link me-3 pb-0  ${activeSubTab === subTab ? "active text-primary fw-bold" : "text-secondary fw-semibold "}`}
                                                    onClick={() => handleSubTabChange(subTab)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {subTab}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Back Button */}
                                <div className="d-flex gap-1">
                                    <Button className="custom-buttons" onClick={() => setShowSubTabs(false)}>
                                        Back
                                    </Button>
                                </div>
                            </div>

                            {/* SubTabs Content Section */}
                            <div className="mt-2 scroll-container" style={{ height: "65vh", overflow: "auto" }}>
                                {activeSubTab === "Condition/Diagnosis/Problem" && <Condition />}
                                {activeSubTab === "Encounter" && <Encounter />}
                                {activeSubTab === "Procedure" && <Procedure />}
                                {activeSubTab === "Medication" && <Medication />}
                                {activeSubTab === "Lab Test/Function Status/Diagnostic Study" && <LabTest />}
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CQIs;
