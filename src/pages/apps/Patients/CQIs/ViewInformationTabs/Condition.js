import React from 'react';
import { Table } from 'react-bootstrap';

const Condition = () => {
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };
    
    const categoryList = [
        {
            Name: "Hypertension",
            "ICD-9": "401.9",
            Snomed: "38341003",
            Diagnosed: formatDate("2023-05-12"),
            Onset: formatDate("2023-03-15"),
            Changed: formatDate("2024-01-10"),
            Status: "Active"
        },
        {
            Name: "Diabetes Mellitus",
            "ICD-9": "250.00",
            Snomed: "44054006",
            Diagnosed: formatDate("2022-08-21"),
            Onset: formatDate("2022-06-05"),
            Changed: formatDate("2023-12-01"),
            Status: "Active"
        },
        {
            Name: "Asthma",
            "ICD-9": "493.90",
            Snomed: "195967001",
            Diagnosed: formatDate("2021-10-30"),
            Onset: formatDate("2021-08-12"),
            Changed: formatDate("2023-07-20"),
            Status: "Inactive"
        },
        {
            Name: "Coronary Artery Disease",
            "ICD-9": "414.01",
            Snomed: "53741008",
            Diagnosed: formatDate("2019-04-14"),
            Onset: formatDate("2019-02-10"),
            Changed: formatDate("2022-05-30"),
            Status: "Active"
        },
        {
            Name: "Chronic Kidney Disease",
            "ICD-9": "585.3",
            Snomed: "431855005",
            Diagnosed: formatDate("2020-12-05"),
            Onset: formatDate("2020-10-01"),
            Changed: formatDate("2023-09-18"),
            Status: "Progressing"
        }
    ];
    

    return (
        <div>
            {/* Table Section */}
            <Table responsive className="table table-nowrap mb-0">
                <thead className="text-white bg-dark">
                    <tr>
                        <th className="text-white">Name</th>
                        <th className="text-white">ICD-9</th>
                        <th className="text-white">Snomed</th>
                        <th className="text-white">Diagnosed</th>
                        <th className="text-white">Onset</th>
                        <th className="text-white">Changed</th>
                        <th className="text-white">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="fw-bold text-center">
                                No Category List available
                            </td>
                        </tr>
                    ) : (
                        categoryList.map((category, index) => (
                            <tr key={index}>
                                <td>{category.Name}</td>
                                <td>{category["ICD-9"]}</td>
                                <td>{category.Snomed}</td>
                                <td>{category.Diagnosed}</td>
                                <td>{category.Onset}</td>
                                <td>{category.Changed}</td>
                                <td>{category.Status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default Condition;
