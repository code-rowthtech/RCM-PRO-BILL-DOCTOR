// React and third-party imports
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Col, Row, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Redux actions
import {
    deletePatientDocumentsAction,
    getPatientDocumentsAction,
    getPatientDocumentsByIdAction,
    updatePatientDocumentsAction
} from 'redux/patientDocuments/actions'

// Components and utilities
import PreviewDocumentsModal from './PreviewDocumentsModal'
import DeletionModal from 'helpers/DeletionModal'
import Spinner from 'constants/Spinner'
import { encryptMessage } from 'cryptoUtils'
import { documentCategories, documentTypes } from 'utils/DataSets/documentsData'

const DocumentsCard = () => {
    // Redux state and dispatch
    const store = useSelector((state) => state)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const patientId = searchParams.get('id')

    // Derived state from Redux store
    const patientDocuments = store?.getDocumentsReducer?.data?.patientDocuments
    const deleteDocumentEntryResponse = store?.deleteDocumentsReducer?.data?.status
    const updatePatientDocumentResponse = store?.updateDocumentsReducer?.data?.status
    const documentById = store?.getDocumentsByIdReducer?.data

    // Modal states
    const [previewModal, setPreviewModal] = useState(false)
    const [previewLink, setPreviewLink] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [docToDeleteId, setDocToDeleteId] = useState(null)
    const [deleteAttachmentModal, setDeleteAttachmentModal] = useState(false)
    const [attachmentToDelete, setAttachmentToDelete] = useState(null)
    const [docToDeleteAttachmentId, setDocToDeleteAttachmentId] = useState(null)

    // Expanded view states
    const [isExpandedView, setIsExpandedView] = useState(false)
    const [expandedDoc, setExpandedDoc] = useState(null)
    const [notes, setNotes] = useState()
    const [deleteExpandedAttachmentModal, setDeleteExpandedAttachmentModal] = useState(false)
    const [expandedAttachmentToDelete, setExpandedAttachmentToDelete] = useState(null)
    const [expandedDocToDeleteAttachmentId, setExpandedDocToDeleteAttachmentId] = useState(null)


    // Utility functions for file handling
    const getFileIcon = (contentType, fileName) => {
        const extension = fileName?.split('.').pop()?.toLowerCase()

        if (contentType?.includes('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
            return <i className="bi bi-file-earmark-image text-success fs-4" />
        }
        if (contentType?.includes('application/pdf') || extension === 'pdf') {
            return <i className="bi bi-file-earmark-pdf text-danger fs-4" />
        }
        if (contentType?.includes('application/msword') || ['doc', 'docx'].includes(extension)) {
            return <i className="bi bi-file-earmark-word text-primary fs-4" />
        }
        if (contentType?.includes('application/vnd.ms-excel') || ['xls', 'xlsx'].includes(extension)) {
            return <i className="bi bi-file-earmark-excel text-success fs-4" />
        }
        return <i className="bi bi-file-earmark text-secondary fs-4" />
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Initial data loading effect
    useEffect(() => {
        if (patientId) {
            dispatch(getPatientDocumentsAction({ patientId }))
        }
    }, [dispatch, patientId])

    // Document deletion handler
    const deleteDocumentsEntry = () => {
        dispatch(deletePatientDocumentsAction({ id: docToDeleteId }))
    }

    // Attachment deletion handler
    const deleteAttachment = () => {
        const currentDoc = patientDocuments.find(d => d._id === docToDeleteAttachmentId)
        const updatedContent = currentDoc.content.filter(content => content._id !== attachmentToDelete._id)
        const payload = { content: updatedContent }
        dispatch(updatePatientDocumentsAction({ id: docToDeleteAttachmentId, body: encryptMessage(payload) }))
    }

    // Handle successful document deletion
    useEffect(() => {
        if (deleteDocumentEntryResponse === 200) {
            dispatch(getPatientDocumentsAction({ patientId }))
            setDocToDeleteId(null)
            setDeleteModal(false)
        }
    }, [deleteDocumentEntryResponse, dispatch, patientId])

    // Handle successful document update
    useEffect(() => {
        if (updatePatientDocumentResponse === 200) {
            dispatch(getPatientDocumentsAction({ patientId }))
            // Reset attachment deletion states
            setDeleteAttachmentModal(false)
            setAttachmentToDelete(null)
            setDocToDeleteAttachmentId(null)
            setDeleteExpandedAttachmentModal(false)
            setExpandedAttachmentToDelete(null)
            setExpandedDocToDeleteAttachmentId(null)
            // Refresh expanded view if active
            if (isExpandedView && expandedDoc) {
                dispatch(getPatientDocumentsByIdAction({ docId: expandedDoc._id }))
            }
        }
    }, [updatePatientDocumentResponse, isExpandedView, expandedDoc, dispatch, patientId])

    // Document type options for AsyncSelect
    const formattedDocumentTypes = useMemo(() =>
        documentTypes.map((type) => ({
            value: type,
            label: type?.display,
        })), [])

    const loadDocumentTypeOptions = useCallback((inputValue, callback) => {
        if (!inputValue) {
            callback(formattedDocumentTypes.slice(0, 10))
            return
        }
        const filteredOptions = formattedDocumentTypes.filter((option) =>
            option?.label?.toLowerCase()?.includes(inputValue?.toLowerCase())
        )
        callback(filteredOptions.slice(0, 20))
    }, [formattedDocumentTypes])

    // Document type change handler
    const handleDocumentTypeChange = useCallback((docId, selectedOption) => {
        const documentTypePayload = {
            coding: [{
                system: selectedOption?.value?.system,
                code: selectedOption?.value?.code,
                display: selectedOption?.value?.display,
            }],
            text: selectedOption?.value?.display,
        }
        dispatch(updatePatientDocumentsAction({ body: encryptMessage({ type: documentTypePayload }), id: docId }))
    }, [dispatch])

    // Expanded view attachment deletion handler
    const handleDeleteAttachment = (doc, contentId) => () => {
        setDeleteExpandedAttachmentModal(true)
        setExpandedAttachmentToDelete({ _id: contentId })
        setExpandedDocToDeleteAttachmentId(doc._id)
    }

    const deleteExpandedAttachment = () => {
        const currentDoc = documentById
        const updatedContent = currentDoc.content.filter(content => content._id !== expandedAttachmentToDelete._id)
        const payload = { content: updatedContent }
        dispatch(updatePatientDocumentsAction({ id: expandedDocToDeleteAttachmentId, body: encryptMessage(payload) }))
    }

    // Load document details when expanded view is opened
    useEffect(() => {
        if (isExpandedView && expandedDoc) {
            dispatch(getPatientDocumentsByIdAction({ docId: expandedDoc?._id }))
        }
    }, [isExpandedView, expandedDoc, dispatch])

    // Sync notes with document data
    useEffect(() => {
        if (documentById?.notes) {
            setNotes(documentById.notes)
        }
    }, [documentById])

    // Render document card component
    const renderDocumentCard = (doc) => (
        <Col sm={12} key={doc._id} className="my-1 position-relative">
            <Card className='p-1 mb-0 border'>
                <Card.Body className='p-0'>
                    <div className="row mb-2 d-flex align-items-center">
                        {/* Document actions */}
                        <div className="col-6">
                            <span className={`badge text-capitalize ${doc.status === 'current' ? 'bg-success' : 'bg-secondary'}`}>
                                {doc.status}
                            </span>
                            {doc.category?.[0]?.text && (
                                <span className="badge bg-info ms-1">
                                    {doc.category[0].text}
                                </span>
                            )}
                        </div>
                        <div className="col-6 d-flex justify-content-end gap-1 align-items-center">
                            <i
                                title='Expand'
                                onClick={() => {
                                    setExpandedDoc(doc)
                                    setIsExpandedView(true)
                                }}
                                className='mdi mdi-square-edit-outline fs-5 cursor-pointer'
                            />
                            <i
                                title='Delete'
                                onClick={() => {
                                    setDeleteModal(true)
                                    setDocToDeleteId(doc?._id)
                                }}
                                className='bi bi-trash text-danger fs-5 cursor-pointer'
                            />
                        </div>
                        {/* Document notes and metadata */}
                        <div className="col-7">
                            <div className="row">
                                <div className="col-12 overflow-auto thin-scrollbar" style={{ maxHeight: '400px' }}>
                                    {!doc?.notes || doc?.notes === '' ? (
                                        <h5 className='d-flex fs-6 align-items-center justify-content-center py-5'>No Notes Found</h5>
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: doc?.notes }} />
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Document attachments */}
                        <div className="col-5">
                            <div className="row g-1 mt-0 overflow-auto thin-scrollbar" style={{ maxHeight: '400px' }}>
                                {doc?.content?.map((content, contentIndex) => (
                                    <div key={`${content._id}-${contentIndex}`} className="col-6">
                                        <div
                                            title={content?.attachment?.fileName}
                                            className="p-2 shadow-sm rounded-1 cursor-pointer"
                                            style={{
                                                borderLeft: '4px solid rgba(97, 104, 208, 0.73)',
                                                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                                borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                                                transition: 'all 0.2s ease',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            <div className="d-flex align-items-center w-100 gap-2">
                                                <div className="flex-shrink-0">
                                                    {getFileIcon(content?.attachment?.contentType, content?.attachment?.fileName)}
                                                </div>
                                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                    <div className="text-truncate fw-medium" style={{ fontSize: '0.8rem' }}>
                                                        {content?.attachment?.fileName?.length > 20
                                                            ? content?.attachment?.fileName?.slice(0, 19) + '...'
                                                            : content?.attachment?.fileName
                                                        }
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        {formatFileSize(content?.attachment?.size)}
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-1 flex-shrink-0">
                                                    <i
                                                        title='Preview'
                                                        onClick={() => {
                                                            setPreviewModal(true)
                                                            setPreviewLink(content?.attachment?.url)
                                                        }}
                                                        className='bi bi-eye text-info cursor-pointer'
                                                        style={{ fontSize: '0.8rem' }}
                                                    />
                                                    <i
                                                        title='Delete'
                                                        onClick={() => {
                                                            setDeleteAttachmentModal(true)
                                                            setAttachmentToDelete(content)
                                                            setDocToDeleteAttachmentId(doc._id)
                                                        }}
                                                        className='bi bi-trash text-danger cursor-pointer'
                                                        style={{ fontSize: '0.8rem' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) || (
                                        <div className="col-12 text-center py-4">
                                            <i className="bi bi-file-earmark fs-1 text-muted" />
                                            <p className="text-muted mt-2">No attachments found</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )

    return (
        <Row style={{ maxHeight: '80vh', overflowY: 'auto' }} className="thin-scrollbar">
            {/* Loading state */}
            {store?.getDocumentsReducer?.loading ? (
                <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-center py-5">
                        <Spinner />
                    </div>
                </div>
            ) : (
                /* Document list or empty state */
                patientDocuments?.length > 0 ? (
                    patientDocuments.map((doc) => renderDocumentCard(doc))
                ) : (
                    <Col sm={12} className="text-center py-5">
                        <i className="bi bi-file-earmark fs-1 text-muted" />
                        <h5 className="text-muted mt-2">No Documents Found</h5>
                    </Col>
                )
            )}

            {/* Modals */}
            <PreviewDocumentsModal
                show={previewModal}
                onHide={() => setPreviewModal(false)}
                previewLink={previewLink}
            />

            <DeletionModal
                show={deleteModal}
                item='documents entry'
                onHide={() => {
                    setDocToDeleteId(null)
                    setDeleteModal(false)
                }}
                onConfirm={deleteDocumentsEntry}
            />

            <DeletionModal
                show={deleteAttachmentModal}
                item='attachment'
                onHide={() => {
                    setAttachmentToDelete(null)
                    setDocToDeleteAttachmentId(null)
                    setDeleteAttachmentModal(false)
                }}
                onConfirm={deleteAttachment}
            />
            {/* Expanded view modal */}
            {isExpandedView && expandedDoc && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        zIndex: 111,
                        display: previewModal ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px'
                    }}>
                    {/* Main expanded view container */}
                    <div className='scroll-container' style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        width: '45%',
                        height: '77vh',
                        maxWidth: '1200px',
                        maxHeight: '90vh',
                        padding: '10px',
                        position: 'relative'
                    }}>
                        {/* Close button */}
                        <button
                            onClick={() => setIsExpandedView(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                        {/* Expanded view content */}
                        <div className='mt-1' style={{ padding: '10px' }}>
                            {store?.getDocumentsByIdReducer?.loading ? (
                                <div className='row'>
                                    <div className="col-12 d-flex align-items-center justify-content-center p-5">
                                        <Spinner />
                                    </div>
                                </div>
                            ) : (
                                <div className="row">
                                    {/* Document metadata form */}
                                    <div className="col-md-12" style={{ height: '7.5vh' }}>
                                        <div className="row mb-3">
                                            <div className="col-md-4">
                                                <Form.Label className='mb-0'>Date</Form.Label>
                                                <Form.Control
                                                    type='date'
                                                    style={{ cursor: 'not-allowed' }}
                                                    value={expandedDoc?.date ? new Date(expandedDoc?.date)?.toISOString()?.split('T')?.[0] : ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-4">
                                                <Form.Label className='mb-0'>Category</Form.Label>
                                                <Form.Select
                                                    onChange={(e) => {
                                                        const selectedCategory = documentCategories.find(category => category.code === e.target.value)
                                                        const categoryPayload = [{
                                                            coding: [{
                                                                system: selectedCategory?.system,
                                                                code: selectedCategory?.code,
                                                                display: selectedCategory?.display,
                                                            }],
                                                            text: selectedCategory?.display,
                                                        }]
                                                        dispatch(updatePatientDocumentsAction({ body: encryptMessage({ category: categoryPayload }), id: expandedDoc?._id }))
                                                    }}
                                                    defaultValue={expandedDoc?.category?.[0]?.coding?.[0]?.code || ''}>
                                                    <option value="" hidden>Select</option>
                                                    {documentCategories?.map((category, index) => (
                                                        <option key={index} value={category.code}>{category.display}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                            <div className="col-4">
                                                <Form.Label className='mb-0'>Type</Form.Label>
                                                <AsyncSelect
                                                    loadOptions={loadDocumentTypeOptions}
                                                    defaultOptions={formattedDocumentTypes.slice(0, 10)}
                                                    isSearchable
                                                    className="basic-single flex-fill"
                                                    classNamePrefix="select"
                                                    placeholder="Select"
                                                    value={
                                                        formattedDocumentTypes.find(
                                                            (option) => option.value.code === expandedDoc?.type?.coding?.[0]?.code
                                                        )
                                                    }
                                                    onChange={(selectedOption) => handleDocumentTypeChange(expandedDoc?._id, selectedOption)}
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            height: '30px',
                                                            minHeight: '30px',
                                                            border: '0px',
                                                        }),
                                                        placeholder: (provided) => ({
                                                            ...provided,
                                                            fontWeight: 'bold',
                                                            fontSize: '12px',
                                                            paddingBottom: '5px',
                                                        }),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Notes editor */}
                                    <div className="col-12">
                                        <Form.Label className='mb-0'>Notes & Comments</Form.Label>
                                        <ReactQuill
                                            theme="snow"
                                            value={notes || ''}
                                            onChange={setNotes}
                                            style={{ height: '50vh' }}
                                            modules={{
                                                toolbar: [
                                                    ['bold', 'italic', 'underline'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                    ['link'],
                                                    ['clean']
                                                ]
                                            }}
                                        />
                                    </div>
                                    {/* Save button - only show if notes changed */}
                                    {notes !== documentById?.notes && (
                                        <div className="row mt-2 pe-0">
                                            <div className="col-12 mt-4 pe-0 d-flex justify-content-end">
                                                <Button
                                                    disabled={store?.updateDocumentsReducer?.loading}
                                                    onClick={() => {
                                                        dispatch(updatePatientDocumentsAction({
                                                            id: documentById?._id,
                                                            body: encryptMessage({ notes: notes })
                                                        }))
                                                    }}
                                                    className='custom-buttons'
                                                >
                                                    {store?.updateDocumentsReducer?.loading ? (
                                                        <Spinner className='spinner-border-sm' color='white' />
                                                    ) : (
                                                        'Save'
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attachments sidebar */}
                    {documentById?.content?.length > 0 && (
                        <div className='position-absolute thin-scrollbar' style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            width: '20vw',
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                            maxWidth: '1200px',
                            height: '77vh',
                            overflow: 'auto',
                            padding: '10px',
                            top: '11.5vh',
                            left: '72.6vw',
                            zIndex: 111
                        }}>
                            <div className="row">
                                {store?.getDocumentsByIdReducer?.loading ? (
                                    <div className='row'>
                                        <div className="col-12 d-flex align-items-center justify-content-center p-5">
                                            <Spinner />
                                        </div>
                                    </div>
                                ) : (
                                    documentById?.content?.map((content, index) => (
                                        <div key={`${expandedDoc?._id}-${index}`} className="col-12 mb-1">
                                            <div
                                                title={content?.attachment?.fileName}
                                                className="p-2 shadow-sm rounded-1 cursor-pointer d-flex align-items-center justify-content-between"
                                                style={{
                                                    borderLeft: '4px solid rgba(97, 104, 208, 0.73)',
                                                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 0.2s ease',
                                                    marginBottom: '0px',
                                                }}
                                            >
                                                <div className="d-flex align-items-center w-100 gap-2">
                                                    <div className="flex-shrink-0">
                                                        {getFileIcon(content?.attachment?.contentType, content?.attachment?.fileName)}
                                                    </div>
                                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                        <div className="text-truncate fw-medium">
                                                            {content?.attachment?.fileName?.length > 35
                                                                ? content?.attachment?.fileName?.slice(0, 34) + '...'
                                                                : content?.attachment?.fileName
                                                            }
                                                        </div>
                                                        <div className="text-muted small">
                                                            {formatFileSize(content?.attachment?.size)}
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-1 flex-shrink-0">
                                                        <i
                                                            title='Preview'
                                                            onClick={() => {
                                                                setPreviewModal(true)
                                                                setPreviewLink(content?.attachment?.url)
                                                            }}
                                                            className='bi bi-eye fs-5 text-info cursor-pointer'
                                                        />
                                                        <i
                                                            title='Delete'
                                                            onClick={handleDeleteAttachment(expandedDoc, content?._id)}
                                                            className='bi bi-trash text-danger fs-5 cursor-pointer'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Expanded view attachment deletion modal */}
                    <DeletionModal
                        show={deleteExpandedAttachmentModal}
                        item='attachment'
                        onHide={() => {
                            setExpandedAttachmentToDelete(null)
                            setExpandedDocToDeleteAttachmentId(null)
                            setDeleteExpandedAttachmentModal(false)
                        }}
                        onConfirm={deleteExpandedAttachment}
                    />
                </div>
            )}
        </Row>
    )
}

export default DocumentsCard;