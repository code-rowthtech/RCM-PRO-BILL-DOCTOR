import React, { useState, useEffect, useRef } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { IoIosSearch } from 'react-icons/io';
import classNames from 'classnames';

interface City {
    id: string;
    name: string;
    stateName: string;
}

const mockCities: City[] = [
    { id: '1', name: 'New York', stateName: 'NY' },
    { id: '2', name: 'Los Angeles', stateName: 'CA' },
    { id: '3', name: 'Chicago', stateName: 'IL' },
    { id: '4', name: 'Houston', stateName: 'TX' },
    { id: '5', name: 'Phoenix', stateName: 'AZ' },
];

const ClinicalNotes = () => {
    const [value, setValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [selectedCities, setSelectedCities] = useState([]);
    const dropdownRef = useRef(null);
    const [activeTab, setActiveTab] = useState('medicalHistory');
    const filteredCities = mockCities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.stateName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCityToggle = (city: City) => {
        setSelectedCities(prev =>
            prev.some(c => c.id === city.id)
                ? prev.filter(c => c.id !== city.id)
                : [...prev, city]
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCityDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        { value: 'template1', label: 'Template 1' },
        { value: 'template2', label: 'Template 2' },
        { value: 'template3', label: 'Template 3' }
    ];


    return (
        <div>
            <Row>
                <Col className='d-flex justify-content-between'>
                    <div>
                        <p style={{ fontWeight: 700 }}>Notes Template</p>
                    </div>
                    <div className='d-flex gap-2'>
                        <Button
                            className="custom-buttons"
                        >
                            Vital Signs
                        </Button>
                        <Button
                            variant='secondary'
                        // className="custom-buttons"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                        // className="custom-buttons"
                        >
                            Save Notes
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Template</Form.Label>
                        <Select
                            // defaultValue={[options]}
                            isMulti
                            name="colors"
                            options={options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Medical  History</Form.Label>
                        <Select
                            // defaultValue={[options]}
                            isMulti
                            name="colors"
                            options={options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </Form.Group>
                </Col>

                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Date</Form.Label>
                        <Form.Control
                            type='date'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <div ref={dropdownRef}>
                        <label className="block mb-1">
                            Search
                            <span className="ml-2 text-muted">({selectedCities.length} selected)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter city name"
                                onClick={() => setIsCityDropdownOpen(true)}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                            />
                            {/* <IoIosSearch className="position-absolute top-50 end-0 me-3" size={20} /> */}
                        </div>

                        {isCityDropdownOpen && (
                            <div className="dropdown-menu show " style={{ width: '18vw' }}>
                                <div>
                                    <ul className="nav nav-underline">
                                        {['medicalHistory', 'patientHobbies'].map((tab, index) => (
                                            <li className="nav-item ms-2" key={index}>
                                                <a
                                                    className={classNames('nav-link fw-bold text-black bg-light rounded', {
                                                        active: activeTab === tab,
                                                    })}
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab(tab);
                                                    }}
                                                >
                                                    {tab === 'medicalHistory' && 'Medical History'}
                                                    {tab === 'patientHobbies' && 'Patient Hobbies'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {filteredCities.map(city => (
                                    <div
                                        key={city.id}
                                        className="dropdown-item d-flex gap-3 align-items-center"
                                        onClick={() => handleCityToggle(city)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCities.some(c => c.id === city.id)}
                                            readOnly
                                        />
                                        <span>{city.name} ({city.stateName})</span>

                                    </div>
                                ))}
                                {filteredCities.length === 0 && (
                                    <div className="dropdown-item text-muted text-center">No cities found</div>
                                )}
                                <div className='mx-2'>
                                    <Button
                                        className='custom-buttons w-100'
                                        onClick={() => setShowModal(true)} // Open the modal
                                    >
                                        Add Notes</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Hobbies</Form.Label>
                        <Select
                            // defaultValue={[options]}
                            isMulti
                            name="colors"
                            options={options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </Form.Group>
                </Col>
                {/* <Col sm={3}>
                    <Button
                        onClick={() => setShowModal(true)} // Open the modal
                    >
                        modal 1
                    </Button>
                    <Button
                        onClick={() => setShow(true)} // Open the modal
                    >
                        modal 2
                    </Button>
                </Col> */}

            </Row>
            <Row>
                <Col>
                    <p style={{ fontWeight: 600 }} className='mt-2'>Progress Note</p>
                    <ReactQuill theme="snow" value={value} onChange={setValue} />
                </Col>
            </Row>

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
                    <Button variant="primary" onClick={() => setShow(false)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Diagnosis </Modal.Title>
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
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setShow(false)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ClinicalNotes