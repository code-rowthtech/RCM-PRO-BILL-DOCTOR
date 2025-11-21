import React, { useState } from 'react';
import { Button, Card, Col, Row, Table, Form } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { MdDeleteOutline } from "react-icons/md";

const LabRequest = () => {
  const [showSecondary, setShowSecondary] = useState(false);
  const [rows, setRows] = useState([
    { loincCode: "", description: "", resultValue: "", units: "", normalRange: "", abnormalFlag: "" }
  ]);

  // Function to add a new row
  const addRow = () => {
    setRows([...rows, { loincCode: "", description: "", resultValue: "", units: "", normalRange: "", abnormalFlag: "" }]);
  };

  // Function to delete a row
  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <div className="mt-2">
      <Card className="px-2" style={{ height: "70vh" }}>
        {!showSecondary ? (
          // Primary Section
          <div className="pt-2 px-2">
            <div className="d-flex justify-content-between">
              <h4>Manage Lab Orders</h4>
              <div className='d-flex gap-2'>
                <Button
                  className="custom-buttons text-nowrap"
                  onClick={() => setShowSecondary(true)}
                >
                  <FiPlus className="fs-5 text-white" /> &nbsp;Manual Entry
                </Button>
                <Button className="custom-buttons">
                  <FiPlus className="fs-5 text-white" /> &nbsp;Task
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Secondary Section
          <div className="pt-2 px-2">
            <div className="d-flex justify-content-between">
              <h4>Lab Request</h4>
              <div className='d-flex gap-2'>
                <Button className="custom-buttons text-nowrap">
                  <FiPlus className="fs-5 text-white" /> &nbsp;Task
                </Button>
                <Button
                  className="custom-buttons"
                  onClick={() => setShowSecondary(false)}
                >
                  Back
                </Button>
              </div>
            </div>
            {/* Table One Section */}
            <Table responsive className="table table-nowrap mb-0">
              <thead className="text-white bg-dark">
                <tr>
                  <th className="text-white ">Ordering Doctor</th>
                  <th className="text-white ">Loinc Code</th>
                  <th className="text-white ">Description</th>
                  <th className="text-white ">Date</th>
                  <th className="text-white ">Sign Off</th>
                  <th className="text-white ">Status</th>
                  <th className="text-white ">Result</th>
                  <th className="text-white ">File</th>
                  <th className="text-white ">Comments</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

              </tbody>
            </Table>
            <div>
              <h4>Enter Lab Orders</h4>
              <Row>
                <Col sm={4} className=''>
                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="appointment" className="mb-0">
                      Appointment
                    </Form.Label>
                    <Form.Select
                      id="appointment"
                    // {...register('appointment', { required: 'Appointment is required' })}
                    // data-has-value={!!watch('appointment')}
                    >
                      <option value="" hidden>
                        Select Appointment
                      </option>
                      <option value="Appointment1">Appointment 1</option>

                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={4} className=''>
                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="dateTestPerformed" className="mb-0">
                      Date Test Performed
                    </Form.Label>
                    <Form.Control
                      type="date"
                      id="dateTestPerformed"
                      name="dateTestPerformed"
                    />
                  </Form.Group>

                </Col>
                <Col sm={4} className=''>
                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="comments" className="mb-0">
                      Comments
                    </Form.Label>
                    <Form.Select
                      id="comments"
                    >
                      <option value="" hidden>
                        Select comments
                      </option>
                      <option value="comment1">comment 1</option>

                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6} className=''>
                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="status" className="mb-0">
                      Status
                    </Form.Label>
                    <Form.Select
                    >
                      <option value="" hidden>
                        Select Status
                      </option>
                      <option value="status1">Status 1</option>

                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6} className=''>
                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="scanned" className="mb-0">
                      Scanned in result
                    </Form.Label>
                    <Form.Select
                      id="scanned"
                    >
                      <option value="" hidden>
                        Select Scanned in result
                      </option>
                      <option value="1">1</option>

                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              {/* Table Two Section */}
              <Table responsive className="table table-nowrap mb-0 mt-2">
                <thead className="text-white bg-dark">
                  <tr>
                    <th className="text-white">Loinc Code</th>
                    <th className="text-white">Description</th>
                    <th className="text-white">Result value</th>
                    <th className="text-white">Units</th>
                    <th className="text-white">Normal Range</th>
                    <th className="text-white">Abnormal Flag</th>
                    <th className="text-white">Action</th>
                    <th className="text-white py-0">
                      <div className="d-flex justify-content-end">
                        <Button className="custom-buttons text-nowrap" onClick={addRow}>
                          <FiPlus className="fs-5 text-white" /> &nbsp; Another
                        </Button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td className='bg-white'>
                        <Form.Group>
                          <Form.Control type="text" value={row.loincCode} />
                        </Form.Group>
                      </td>
                      <td className='bg-white'>
                        <Form.Group>
                          <Form.Control type="text" value={row.description} />
                        </Form.Group>
                      </td>
                      <td className='bg-white'>
                        <Form.Group>
                          <Form.Control type="text" value={row.resultValue} />
                        </Form.Group>
                      </td>
                      <td className='bg-white'>
                        <Form.Group>
                          <Form.Control type="text" value={row.units} />
                        </Form.Group>
                      </td>
                      <td className='bg-white'>
                        <Form.Group>
                          <Form.Control type="text" value={row.normalRange} />
                        </Form.Group>
                      </td>
                      <td className='bg-white'>
                        <Form.Group>
                          <Form.Select value={row.abnormalFlag}>
                            <option value="" hidden>Select Flag</option>
                            <option value="1">1</option>
                          </Form.Select>
                        </Form.Group>
                      </td>
                      <td className='bg-white'>
                        <MdDeleteOutline className="text-danger fs-3 ms-1" onClick={() => deleteRow(index)} style={{ cursor: "pointer" }} />
                      </td>
                      <td className='bg-white'></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LabRequest;
