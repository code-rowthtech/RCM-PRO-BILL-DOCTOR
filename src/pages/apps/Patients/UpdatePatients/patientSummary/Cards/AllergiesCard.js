import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { FaAllergies } from 'react-icons/fa';
import { MdAddCircleOutline, MdOutlinePrint } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAllergiesAction } from '../../../../../../redux/allergies/actions';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../../../../../../constants/Spinner';
import { handlePrintAllergies } from '../../PDFfiles/allergyPDF';
import AllergyModal from '../../clinicalReview/allergy/AllergyModal';

const AllergiesCard = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const [allergyModal, setAllergyModal] = useState(false);
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    const allergiesData = store?.getAllergiesReducer?.data?.allergies?.slice(0, 3);
    const handleAddAllergiesModal = () => {
        setAllergyModal(true);
    };
    useEffect(() => {
        if (!allergiesData?.length) {
            dispatch(getAllergiesAction({ patientId: patientId, skip: 1 }))
        }
    }, [allergiesData, dispatch])

    const getSeverityBadge = (severity) => {
        if (!severity || !severity.code || !severity.display) return null;

        const code = severity.code.toLowerCase();

        const variantMap = {
            high: 'danger',
            severe: 'danger',
            moderate: 'warning',
            low: 'info',
            mild: 'info',
        };

        const variant = variantMap[code] || 'secondary';

        return <span className={`ms-2 text-${variant}`}>{severity.display}</span>;
    };
    const handleCloseModal = () => {
        setAllergyModal(false);
    };
    return (
        <>
        <Card className="h-100 shadow-sm">
            <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                    <FaAllergies className="me-2 text-secondary" />
                    <span className="fw-bold fs-6">Allergies</span>
                </div>
                <div>
                    <MdAddCircleOutline
                        className="text-primary me-2 cursor-pointer"
                            onClick={handleAddAllergiesModal}

                    />
                    <MdOutlinePrint
                        className="text-secondary cursor-pointer"
                        title="Print all Allergies"
                                onClick={() => handlePrintAllergies({ patientDetails, allergiesData })}
                    />
                </div>
            </Card.Header>
            <Card.Body className="p-2 pb-0 summary-card-body scroll-container">
                {store?.getAllergiesReducer?.loading ?
                    <div className='d-flex align-items-center justify-content-center h-100'>
                        <Spinner className='spinner-border-sm' />
                    </div>
                    : allergiesData && allergiesData.length > 0 ? (
                        <ul className="list-unstyled pb-0 mb-0">
                            {allergiesData.slice(0, 4).map((allergy, index) => (
                                <li
                                    key={index}
                                    className="mb-2 d-flex justify-content-between align-items-start">
                                    <div className="fs-6">
                                        <strong title={allergy?.code?.text}>
                                            {allergy?.code?.text?.length > 30
                                                ? allergy?.code?.text?.slice(0, 29) + '...'
                                                : allergy?.code?.text || 'Unknown Allergy'}
                                        </strong>
                                        <div className="text-muted  small">
                                            {allergy?.clinicalStatus?.text || 'Status not available'}
                                        </div>
                                    </div>
                                    <span className="fs-6 fw-semibold text-nowrap">
                                        {getSeverityBadge(allergy.criticality)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul
                            className="list-unstyled d-flex align-items-center justify-content-center"
                            style={{ height: '100%', width: '100%' }}>
                            <li className="mb-2">
                                <div className="fs-6  d-flex justify-content-between align-items-center">
                                    <strong>No Allergies Found</strong>
                                </div>
                            </li>
                        </ul>
                    )
                }
            </Card.Body>
            <div
                className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline"
                //   onClick={() => setSelectedMainTab('Allergy List')}
                  >
                Go To Allergies List
            </div>
        </Card>
                    <AllergyModal show={allergyModal} closeModal={handleCloseModal} />
                    </>
        
        )
}

export default AllergiesCard