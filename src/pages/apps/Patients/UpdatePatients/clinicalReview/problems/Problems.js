import React from 'react'
import { Col, Row, Table } from 'react-bootstrap'

const Problems = () => {
    return (
        <Row>
            <Col sm={12}>
                <Table responsive className="table-centered table-nowrap mb-0">
                    <thead className="text-white bg-dark">
                        <tr key="">
                            {['S.No.', 'Problem', 'ICD-CM Code', 'Diagnosed Date', 'Status', 'Action']?.map((data, index) => (
                                <th key={index}>{data}</th>
                            ))}
                        </tr>
                    </thead>
                </Table>
            </Col>
        </Row>
    )
}

export default Problems