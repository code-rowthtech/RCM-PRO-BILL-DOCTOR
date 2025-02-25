import React from 'react';
import { Table } from 'react-bootstrap';

const Medication = () => {
    const medicationList = [
        {
            Prescribed: "25-07-2018",
            RxnormCode: "1049630",
            Description: "Metformin 500mg Tablet"
        },
        {
            Prescribed: "12-03-2020",
            RxnormCode: "197361",
            Description: "Atorvastatin 20mg Tablet"
        },
        {
            Prescribed: "05-09-2021",
            RxnormCode: "617312",
            Description: "Lisinopril 10mg Tablet"
        },
        {
            Prescribed: "18-11-2019",
            RxnormCode: "849469",
            Description: "Levothyroxine 50mcg Tablet"
        },
        {
            Prescribed: "30-06-2022",
            RxnormCode: "313782",
            Description: "Amlodipine 5mg Tablet"
        }
    ];

    return (
        <div>
            {/* Table Section */}
            <Table responsive className="table table-nowrap mb-0">
                <thead className="text-white bg-dark">
                    <tr>
                        <th className="text-white " style={{ width: "33.33%" }}>Prescribed</th>
                        <th className="text-white " style={{ width: "33.33%" }}>Rxnorm Code</th>
                        <th className="text-white " style={{ width: "33.33%" }}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {medicationList.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="fw-bold ">
                                No Medications Available
                            </td>
                        </tr>
                    ) : (
                        medicationList.map((med, index) => (
                            <tr key={index}>
                                <td className="">{med.Prescribed}</td>
                                <td className="">{med.RxnormCode}</td>
                                <td className="">{med.Description}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

        </div>
    );
};

export default Medication;
