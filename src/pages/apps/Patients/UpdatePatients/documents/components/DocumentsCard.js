import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const DocumentsCard = () => {
    const store = useSelector((state) => state);

    return (
        <Row>
            <Col sm={12} className="my-1  position-relative">
                <div className='d-flex gap-1 align-items-center position-absolute' style={{ left: '95%', top: '5%', zIndex: 111 }}>
                    <i
                        title='Expand'
                        className='mdi mdi-square-edit-outline fs-5 cursor-pointer'
                    />
                    <i
                        title='Delete'
                        className='bi bi-trash text-danger fs-5 cursor-pointer'
                    />
                </div>
                <Card className='p-1 mb-0 border'>
                    <Card.Body className='p-0'>
                        <div className="row">
                            <div className="col-12">
                                <h5 className='mt-0'>Document Notes</h5>
                            </div>
                            <div className="col-7">
                                <div className="row">
                                    <div className="col-12 overflow-auto thin-scrollbar" >
                                        {/* {!doc?.notes || doc?.notes === '' ?
                                            <h5 className='d-flex fs-6 align-items-center justify-content-center py-5'>No Notes Found</h5>
                                            :
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: doc?.notes,
                                                }}
                                            />
                                        } */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="row g-1 mt-0 overflow-auto thin-scrollbar">
                                    {/* {doc?.content?.map((content, index) => (
                                        <div className="col-6">
                                            <div
                                                title={content?.attachment?.fileName}
                                                key={`${doc?._id}-${index}`}
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
                                                            {content?.attachment?.fileName?.length > 35 ? content?.attachment?.fileName?.slice(0, 34) + '...' : content?.attachment?.fileName}
                                                        </div>
                                                        <div className="text-muted small">
                                                            {formatFileSize(content?.attachment?.size)}
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-1 flex-shrink-0">
                                                        <i title='Preview' onClick={() => {
                                                            setPreviewModal(true);
                                                            setPreviewLink(content?.attachment?.url);
                                                        }} className='bi bi-eye fs-5 text-info cursor-pointer' />
                                                        <i title='Delete' onClick={() => {
                                                            setDocToDelete(doc);
                                                            setDocToDeleteId(content?._id);
                                                            setDeleteModal(true);
                                                        }} className='bi bi-trash text-danger fs-5 cursor-pointer' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default DocumentsCard;