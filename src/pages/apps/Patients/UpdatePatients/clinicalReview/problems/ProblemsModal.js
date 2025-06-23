import React from 'react'
import { Modal } from 'react-bootstrap'

const ProblemsModal = ({ show, closeModal }) => {
    return (
        <Modal show={show} onHide={closeModal} size="lg" centered>
            <Modal.Header closeButton className="px-2 py-0 ">
                <Modal.Title className="mb-0">Add Problem</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
        </Modal>
    )
}

export default ProblemsModal