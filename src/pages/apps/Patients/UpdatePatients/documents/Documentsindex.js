import { PlusIcon } from 'lucide-react'
import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import DocumentsCard from './components/DocumentsCard'

const Documentsindex = () => {
    return (
        <Row>
            <Col sm={12}>
                <div className="d-flex justify-content-between align-items-center">
                    <h5>Patient Documents</h5>
                    <Button className='custom-buttons'>
                        <PlusIcon className="me-1" /> Upload
                    </Button>
                </div>
            </Col>
            <Col sm={12}>
                <DocumentsCard />
            </Col>
        </Row>
    )
}

export default Documentsindex