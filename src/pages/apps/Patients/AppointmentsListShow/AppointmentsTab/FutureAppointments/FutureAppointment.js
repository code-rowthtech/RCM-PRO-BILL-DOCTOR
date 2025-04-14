import React from "react";
import { Row, Col, Table, Spinner } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

// Dummy pagination component
const Paginations = ({ currentPage, totalPages, onPageChange }) => (
  <div>Page {currentPage} of {totalPages}</div>
);

const FutureAppointment = () => {
  const patientsData = [
    {
      _id: "1",
      chartNumber: "P-001",
      name: [{ text: "John Doe" }],
      telecom: [{}, { value: "123-456-7890" }],
      birthDate: "1990-01-01",
      appointment: [
        {
          date: "2025-04-15",
          time: "10:00 AM",
          status: "Scheduled",
        },
      ],
      address: [
        {
          use: "home",
          line: ["123 Main St"],
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
        },
      ],
      appointmentStatus: "Scheduled",
      billingStatus: "Pending",
      office: "Main Office",
      examRoom: "Room 101",
      reason: "Routine Checkup",
    },
    {
      _id: "2",
      chartNumber: "P-002",
      name: [{ text: "Jane Smith" }],
      telecom: [{}, { value: "987-654-3210" }],
      birthDate: "1985-05-15",
      appointment: [
        {
          date: "2025-04-16",
          time: "11:00 AM",
          status: "Scheduled",
        },
      ],
      address: [
        {
          use: "home",
          line: ["456 Elm St"],
          city: "Los Angeles",
          state: "CA",
          postalCode: "90001",
          country: "USA",
          },
      ],
      appointmentStatus: "Scheduled",
      billingStatus: "Pending", 
      office: "Main Office",
      examRoom: "Room 102",
      reason: "Follow-up Visit",
    },
    {
      _id: "3",
      chartNumber: "P-003",
      name: [{ text: "Emily Johnson" }],
      telecom: [{}, { value: "456-789-1234" }],
      birthDate: "1990-02-20",
      appointment: [
        {
          date: "2025-04-17",
          time: "09:00 AM",
          status: "Scheduled",
        },
      ],
      address: [
        {
          use: "home",
          line: ["789 Oak St"],
          city: "Chicago",
          state: "IL",
          postalCode: "60001",
          country: "USA",

    }
      ],
      appointmentStatus: "Scheduled",
      billingStatus: "Pending",
      office: "Main Office",
      examRoom: "Room 103",
      reason: "New Patient Visit",
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
                    <h3 className="my-5">No Patient Found!</h3>
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

export default FutureAppointment;
