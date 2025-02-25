import React from 'react'
import { Table } from 'react-bootstrap'

const Encounter = () => {
    return (
        <div>
            {/* Table Section */}
            <Table responsive className="table table-nowrap mb-0">
                <thead className="text-white bg-dark">
                    <tr>
                        <th className="text-white">DOS</th>
                        <th className="text-white">CPT/HCPCS/SNOMED</th>
                        <th className="text-white">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>No Encounter</td>
                        <td></td>
                        <td></td>

                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default Encounter