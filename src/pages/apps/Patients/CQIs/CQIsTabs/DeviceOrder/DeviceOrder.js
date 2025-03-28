import React from "react";
import { Table } from "react-bootstrap";

const DeviceOrder = ({deviceOrders = []}) => {

    return (
        <div>
            {/* Table Section */}
            <Table responsive className="table table-nowrap mb-0">
                <thead className="text-white bg-dark">
                    <tr>
                        <th className="text-white">Datetime</th>
                        <th className="text-white text-center">Code</th>
                        <th className="text-white text-end">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {deviceOrders?.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center fw-bold">
                                No device orders available
                            </td>
                        </tr>
                    ) : (
                        deviceOrders?.map((order, index) => (
                            <tr key={index}>
                                <td>{order?.datetime}</td>
                                <td>{order?.code}</td>
                                <td className="text-center">{order?.description}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default DeviceOrder;
