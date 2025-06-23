import React from 'react'
import { Button, Modal } from 'react-bootstrap';

const NewEncounterModal = ({ showModal, closeNewEncounterModal, createNewEncounter }) => {
    return (
        <Modal show={showModal} onHide={closeNewEncounterModal} size="md" centered>
            <Modal.Body className='p-4'>
                <div className="text-center mb-4">
                    <i className="bi bi-exclamation-circle-fill text-warning fs-1"></i>
                    <h5 className="mt-2 fw-semibold">Duplicate Encounter Detected</h5>
                </div>
                <div className="text-muted mb-4 text-center">
                    An encounter for this patient already exists for today. Would you like to update the existing encounter or create a new one?
                </div>
                <div className="d-flex justify-content-center gap-3 pt-2">
                    <Button
                        className="px-4 custom-buttons"
                        onClick={closeNewEncounterModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="px-4 custom-buttons"
                        onClick={createNewEncounter}
                    >
                        Create New
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default NewEncounterModal