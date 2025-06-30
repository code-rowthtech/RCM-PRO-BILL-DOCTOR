import React from 'react'
import { Card } from 'react-bootstrap'
import { MdAddCircleOutline, MdOutlinePrint } from 'react-icons/md'
import { FaProcedures } from 'react-icons/fa';

const ProblemsCard = () => {
    return (
        <Card className="h-100 shadow-sm">
            <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                    <FaProcedures className="me-2 text-secondary" />
                    <span className="fw-bold fs-6">Problems</span>
                </div>
                <div>
                    <MdAddCircleOutline
                        className="text-primary me-2 cursor-pointer"
                    />
                    <MdOutlinePrint
                        className="text-secondary cursor-pointer"
                        title="Print all problems"
                    />
                </div>
            </Card.Header>
            <Card.Body className="p-2 pb-0 summary-card-body scroll-container">

            </Card.Body>
            <div
                className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline">
                Go To Problems List
            </div>
        </Card>
    )
}

export default ProblemsCard