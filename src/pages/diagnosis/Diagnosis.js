import React, { useState } from 'react';
import { Button, Card, Col, Row, Modal, Form } from 'react-bootstrap';
import { FormInput } from '../../components';
import classNames from 'classnames';
import { FiSearch } from 'react-icons/fi';
import DiagnosisCategories from './DiagnosisCategories';
import DiagnosisTests from './DiagnosisTests';
import { Link } from 'react-router-dom';

const Diagnosis = () => {
  const [activeTab, setActiveTab] = useState('diagnosisCategories'); // Active tab state
  const [searchQuery, setSearchQuery] = useState(''); // State to hold search query
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // Function to render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'diagnosisCategories':
        return <DiagnosisCategories />;
      case 'diagnosisTests':
        return <DiagnosisTests />;
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
                    {['diagnosisCategories', 'diagnosisTests'].map((tab, index) => (
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
                          {tab === 'diagnosisCategories' && 'Diagnosis Categories'}
                          {tab === 'diagnosisTests' && 'Diagnosis Tests'}
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
                            value={searchQuery} // Bind value to searchQuery state
                            style={{
                              paddingLeft: '30px', // Adjust for icon space
                              width: '100%',
                            }}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {/* <FiSearch
                            style={{
                              position: 'absolute',
                              left: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#aaa',
                            }}
                          /> */}
                        </div>
                      </div>

                      {activeTab === 'diagnosisCategories' && (
                        <Button
                          className="custom-buttons"
                          onClick={() => setShowModal(true)} // Open the modal
                        >
                          New Diagnosis Category
                        </Button>
                      )}
                      {activeTab === 'diagnosisTests' && (
                        <Button className="custom-buttons" as={Link} to={'/apps/diagnosis/newDiagnosisTest'}>
                          New Patient Diagnosis Test
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
          <Modal.Title>New Diagnosis Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Diagnosis Category</Form.Label>
              <Form.Control type="text" placeholder="Enter Diagnosis Category" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Description" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Diagnosis;
