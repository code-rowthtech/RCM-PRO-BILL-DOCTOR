import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import DocumentsCard from './components/DocumentsCard'
import UploadDocumentsModal from './components/UploadDocumentsModal'

const Documentsindex = () => {
    const [showModal, setShowModal] = useState(false);
    const closeDocumentModal = () => setShowModal(false);
    const openDocumentModal = () => setShowModal(true);
    return (
        <Row>
            <Col sm={12}>
                <div className="d-flex justify-content-between align-items-center">
                    <h5>Patient Documents</h5>
                    <Button onClick={() => openDocumentModal()} className='custom-buttons'>
                        Upload
                    </Button>
                    <UploadDocumentsModal showUploadModal={showModal} closeModal={closeDocumentModal} />
                </div>
            </Col>
            <Col sm={12}>
                <DocumentsCard />
            </Col>
        </Row>
    )
}

export default Documentsindex;