import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const ProfessionalInformation = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showCAQHPassword, setShowCAQHPassword] = useState(false);

  return (
    <div className='container-fluid px-0'>
      <div className="row mt-1" style={{ borderBottom: '1px solid #444141' }}>
        <p className="fw-bold mb-1">
          Identification & Credentials
        </p>
        <div className="col-6">
          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              TIN/SSN
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter TIN/SSN"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              NPI Username
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter NPI Username"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              CAQH ID
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter CAQH ID"
            />
          </Form.Group>

        </div>

        <div className="col-6">
          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              NPI (National Provider Identifier)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter NPI"
            />
          </Form.Group>

          <Form.Group className='mb-1 '>
            <Form.Label className='mb-0'>NPI Password </Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder='NPI Password'
                readOnly
              />
              <span
                className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </Form.Group>
          <div className="row">
            <div className="col-6">
              <Form.Group className="mb-1">
                <Form.Label className='mb-0'>
                  CAQH Username
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter CAQH Username"
                />
              </Form.Group>
            </div>

            <div className="col-6">
              <Form.Group className='mb-2 '>
                <Form.Label className='mb-0'>CAQH Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    placeholder='CAQH Password'
                    readOnly
                  />
                  <span
                    className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                    onClick={() => setShowCAQHPassword(!showCAQHPassword)}
                  >
                    {showCAQHPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

            </div>
          </div>
        </div>
      </div>

      <div className="row mt-1" style={{ borderBottom: '1px solid #444141' }}>
        <p className="fw-bold">
          Medicare & Medicaid Information
        </p>
        <div className="col-6">
          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              Medicare PTAN
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Medicare PTAN"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              Medicare SPOT Logins
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Medicare SPOT Logins"
            />
          </Form.Group>
        </div>

        <div className="col-6">
          <div className="row">
            <div className="col-6">
              <Form.Group className="mb-1">
                <Form.Label className='mb-0'>
                  Medicaid ID
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Medicaid ID"
                />
              </Form.Group>
            </div>

            <div className="col-6">
              <Form.Group className="mb-1">
                <Form.Label className='mb-0'>
                  Department
                </Form.Label>
                <Form.Select
                >
                  <option value="" disabled selected>
                    Select Department
                  </option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-2">
            <Form.Label className='mb-0'>
              Medicare PECOS Login
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Medicare PECOS Logins"
            />
          </Form.Group>
        </div>
      </div>

      <div className="row mt-1" style={{ borderBottom: '1px solid #444141' }}>
        <p className="fw-bold">
          Licensing Information
        </p>
        <div className="col-6">
          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              State License
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter State License"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              State License Obtained (state)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter State of License"
            />
          </Form.Group>
        </div>

        <div className="col-6">
          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              State License Provider (licensing authority name)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Licensing Authority Name"
            />
          </Form.Group>

          <div className="row">
            <div className="col-6">
              <Form.Group className="mb-1">
                <Form.Label className='mb-0'>
                  State License Issue Date
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Issue Date"
                />
              </Form.Group>
            </div>

            <div className="col-6">
              <Form.Group className="mb-2">
                <Form.Label className='mb-0'>
                  License Expiration Date
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Expiration Date"
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-6">
          <div>
            <Form.Group className="mb-1">
              <Form.Label htmlFor="DEA" className="form-label mb-0">
                DEA # (Drug Enforcement Administration number)
              </Form.Label>
              <Form.Control
                type="text"
                id="DEA"
                className="w-100 input ps-2 py-1"
                placeholder="Enter DEA #"
              />
            </Form.Group>
          </div>
        </div>
        <div className="col-6">
          <div>
            <div className="row">
              <Form.Group className="mb-1">
                <Form.Label htmlFor="DEA_IssueDate" className="form- mb-0">
                  DEA Issue Date
                </Form.Label>
                <Form.Control
                  type="date"
                  id="DEA_IssueDate"
                  className="w-100 input ps-2 py-1"
                />
              </Form.Group>
            </div>
          </div>
        </div>
        <Form.Group className="mb-1">
          <Form.Label htmlFor="CLIA" className="form-label mb-0">
            CLIA # (Clinical Laboratory Improvement Amendments)
          </Form.Label>
          <Form.Control
            type="text"
            id="CLIA"
            className="w-100 input ps-2 py-1"
            placeholder="Enter CLIA #"
          />
        </Form.Group>
      </div>

      <div className="d-flex justify-content-end gap-2 my-1">
        <Button className="" variant="secondary">
          Cancel
        </Button>
        <Button className="" type="submit">
          Update
        </Button>
      </div>

    </div>
  )
}

export default ProfessionalInformation