import React from "react";
import { Row, Col, Table, Spinner } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

// Dummy pagination component
const Paginations = ({ currentPage, totalPages, onPageChange }) => (
  <div>Page {currentPage} of {totalPages}</div>
);

const PastAppointment = () => {
  const patientsData = [
    {
      _id: "101",
      chartNumber: "P-0101",
      name: [{ text: "Michael Scott" }],
      telecom: [{}, { value: "555-123-4567" }],
      appointment: [
        {
          date: "2025-03-01",
          time: "09:30 AM",
          status: "Completed",
        },
      ],
      address: [
        {
          line: ["1725 Slough Ave"],
          city: "Scranton",
          state: "PA",
          postalCode: "18505",
          country: "USA",
        },
      ],
      appointmentStatus: "Completed",
      billingStatus: "Paid",
      office: "Scranton Office",
      examRoom: "Room A",
      reason: "Back Pain Follow-up",
    },
    {
      _id: "102",
      chartNumber: "P-0102",
      name: [{ text: "Pam Beesly" }],
      telecom: [{}, { value: "555-678-9012" }],
      appointment: [
        {
          date: "2025-02-20",
          time: "01:00 PM",
          status: "Completed",
        },
      ],
      address: [
        {
          line: ["456 Paper Lane"],
          city: "Scranton",
          state: "PA",
          postalCode: "18504",
          country: "USA",
        },
      ],
      appointmentStatus: "Completed",
      billingStatus: "Pending",
      office: "Scranton Office",
      examRoom: "Room B",
      reason: "Routine Checkup",
    },
  ];

  const loading = false;
  const skip = 1;

  const handlePageChange = (page) => {
    console.log("Go to page:", page);
  };

  return (
    <>
      <Row>
        <Col sm={12}>
          <Table responsive className="table-centered table-nowrap mb-0">
            <thead className="text-white bg-dark">
              <tr>
                <th className="text-white">S.No.</th>
                <th className="text-white">Scheduled Time</th>
                <th className="text-white">Provider</th>
                <th className="text-white">Reason</th>
                <th className="text-white">Notes</th>
                <th className="text-white">Office</th>
                <th className="text-white">Exam Room</th>
                <th className="text-white">Address</th>
                <th className="text-white">Appointment Status</th>
                <th className="text-white">Billing Status</th>
                <th className="text-white">Profile</th>
                <th className="text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="text-center" colSpan={12}>
                    <Spinner className="my-5" />
                  </td>
                </tr>
              ) : patientsData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center">
                    <h3 className="my-5">No Past Appointments Found!</h3>
                  </td>
                </tr>
              ) : (
                patientsData.map((data, index) => {
                  const appointment = data.appointment?.[0] || {};
                  const address = data.address?.[0];
                  const fullAddress = address
                    ? `${address.line?.[0] || ""}, ${address.city || ""}, ${address.state || ""}, ${address.postalCode || ""}, ${address.country || ""}`
                    : "N/A";

                  return (
                    <tr key={data._id}>
                      <td>{index + 1}</td>
                      <td>{appointment.date ? `${appointment.date} ${appointment.time}` : "N/A"}</td>
                      <td>{data.name?.[0]?.text || "N/A"}</td>
                      <td>{data.reason || "N/A"}</td>
                      <td>{"-"}</td>
                      <td>{data.office || "N/A"}</td>
                      <td>{data.examRoom || "N/A"}</td>
                      <td>{fullAddress}</td>
                      <td>{data.appointmentStatus || "N/A"}</td>
                      <td>{data.billingStatus || "N/A"}</td>
                      <td>{data.chartNumber}</td>
                      <td>
                        <Link to={`/apps/patients/new-patient?id=${data._id}`}>
                          <FiEdit className="fs-4 ms-2 cursor-pointer text-black" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Col>
        <Col className="mt-2 d-flex justify-content-end">
          <Paginations
            currentPage={skip}
            totalPages={1}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>
    </>
  );
};

export default PastAppointment;
