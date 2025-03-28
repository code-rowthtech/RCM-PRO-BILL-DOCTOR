import React from 'react'
import { Table } from 'react-bootstrap'

const LabTest = () => {
    return (
        <div>
            {/* Table Section */}
            <Table responsive className="table table-nowrap mb-0">
                <thead className="text-white bg-dark">
                    <tr>
                        <th className="text-white ">Performed</th>
                        <th className="text-white ">Loinc Code</th>
                        <th className="text-white ">Status</th>
                        <th className="text-white ">Value</th>
                        <th className="text-white ">Units</th>
                        <th className="text-white ">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>No Function Status</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                </tbody>
            </Table>
        </div>
    )
}

export default LabTest