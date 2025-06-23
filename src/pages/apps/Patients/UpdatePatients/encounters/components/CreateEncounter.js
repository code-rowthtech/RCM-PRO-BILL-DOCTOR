import React from 'react'
import { Col, Row } from 'react-bootstrap'
import EncounterSummary from './EncounterSummary'

const CreateEncounter = ({ isCollapsed }) => {
    return (
        <Row>
            <Col className={`${isCollapsed ? 'd-none' : ''}`} sm={4}>
                <EncounterSummary />
            </Col>
            <Col className=' border-start pb-2' sm={isCollapsed ? 12 : 8}>
                {/* <EncounterSummary /> */}
            </Col>
        </Row>
    )
}

export default CreateEncounter