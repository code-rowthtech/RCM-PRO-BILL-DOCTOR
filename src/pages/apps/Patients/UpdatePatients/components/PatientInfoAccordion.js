import React, { useRef, useState } from 'react'
import { Accordion, Button, Card, Col, Dropdown, Form, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import Spinner from '../../../../../constants/Spinner';
import { BiEdit } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { handleUpload } from '../../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useDispatch } from 'react-redux';
import { updatePatientsAction } from '../../../../../redux/actions';
import { TbCapture } from 'react-icons/tb';
import { IoClose, IoPrintSharp } from 'react-icons/io5';
import { LiaReceiptSolid } from 'react-icons/lia';

const PatientInfoAccordion = (props) => {
    const { activeKey,setActiveKey, setSelectedMainTab, setCreateEncounter } = props;
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const {
        handleSubmit,
    } = useForm();
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [printOptions, setPrintOptions] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState('');

    const id = searchParams.get('id');
    const patientDetails = store?.getPatientsByIdReducer?.data?.data;


    // Camera functionality to capture profile photos till line 168
    const openCamera = async () => {
        try {
            setIsCameraOpen(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const file = new File([blob], `profile-photo-${Date.now()}.png`, {
                type: 'image/png',
            });

            try {
                const url = await handleUpload(file, setUploading);
                setLogo(url);
                setLogoName(file.name);
            } catch (error) {
                console.error('Error uploading photo:', error);
            }
        }, 'image/png');

        stopCamera();
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        stream?.getTracks().forEach((track) => track.stop());
        setIsCameraOpen(false);
    };

    const onSubmit = (data) => {
        const photoUrl = logo?.url?.split('?')[0] || patientDetails?.photo?.url;
        const payload = {
            id,
            ...(logo?.url ? {
                photo: [{ url: photoUrl, title: logoName }],
            } : {}),
        };

        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };
    return (
        <Accordion
            className=""
            activeKey={activeKey}
            onSelect={(eventKey) => setActiveKey(eventKey)}>
            <Accordion.Item eventKey="0">
                <Accordion.Header className="p-0  m-0">
                    <div className="ps-2 py-1">
                        <p className="text-nowrap fs-6 mb-0">
                            <span
                                className="fw-bold text-capitalize pe-1 ps-0"
                                style={{
                                    color: 'rgb(249, 139, 55)',
                                    borderRight: '1px solid gray',
                                }}>
                                {patientDetails?.name?.[0]?.prefix + ' ' || ''}
                                {patientDetails?.name?.[0]?.given?.join(' ') + ' ' || 'N/A'}
                                {patientDetails?.name?.[0]?.family || ''}
                            </span>{' '}
                            <span
                                style={{ borderRight: '1px solid gray' }}
                                className="fs-6 fw-bold text-capitalize px-1">
                                {patientDetails?.gender || ' '}
                            </span>
                            <span
                                style={{ borderRight: '1px solid gray' }}
                                className="fs-6 fw-bold text-capitalize px-1">
                                {patientDetails?.birthDate
                                    ? new Date(patientDetails.birthDate).toLocaleDateString(
                                        'en-GB'
                                    )
                                    : 'N/A'}{' '}
                                {patientDetails?.approxAge &&
                                    (() => {
                                        const years = Math.floor(patientDetails.approxAge);
                                        const months = Math.round(
                                            (patientDetails.approxAge - years) * 12
                                        );
                                        return `(${years} year${years !== 1 ? 's old)' : ''} `;
                                    })()}
                            </span>
                            <span className="fs-6 fw-bold text-capitalize px-1">
                                Chart ID: {patientDetails?.chartNumber || ''}
                            </span>
                        </p>
                    </div>
                </Accordion.Header>
                <Accordion.Body className="p-0">
                    <Card.Body className="py-2 px-0">
                        <Row className="p-0 mx-0">
                            <Col sm={1} className="px-0 pt-1">
                                <Form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="d-flex flex-column align-items-center">
                                    <div className="position-relative w-75 d-flex align-items-center flex-column justify-content-center">
                                        {isCameraOpen ? (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="rounded"
                                                style={{
                                                    width: '120px',
                                                    height: '90px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : uploading ? (
                                            <Spinner />
                                        ) : (
                                            <img
                                                src={
                                                    logo?.url
                                                        ? logo.url.split('?')[0]
                                                        : patientDetails?.photo[0]?.url
                                                            ? patientDetails.photo[0]?.url
                                                            : profilePhoto
                                                }
                                                alt="Patient Profile"
                                                className="img-fluid rounded object-fit-cover"
                                                style={{
                                                    width: '120px',
                                                    height: '90px',
                                                }}
                                            />
                                        )}

                                        {!isCameraOpen && (
                                            <BiEdit
                                                className={`position-absolute fs-4 text-primary ${uploading ? 'd-none' : ''
                                                    }`}
                                                style={{
                                                    top: '-9%',
                                                    right: '-10%',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={openCamera}
                                            />
                                        )}

                                        {isCameraOpen && (
                                            <div className="camera-controls d-flex justify-content-center gap-1">
                                                <Button
                                                    onClick={capturePhoto}
                                                    type="button"
                                                    className="custom-buttons">
                                                    <TbCapture className="text-white fs-5" />{' '}
                                                </Button>
                                                <Button
                                                    onClick={stopCamera}
                                                    className="custom-buttons">
                                                    <IoClose className="text-white fs-5" />
                                                </Button>
                                            </div>
                                        )}

                                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                                    </div>

                                    {/* Submit button that sends the form after upload */}
                                    <Button
                                        // onClick={onSubmit}
                                        type="submit"
                                        className={`${!logo ? 'd-none' : 'mt-1 custom-buttons'
                                            }`}
                                        disabled={!logo}>
                                        Submit
                                    </Button>
                                </Form>
                            </Col>
                            <Col sm={9}>
                                <Row className="pt-1 px-2">
                                    <Col className="" sm={6} md={4}>
                                        <Table className="h-100 box-shadow-none">
                                            <tr className="">
                                                <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                    Phone:
                                                </th>
                                                <td
                                                    className={`fs-6  text-nowrap  ${patientDetails?.telecom?.find(
                                                        (data) => data?.system === 'phone'
                                                    )?.value
                                                        ? 'text-black'
                                                        : 'text-danger'
                                                        }`}>
                                                    {'+1-' +
                                                        patientDetails?.telecom?.find(
                                                            (data) => data?.system === 'phone'
                                                        )?.value || 'Missing'}
                                                </td>
                                            </tr>
                                            <tr className="">
                                                <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                    Email:
                                                </th>
                                                <td
                                                    className={`fs-6  text-nowrap text-black ${patientDetails?.telecom?.find(
                                                        (item) => item?.system === 'email'
                                                    )?.value
                                                        ? 'text-black'
                                                        : 'text-danger'
                                                        }`}>
                                                    {patientDetails?.telecom?.find(
                                                        (item) => item?.system === 'email'
                                                    )?.value || 'Missing'}
                                                </td>
                                            </tr>
                                            <tr className="">
                                                <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                    Address:
                                                </th>
                                                <td
                                                    className={`fs-6  text-nowrap ${patientDetails?.address?.[0]?.city &&
                                                        patientDetails?.address?.[0]?.state
                                                        ? 'text-black'
                                                        : 'text-danger'
                                                        }`}>
                                                    {patientDetails?.address?.[0]?.city &&
                                                        patientDetails?.address?.[0]?.state
                                                        ? `${patientDetails.address[0].city}, ${patientDetails.address[0].state}`
                                                        : 'Missing'}
                                                </td>
                                            </tr>
                                        </Table>
                                    </Col>

                                    <Col className="" sm={6} md={4}>
                                        <Table className="h-100 box-shadow-none">
                                            <tr className="">
                                                <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                    Primary Provider:
                                                </th>
                                                <td
                                                    className={`fs-6 text-nowrap ${patientDetails?.doctorId?.name?.[0]
                                                        ?.text
                                                        ? 'text-black'
                                                        : 'text-danger'
                                                        }`}>
                                                    {patientDetails?.doctorId?.name?.[0]
                                                        ?.text || 'Missing'}
                                                </td>
                                            </tr>
                                            <tr className="">
                                                <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                    Date Added:
                                                </th>
                                                <td className="fs-6 text-nowrap text-black">
                                                    {' '}
                                                    {new Date(
                                                        patientDetails?.createdAt
                                                    )?.toLocaleDateString('en-GB')}
                                                </td>
                                            </tr>
                                            <tr className="">
                                                <th className="fs-6 ps-2 text-nowrap text-muted fw-bold">
                                                    Insurance:
                                                </th>
                                                <td className="fs-6  text-nowrap text-danger">
                                                    Missing
                                                </td>
                                            </tr>
                                        </Table>
                                    </Col>
                                    <Col sm={4}>
                                        <Table className="h-100 box-shadow-none">
                                            <tr className="">
                                                <th className="fs-6 px-2 text-nowrap text-muted fw-bold">
                                                    Last Appointment:
                                                </th>
                                                <td className="fs-6 pe-2 text-nowrap text-black">
                                                    16/04/2025
                                                </td>
                                            </tr>
                                            <tr className="">
                                                <th className="fs-6 px-2 text-nowrap text-muted fw-bold">
                                                    Next Appointment:
                                                </th>
                                                <td className="fs-6 pe-2 text-nowrap text-black">
                                                    26/05/2025
                                                </td>
                                            </tr>
                                            <tr className="">
                                                <th className="fs-6 px-2 text-nowrap text-muted fw-bold">
                                                    Follow Up Reason:
                                                </th>
                                                <td
                                                    className={`fs-6 pe-2 text-capitalize text-nowrap ${patientDetails?.followupReason
                                                        ? 'text-black'
                                                        : 'text-danger'
                                                        }`}>
                                                    {patientDetails?.followupReason ||
                                                        'Missing'}
                                                </td>
                                            </tr>
                                        </Table>
                                    </Col>
                                </Row>
                            </Col>

                            <Col sm={2} className="d-flex justify-content-end pe-3">
                                <div className="text-center d-flex flex-column gap-1">
                                    <Button
                                        as={Link}
                                        to="/apps/appointments/newAppointment"
                                        className="shadow-none"
                                        style={{
                                            fontSize: '10px',
                                            borderRadius: '8px',
                                            padding: '3px 7px 3px 7px',
                                            width: '100px',
                                            backgroundColor: ' #6169d0',
                                        }}>
                                        New Appointment
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedMainTab('Encounter');
                                            setCreateEncounter(true)
                                            // setExpanded(true);
                                        }}
                                        className="shadow-none"
                                        style={{
                                            fontSize: '10px',
                                            borderRadius: '8px',
                                            padding: '3px 7px 3px 7px',
                                            width: '100px',
                                            backgroundColor: ' #6169d0',
                                        }}>
                                        New Encounter
                                    </Button>
                                    <div className="mt-1 d-flex justify-content-center align-items-center gap-2 ps-2">
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                variant="light"
                                                className="p-0 border-0 bg-transparent hover-bg-light rounded-circle"
                                                id="print-dropdown"
                                                aria-label="Print options"
                                            >
                                                <IoPrintSharp className="fs-4 text-primary" />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="px-3 py-2 shadow-sm" style={{ minWidth: "220px" }}>
                                                <div className="mb-2">
                                                    <h6 className="fw-semibold mb-2 text-muted">Select sections to print</h6>
                                                    <div className="d-flex flex-column gap-2">
                                                        {['Vitals List', 'Allergies', "Problems", "Medications"].map((data) => (
                                                            <div className="form-check form-check-inline  d-flex align-items-center" key={data}>
                                                                <input
                                                                    className="form-check-input me-2"
                                                                    type="checkbox"
                                                                    id={`print-${data}`}
                                                                    checked={printOptions.includes(data)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setPrintOptions((prev) => [...prev, data]);
                                                                        } else {
                                                                            setPrintOptions((prev) => prev.filter((item) => item !== data));
                                                                        }
                                                                    }}
                                                                />
                                                                <label className="form-check-label" htmlFor={`print-${data}`}>
                                                                    {data}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                                    <small className="text-muted">
                                                        {printOptions?.length} selected
                                                    </small>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className='custom-buttons'
                                                        // onClick={() =>
                                                        //     handlePrintPatientSummary({
                                                        //         toBePrinted: printOptions,
                                                        //         patientDetails: patientDetails,
                                                        //         vitals: store?.getVitalsByPatientIdReducer?.data?.data,
                                                        //         medicationList: store?.getMedicationReducer?.data?.medicationRequests,
                                                        //         allergyData: store?.getAllergiesOfAPatientReducer?.data?.allergies,
                                                        //         problemData: store?.getProblemListReducer?.data?.problems
                                                        //     })
                                                        // }
                                                        disabled={
                                                            printOptions?.length < 1 ||
                                                            store?.getVitalsByPatientIdReducer?.loading ||
                                                            store?.getMedicationReducer?.loading ||
                                                            store?.getAllergiesOfAPatientReducer?.loading ||
                                                            store?.getProblemListReducer?.loading
                                                        }
                                                    >
                                                        {(
                                                            store?.getVitalsByPatientIdReducer?.loading ||
                                                            store?.getMedicationReducer?.loading ||
                                                            store?.getAllergiesOfAPatientReducer?.loading ||
                                                            store?.getProblemListReducer?.loading
                                                        ) ? (
                                                            <>
                                                                Preparing...
                                                            </>
                                                        ) : (
                                                            'Print Report'
                                                        )}
                                                    </Button>
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        <LiaReceiptSolid className="fs-4  text-primary" />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default PatientInfoAccordion
