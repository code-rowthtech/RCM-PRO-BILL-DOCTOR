// React and third-party imports
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Col, Form, Modal, OverlayTrigger, Row, Spinner, Table, Tooltip } from 'react-bootstrap'
import { FiUpload as UploadIcon, FiTrash2 as DeleteIcon } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Redux actions and utilities
import { getPatientDocumentsAction, uploadPatientDocumentsAction } from 'redux/patientDocuments/actions'
import { getEncounterAction } from 'redux/actions'

// Helpers and utilities
import { handleUpload as handleS3Upload } from '../../../../../../helpers/HandleUpload'
import ToastHandle from 'helpers/ToastMessage'
import { loggedInUser } from 'helpers/loggedInUser'
import { encryptMessage } from 'cryptoUtils'
import { documentCategories, documentTypes } from 'utils/DataSets/documentsData'

// Constants
const MAX_FILE_SIZE_MB = 2
const MAX_FILES = 10
const MAX_LENGTH = 1000
const VALID_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/gif'
]

const UploadDocumentsModal = ({ showUploadModal, closeModal }) => {
    // Redux state and dispatch
    const store = useSelector((state) => state)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const subjectId = searchParams.get('id')

    // File management state
    const [files, setFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [previewFile, setPreviewFile] = useState(null)

    // Form state
    const [documentType, setDocumentType] = useState(null)
    const [documentCategory, setDocumentCategory] = useState(null)
    const [encounter, setEncounter] = useState('')
    const [searchEncounter, setSearchEncounter] = useState('')
    const [notes, setNotes] = useState(null)

    // UI state
    const [error, setError] = useState(null)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const quillRef = useRef(null)

    // Derived state from Redux store
    const uploadDocumentsResponse = store?.uploadDocumentsReducer
    const encounterOptions = store?.getEncounterReducer?.data?.encounters?.map((data) => ({
        label: data?.period?.start ? new Date(data?.period?.start)?.toISOString().split('T')?.[0] : '',
        value: data?._id
    }))
    const loadingRedux = store?.uploadDocumentsReducer?.loading
    const isLoading = loadingRedux || loadingUpload

    // Load encounters on component mount
    useEffect(() => {
        // if (!store?.getEncounterReducer?.data?.encounters?.length) {
        dispatch(getEncounterAction({ patientId: subjectId, skip: 1 }))
        // }
    }, [dispatch, subjectId])

    // Setup Quill editor text length limit
    useEffect(() => {
        if (quillRef?.current) {
            const editor = quillRef.current.getEditor()
            editor?.on('text-change', (delta, oldDelta, source) => {
                if (source === 'user') {
                    const text = editor.getText()
                    if (text.length > MAX_LENGTH + 1) {
                        editor.deleteText(MAX_LENGTH, text.length)
                    }
                }
            })
        }
    }, [])

    // Handle successful upload response
    useEffect(() => {
        if (uploadDocumentsResponse?.data?.status === 201) {
            dispatch(getPatientDocumentsAction({ patientId: subjectId }))
            resetForm()
            closeModal()
        }
    }, [uploadDocumentsResponse, dispatch, subjectId, closeModal])

    // Reset form to initial state
    const resetForm = () => {
        setEncounter('')
        setDocumentCategory(null)
        setFiles([])
        setSelectedFiles([])
        setNotes('')
        setPreviewFile(null)
        setDocumentType(null)
        setError(null)
    }

    // Handle encounter selection
    const handleEncounterChange = (selectedOption) => {
        setEncounter(selectedOption ? selectedOption.value : '')
    }

    // Document type options and handlers
    const formattedDocumentTypes = useMemo(() =>
        documentTypes.map((type) => ({
            value: type,
            label: type?.display,
        })), [])

    const selectedDocumentTypeOption = useMemo(() =>
        formattedDocumentTypes.find((option) => option?.value?.display === documentType?.text) ||
        formattedDocumentTypes.find((option) => option?.display === documentType),
        [formattedDocumentTypes, documentType]
    )

    const loadDocumentTypeOptions = useCallback((inputValue, callback) => {
        if (!inputValue) {
            callback(formattedDocumentTypes.slice(0, 10))
            return
        }
        const filteredOptions = formattedDocumentTypes.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        )
        callback(filteredOptions.slice(0, 20))
    }, [formattedDocumentTypes])

    const handleDocumentTypeChange = useCallback((selectedOption) => {
        setDocumentType(selectedOption ? selectedOption.value : '')
    }, [])

    // File validation
    const validateFile = (file) => {
        if (!VALID_MIME_TYPES.includes(file.type)) {
            setError(`Unsupported type: ${file.name}`)
            return false
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`Too large: ${file.name}`)
            return false
        }
        return true
    }

    // File management functions
    const addFiles = (incomingFiles) => {
        const validFiles = incomingFiles.filter(validateFile)
        setFiles((prev) => {
            const totalFiles = prev.length + validFiles.length
            if (totalFiles > MAX_FILES) {
                ToastHandle(`You can only upload up to ${MAX_FILES} files.`, 'danger')
                return prev
            }
            return [...prev, ...validFiles]
        })
    }

    const handleFileInput = (e) => {
        addFiles(Array.from(e.target.files))
        e.target.value = ''
    }

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        addFiles(Array.from(e.dataTransfer.files))
    }, [])

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
        if (previewFile === files[index]) setPreviewFile(null)
    }

    // Main upload handler
    const handleUpload = async () => {
        if (!files.length) return setError('No files selected')
        setError(null)

        const uploadedDocs = []

        // Upload files to S3
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const urlObj = await handleS3Upload(file, setLoadingUpload)
            if (!urlObj?.url) {
                setError(`Failed to upload: ${file?.name}`)
                return
            }
            uploadedDocs.push({
                name: file?.name,
                type: file?.type,
                size: file?.size,
                uploadedAt: new Date().toISOString().split('T')[0],
                s3Url: urlObj?.url
            })
        }

        // Prepare document content
        const content = uploadedDocs?.map(doc => ({
            attachment: {
                contentType: doc?.type,
                url: doc?.s3Url ? doc?.s3Url?.split('?')[0] : '',
                size: doc?.size,
                title: doc?.name,
                creation: new Date(doc?.uploadedAt),
                fileName: doc?.name,
                name: doc?.name,
            }
        }))

        // Prepare document metadata
        const documentTypePayload = {
            coding: [{
                system: documentType?.system,
                code: documentType?.code,
                display: documentType?.display,
            }],
            text: documentType?.display,
        }

        const documentCategoryPayload = {
            coding: [{
                system: documentCategory?.system,
                code: documentCategory?.code,
                display: documentCategory?.display,
            }],
            text: documentCategory?.display,
        }

        // Dispatch upload action
        dispatch(uploadPatientDocumentsAction({
            key: encryptMessage({
                status: 'current',
                subject: subjectId,
                date: new Date().toISOString().split('T')[0],
                author: loggedInUser?._id || store?.Auth?.user?.doctorId,
                notes,
                content,
                type: documentTypePayload,
                category: [documentCategoryPayload],
                ...(encounter && {
                    context: {
                        encounter: [encounter]
                    }
                })
            })
        }))
    }

    // Utility functions
    const formatFileSize = (bytes) => {
        const sizes = ['B', 'KB', 'MB', 'GB']
        if (!bytes) return '0 Byte'
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
    }

    // File selection handlers
    const handleCheckboxChange = (index) => {
        setSelectedFiles((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        )
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFiles(files.map((_, idx) => idx))
        } else {
            setSelectedFiles([])
        }
    }

    const handleDeleteSelected = () => {
        setFiles((prev) => prev.filter((_, idx) => !selectedFiles.includes(idx)))
        setSelectedFiles([])
        if (selectedFiles.some(idx => files[idx] === previewFile)) setPreviewFile(null)
    }

    return (
        <Modal className="upload-documents" show={showUploadModal} onHide={closeModal} size="lg" centered>
            {/* Modal Header */}
            <Modal.Header className="p-0 ps-3 text-dark border-0 pb-0 d-flex justify-content-start">
                <Modal.Title className="fw-semibold fs-5">
                    Upload Documents
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className='pt-0'>
                <Row>
                    {/* File Upload Area */}
                    <Col xs={6}>
                        <div
                            className=" rounded p-2 text-center"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            style={{ border: '1px dashed #ccc', backgroundColor: '#f8f9fa' }}
                        >
                            <UploadIcon size={24} className="mb-1" />
                            <p>Drag and drop files or</p>
                            <input
                                type="file"
                                multiple
                                accept={VALID_MIME_TYPES.join(',')}
                                onChange={handleFileInput}
                                hidden
                                id="file-upload"
                            />
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                Browse Files
                            </Button>
                            <p className="small text-muted mt-2">
                                Allowed: PDF, DOC, DOCX, JPG, PNG, GIF. Max size: {MAX_FILE_SIZE_MB}MB
                            </p>
                        </div>
                    </Col>
                    {/* File List Table */}
                    <Col xs={6}>
                        <Row>
                            <Col xs={12} className="mt-0">
                                <Table responsive className="table-centered table-nowrap mb-0 rounded table-scroll small-first-col">
                                    <thead className="text-white">
                                        <tr>
                                            <th style={{ width: '10%' }} className='text-white'>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedFiles.length === files.length && files.length > 0}
                                                    onChange={handleSelectAll}
                                                    aria-label="Select all files"
                                                />
                                            </th>
                                            <th style={{ width: '26.6%' }} className='text-white'>File</th>
                                            <th style={{ width: '26.6%' }} className='text-white'>Type</th>
                                            <th style={{ width: '26.6%' }} className='text-white'>Size</th>
                                            <OverlayTrigger overlay={<Tooltip>Delete Selected</Tooltip>}>
                                                <th style={{ width: '10%' }} className='text-white'>
                                                    <DeleteIcon
                                                        className={selectedFiles.length > 0 ? "" : "d-none"}
                                                        onClick={handleDeleteSelected}
                                                    />
                                                </th>
                                            </OverlayTrigger>
                                        </tr>
                                    </thead>
                                    <tbody className='body-half-screen thin-scrollbar'>
                                        {files?.length ? (
                                            files?.map((file, index) => (
                                                <tr key={index} onClick={() => setPreviewFile(file)} style={{ cursor: 'pointer' }}>
                                                    <td style={{ width: '10%' }}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedFiles.includes(index)}
                                                            onChange={e => {
                                                                e.stopPropagation()
                                                                handleCheckboxChange(index)
                                                            }}
                                                            aria-label={`Select file ${file.name}`}
                                                        />
                                                    </td>
                                                    <td style={{ width: '26.6%' }} title={file.name}>
                                                        {file.name?.length > 8 ? file.name?.slice(0, 7) + '...' : file.name}
                                                    </td>
                                                    <td style={{ width: '26.6%' }} title={file.type.split('/').pop().toUpperCase()}>
                                                        {file.type.split('/').pop().toUpperCase()?.length > 5
                                                            ? file.type.split('/').pop().toUpperCase()?.slice(0, 4) + '...'
                                                            : file.type.split('/').pop().toUpperCase()
                                                        }
                                                    </td>
                                                    <td style={{ width: '26.6%' }}>{formatFileSize(file.size)}</td>
                                                    <td style={{ width: '10%' }}></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className='text-center py-2'>
                                                    <h6>No files selected</h6>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Col>

                    {/* Document Metadata Form */}
                    <Col xs={12} className='mt-1'>
                        <Row>
                            <Col xs={4}>
                                <Form.Group>
                                    <Form.Label className='mb-0 mt-1'>Document Type</Form.Label>
                                    <AsyncSelect
                                        loadOptions={loadDocumentTypeOptions}
                                        defaultOptions={formattedDocumentTypes.slice(0, 10)}
                                        isSearchable
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="&nbsp; Select"
                                        value={selectedDocumentTypeOption}
                                        onChange={handleDocumentTypeChange}
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
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group>
                                    <Form.Label className='mb-0 mt-1'>Document Category</Form.Label>
                                    <Form.Select onChange={(e) => {
                                        setDocumentCategory(documentCategories.find(category => category.code === e.target.value) || null)
                                    }}>
                                        <option value="" hidden>Select</option>
                                        {documentCategories.map((category, index) => (
                                            <option key={index} value={category.code}>{category.display}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group>
                                    <Form.Label className='mb-0 mt-1'>Encounter</Form.Label>
                                    <Select
                                        options={encounterOptions}
                                        isSearchable
                                        isLoading={store?.getEncounterReducer?.loading}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="Select"
                                        value={encounterOptions?.find(option => option?.value === encounter) || null}
                                        onChange={(selected) => {
                                            setEncounter(selected?.value)
                                            handleEncounterChange?.(selected)
                                        }}
                                        inputValue={searchEncounter}
                                        onInputChange={(value) => setSearchEncounter(value)}
                                        isDisabled={store?.updateEncounterReducer?.loading && store?.updateEncounterReducer?.fieldUpdating === 'noteType'}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '30px',
                                                minHeight: '30px',
                                                border: 'none',
                                                background: "#e8f0fe !important",
                                            }),
                                            placeholder: (provided) => ({
                                                ...provided,
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                paddingBottom: '5px',
                                            }),
                                        }}
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>

                    {/* Notes Editor */}
                    <Col xs={12} className="mt-1">
                        <Form.Label className='mb-0'>
                            Notes & Comments <small className='text-muted'>(Max length: {MAX_LENGTH})</small>
                        </Form.Label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={notes}
                            onChange={setNotes}
                            style={{ height: '20vh', marginBottom: '35px' }}
                            modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline'],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    ['link'],
                                    ['clean']
                                ]
                            }}
                        />
                    </Col>
                </Row>
            </Modal.Body>

            {/* Modal Footer */}
            <Modal.Footer>
                <Row className='my-0'>
                    <Col xs={12} className="d-flex py-0 gap-2 align-items-center justify-content-end">
                        <Button
                            className='custom-buttons'
                            onClick={() => {
                                closeModal()
                                resetForm()
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className='custom-buttons'
                            onClick={handleUpload}
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner className='spinner-border-sm' color='white' /> : 'Upload'}
                        </Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}

export default UploadDocumentsModal