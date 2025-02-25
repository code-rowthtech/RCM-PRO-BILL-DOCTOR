import React from 'react'
import { Table } from 'react-bootstrap'

const Procedure = () => {
    return (
        <div>
            {/* Table Section */}
            <Table responsive className="table table-nowrap mb-0">
                <thead className="text-white bg-dark">
                    <tr>
                        <th className="text-white">DOS</th>
                        <th className="text-white">CPT/HCPCS/SNOMED/OTHER</th>
                        <th className="text-white">Description</th>
                        <th className='text-white'>Discharge Disposition Code</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Jul 25, 2018</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default Procedure