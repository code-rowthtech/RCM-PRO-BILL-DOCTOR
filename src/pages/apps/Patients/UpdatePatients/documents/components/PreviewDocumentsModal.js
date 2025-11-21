import React from 'react'
import { Modal } from 'react-bootstrap'

const PreviewDocumentsModal = ({ show, onHide, previewLink }) => {
    const getFileType = (url) => {
        const extension = url?.split('.').pop()?.toLowerCase()
        return extension
    }

    const renderPreview = () => {
        if (!previewLink) return null

        const fileType = getFileType(previewLink)

        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType)) {
            return (
                <img
                    src={previewLink}
                    alt="Document preview"
                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />
            )
        }

        if (fileType === 'pdf') {
            return (
                <iframe
                    src={previewLink}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                />
            )
        }

        return (
            <div className="text-center py-5">
                <i className="bi bi-file-earmark fs-1 text-muted mb-3" />
                <p className="text-muted">Preview not available for this file type</p>
                <a href={previewLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <i className="bi bi-download me-2" />Download File
                </a>
            </div>
        )
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className='my-0'>Document Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {renderPreview()}
            </Modal.Body>
        </Modal>
    )
}

export default PreviewDocumentsModal