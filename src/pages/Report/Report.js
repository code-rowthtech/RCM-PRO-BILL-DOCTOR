import React, { useState } from 'react';
import { Button, Card, Col, Row, Modal, Form } from 'react-bootstrap';
import classNames from 'classnames';
import BirthReport from './BirthReport';
import DeathReport from './DeathReport';
import Investigation from './Investigation';
import OperationReport from './OperationReport';
import { FormInput } from '../../components';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Report = () => {
    const [activeTab, setActiveTab] = useState('birthReport'); // Active tab state
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [modalTitle, setModalTitle] = useState(''); // Title for the modal
    const [formData, setFormData] = useState({
        case: '',
        date: '',
        description: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOpenModal = (title) => {
        setModalTitle(title);
        setShowModal(true);
    };

    const handleSubmit = () => {
        console.log(`${modalTitle} Form Data Submitted:`, formData);
        // Add form submission logic here
        setShowModal(false); // Close the modal
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'birthReport':
                return <BirthReport />;
            case 'deathReport':
                return <DeathReport />;
            case 'investigation':
                return <Investigation />;
            case 'operationReport':
                return <OperationReport />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card>
                        <Card.Body style={{ height: '87vh' }}>
                            <Row className="mb-2">
                                {/* Navigation Tabs */}
                                <Col sm={4} className="p-0">
                                    <ul className="nav nav-underline">
                                        {['birthReport', 'deathReport', 'investigation', 'operationReport'].map((tab, index) => (
                                            <li className="nav-item ms-2" key={index}>
                                                <a
                                                    className={classNames('nav-link fw-bold text-black', {
                                                        active: activeTab === tab,
                                                    })}
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab(tab);
                                                    }}
                                                >
                                                    {tab === 'birthReport' && 'Birth Reports'}
                                                    {tab === 'deathReport' && 'Death Reports'}
                                                    {tab === 'investigation' && 'Investigation'}
                                                    {tab === 'operationReport' && 'Operation Reports'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>

                                {/* Controls Section */}
                                <Col sm={8} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <div className="d-flex align-items-center">
                                                {/* Search Input with Icon */}
                                                <div style={{ position: 'relative', width: '100%' }}>
                                                    <FormInput
                                                        type="text"
                                                        placeholder="Search..."
                                                        style={{
                                                            paddingLeft: '30px', // Adjust for icon space
                                                            width: '100%',
                                                        }}
                                                    />
                                                    <FiSearch
                                                        style={{
                                                            position: 'absolute',
                                                            left: '10px',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            color: '#aaa',
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Buttons to Open Modal */}
                                            {activeTab === 'birthReport' && (
                                                <Button
                                                    className="custom-buttons"
                                                    onClick={() => handleOpenModal('New Birth Report')}
                                                >
                                                    New Birth Report
                                                </Button>
                                            )}
                                            {activeTab === 'deathReport' && (
                                                <Button
                                                    className="custom-buttons"
                                                    onClick={() => handleOpenModal('New Death Report')}
                                                >
                                                    New Death Report
                                                </Button>
                                            )}
                                            {activeTab === 'investigation' && (
                                                <Button
                                                    className="custom-buttons"
                                                    as={Link}
                                                    to={'/apps/report/newInvestigation'}
                                                >
                                                    New Investigation Report
                                                </Button>
                                            )}
                                            {activeTab === 'operationReport' && (
                                                <Button
                                                    className="custom-buttons"
                                                    onClick={() => handleOpenModal('New Operation Report')}
                                                >
                                                    New Operation Report
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* Tab Content */}
                            <div className="mt-1">{renderTabContent()}</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-1">
                            <Form.Label className='mb-0'>Select Case</Form.Label>
                            <Form.Select
                                name="case"
                                value={formData.case}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="Case 1">Case 1</option>
                                <option value="Case 2">Case 2</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label className='mb-0'>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label className='mb-0'>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Report;
