import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { getDoctorsAction } from '../../redux/doctors/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const ProfessionalInformation = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showCAQHPassword, setShowCAQHPassword] = useState(false);
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const doctorDetails = store?.getDoctorsReducer?.data
  console.log(doctorDetails, '123456789');

  useEffect(() => {
    dispatch(
      getDoctorsAction()
    );

  }, [dispatch]);

  useEffect(() => {

    setValue('TIN_SSN', doctorDetails?.result?.TIN_SSN)
    setValue('NPI', doctorDetails?.result?.NPI)
    setValue('NPIUsername', doctorDetails?.result?.NPIUsername)
    setValue('CAQH_ID', doctorDetails?.result?.CAQH_ID)
    setValue('CAQHUsername', doctorDetails?.result?.CAQHUsername)
    setValue('medicarePTAN', doctorDetails?.result?.medicarePTAN)
    setValue('medicaidID', doctorDetails?.result?.medicaidID)
    setValue('department', doctorDetails?.result?.departmentId?._id)
    setValue('Medicare_SPOT_Logins', doctorDetails?.result?.Medicare_SPOT_Logins)
    setValue('Medicare_PECOS_Logins', doctorDetails?.result?.Medicare_PECOS_Logins)
    setValue('stateLicense', doctorDetails?.result?.LicensingInformation?.[0]?.stateLicense)
    setValue('stateLicenseProvider', doctorDetails?.result?.LicensingInformation?.[0]?.stateLicenseProvider)
    setValue('stateLicenseObtained', doctorDetails?.result?.LicensingInformation?.[0]?.stateLicenseObtained)
    setValue('DEA', doctorDetails?.result?.DEA)
    setValue('CLIA', doctorDetails?.result?.CLIA)

    const formattedDEAIssueDate = doctorDetails?.result?.DEA_IssueDate
      ? new Date(doctorDetails?.result?.DEA_IssueDate).toISOString().split('T')[0]
      : '';
    const formattedStateLicenseIssueDate = doctorDetails?.result?.LicensingInformation?.[0]?.stateLicenseIssueDate
      ? new Date(doctorDetails?.result?.LicensingInformation?.[0]?.stateLicenseIssueDate).toISOString().split('T')[0]
      : '';
    const formattedLicenseExpirationDate = doctorDetails?.result?.LicensingInformation?.[0]?.licenseExpirationDate
      ? new Date(doctorDetails?.result?.LicensingInformation?.[0]?.licenseExpirationDate).toISOString().split('T')[0]
      : '';

    setValue('DEA_IssueDate', formattedDEAIssueDate);
    setValue('stateLicenseIssueDate', formattedStateLicenseIssueDate);
    setValue('licenseExpirationDate', formattedLicenseExpirationDate);

  }, [doctorDetails, setValue])

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
              {...register('TIN_SSN',)}
              type="text"
              placeholder="Enter TIN/SSN"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              NPI Username
            </Form.Label>
            <Form.Control
              {...register('NPIUsername',)}
              type="text"
              placeholder="Enter NPI Username"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              CAQH ID
            </Form.Label>
            <Form.Control
              {...register('CAQH_ID',)}
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
              {...register('NPI',)}
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
                  {...register('CAQHUsername',)}
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
              {...register('medicarePTAN',)}
              type="text"
              placeholder="Enter Medicare PTAN"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              Medicare SPOT Logins
            </Form.Label>
            <Form.Control
              {...register('Medicare_SPOT_Logins',)}
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
                  {...register('medicaidID',)}
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
                <Form.Control
                  // {...register('department',)}
                  type="text"
                placeholder="Department"
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-2">
            <Form.Label className='mb-0'>
              Medicare PECOS Login
            </Form.Label>
            <Form.Control
              {...register('Medicare_PECOS_Logins',)}
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
              {...register('stateLicense',)}
              type="text"
              placeholder="Enter State License"
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className='mb-0'>
              State License Obtained (state)
            </Form.Label>
            <Form.Control
              {...register('stateLicenseObtained',)}
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
              {...register('stateLicenseProvider',)}
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
                  {...register('stateLicenseIssueDate',)}
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
                  {...register('licenseExpirationDate',)}
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
                {...register('DEA',)}
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
                  {...register('DEA_IssueDate',)}
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
            {...register('CLIA',)}
            type="text"
            id="CLIA"
            className="w-100 input ps-2 py-1"
            placeholder="Enter CLIA #"
          />
        </Form.Group>
      </div>

      <div className="d-flex justify-content-end gap-2 my-1">
        <Button className="custom-buttons" >
          Cancel
        </Button>
        <Button className="custom-buttons" type="submit">
          Update
        </Button>
      </div>

    </div >
  )
}

export default ProfessionalInformation