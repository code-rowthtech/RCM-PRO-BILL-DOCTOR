import React, { useState, useMemo } from 'react';
import { TbReportSearch } from 'react-icons/tb';
import { Button } from 'react-bootstrap';
import LabRequestDashboard from './LabRequestDashboard';
import LabRequestForm from './LabRequestForm';
import LabRequestDetails from './LabRequestDetails';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const LabRequest = ({ isAccordionOpen }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const patientDetails = store?.getPatientsByIdReducer?.data?.data;

    const cardHeight = useMemo(() => {
        return isAccordionOpen ? '66.5vh' : '81.5vh';
    }, [isAccordionOpen]);

    const handleCreateNew = () => {
        setSelectedRequest(null);
        setActiveView('form');
    };

    const handleViewRequest = (request) => {
        setSelectedRequest(request);
        setActiveView('details');
    };

    const handleEditRequest = (request) => {
        setSelectedRequest(request);
        setActiveView('form');
    };

    const handleBackToDashboard = () => {
        setSelectedRequest(null);
        setActiveView('dashboard');
    };

    const renderHeader = () => (
        <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
                <TbReportSearch className="fs-4 text-primary" />
                <h5 className="fw-bold">
                    Lab Requests
                </h5>
            </div>
            {activeView === 'dashboard' && (
                <Button onClick={handleCreateNew} className="custom-buttons">
                    New Lab Order
                </Button>
            )}
            {(activeView === 'form' || activeView === 'details') && (
                <Button onClick={handleBackToDashboard} className="custom-buttons">
                    Back to List
                </Button>
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeView) {
            case 'form':
                return (
                    <LabRequestForm
                        patientId={patientId}
                        patientDetails={patientDetails}
                        selectedRequest={selectedRequest}
                        onSuccess={handleBackToDashboard}
                        onCancel={handleBackToDashboard}
                    />
                );
            case 'details':
                return (
                    <LabRequestDetails
                        request={selectedRequest}
                        patientDetails={patientDetails}
                        onEdit={handleEditRequest}
                        onBack={handleBackToDashboard}
                    />
                );
            default:
                return (
                    <LabRequestDashboard
                        patientId={patientId}
                        patientDetails={patientDetails}
                        onViewRequest={handleViewRequest}
                        onEditRequest={handleEditRequest}
                        onCreateNew={handleCreateNew}
                    />
                );
        }
    };

    return (
        <div
            className="scroll-container"
            style={{
                height: cardHeight,
                overflowY: 'auto',
                padding: '0 15px'
            }}
        >
            {renderHeader()}
            {renderContent()}
        </div>
    );
};

export default LabRequest;