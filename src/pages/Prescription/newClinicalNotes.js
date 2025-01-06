import React, { useState, useEffect, useRef } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { IoIosSearch } from 'react-icons/io';
import TabButtons from './tabButtons';
import { IoPrintSharp } from 'react-icons/io5';

const mockMedicalHistory = [
    { id: '1', name: 'Diabetes', description: 'Type 2 diabetes' },
    { id: '2', name: 'Hypertension', description: 'High blood pressure' },
    { id: '3', name: 'Asthma', description: 'Chronic respiratory condition' },
];

const mockHobbies = [
    { id: '1', name: 'Reading', description: 'Loves to read books' },
    { id: '2', name: 'Swimming', description: 'Enjoys swimming in pools' },
    { id: '3', name: 'Cycling', description: 'Rides bicycles regularly' },
];

const NewClinicalNotes = () => {
    const [value, setValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [showVitalMOdal, setShowVitalMOdal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedMedicalHistory, setSelectedMedicalHistory] = useState([]);
    const [selectedHobbies, setSelectedHobbies] = useState([]);
    const [activeTab, setActiveTab] = useState('medicalHistory');
    const dropdownRef = useRef(null);

    const filteredMedicalHistory = mockMedicalHistory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredHobbies = mockHobbies.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectionToggle = (item, selectedItems, setSelectedItems) => {
        setSelectedItems(prev =>
            prev.some(i => i.id === item.id)
                ? prev.filter(i => i.id !== item.id)
                : [...prev, item]
        );
    };

    const getSelectionCount = () =>
        activeTab === 'medicalHistory'
            ? selectedMedicalHistory.length
            : selectedHobbies.length;

    const options = [
        { value: 'template1', label: 'Template 1' },
        { value: 'template2', label: 'Template 2' },
        { value: 'template3', label: 'Template 3' },
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
                            onClick={() => setShowVitalMOdal(true)}
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
                <Col sm={3} className='position-relative'>
                    <Form.Group controlId="searchDropdown " ref={dropdownRef} className='position-relative'>
                        <Form.Label className="mb-0">
                            {activeTab === 'medicalHistory' ? 'Medical History' : 'Patient Hobbies'} Search
                            <span className="ml-2">({getSelectionCount()} selected)</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Search'
                            onClick={() => setIsDropdownOpen(true)}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                        {isDropdownOpen && (
                            <div className=" bg-white shadow-lg position-absolute w-100" style={{ zIndex: 11111 }} >
                                <div className="d-flex justify-content-center buttons-head pt-2 pb-0">
                                    <TabButtons
                                        active={activeTab === 'medicalHistory'}
                                        onClick={() => setActiveTab('medicalHistory')}
                                    >
                                        Medical History
                                    </TabButtons>
                                    <TabButtons
                                        active={activeTab === 'hobbies'}
                                        onClick={() => setActiveTab('hobbies')}
                                    >
                                        Patient Hobbies
                                    </TabButtons>
                                </div>
                                <div className="pb-2">
                                    {(activeTab === 'medicalHistory' ? filteredMedicalHistory : filteredHobbies).map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex gap-3 px-4 py-2 cursor-pointer"
                                                style={{ borderBottom: '1px solid rgb(204, 204, 204)' }}
                                                onClick={() =>
                                                    handleSelectionToggle(
                                                        item,
                                                        activeTab === 'medicalHistory' ? selectedMedicalHistory : selectedHobbies,
                                                        activeTab === 'medicalHistory'
                                                            ? setSelectedMedicalHistory
                                                            : setSelectedHobbies
                                                    )
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    className='cursor-pointer'
                                                    checked={
                                                        (activeTab === 'medicalHistory'
                                                            ? selectedMedicalHistory
                                                            : selectedHobbies
                                                        ).some(i => i.id === item.id)
                                                    }
                                                    readOnly
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                        )
                                    )}
                                    <div className="px-2 mt-2">
                                        {activeTab === 'medicalHistory' && (
                                            <Button
                                                className="w-100 custom-buttons rounded-pill"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setIsDropdownOpen(false); // Close the dropdown
                                                }}
                                            >
                                                Add Notes
                                            </Button>
                                        )}
                                        {activeTab === 'hobbies' && (
                                            <Button
                                                className="w-100 custom-buttons rounded-pill"
                                                onClick={() => {
                                                    setShow(true);
                                                    setIsDropdownOpen(false); // Close the dropdown
                                                }}
                                            >
                                                Add Notes
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Form.Group>
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
            </Row>
            <Row>
                <Col>
                    <p style={{ fontWeight: 700 }} className='mt-2 mb-0'>Progress Note</p>
                    <ReactQuill theme="snow" value={value} onChange={setValue} />
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Medical History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Name" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Control as="textarea" rows={3} placeholder="Type Something" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button> */}
                    <Button variant="primary" onClick={() => setShow(false)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={() => setShow(false)} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Patient Hobbies </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Name" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Control as="textarea" rows={3} placeholder="Type Something" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button> */}
                    <Button variant="primary" onClick={() => setShow(false)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* vital notes modal */}
            <Modal show={showVitalMOdal} onHide={() => setShowVitalMOdal(false)} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Vital Signs </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <div className='d-flex justify-content-between mb-2'>
                                <div className='d-flex gap-2'>
                                    <Button>Charts</Button>
                                    <Button>Details</Button>
                                </div>
                                <div>
                                    <Button variant='success'>Add</Button>
                                </div>
                            </div>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>Time</Form.Label>
                                    <Form.Control type="time" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>Temp F</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Temp F" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>Pulse opm</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Pulse opm" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>RR Breaths/ min</Form.Label>
                                    <Form.Control type="text" placeholder="Enter RR Breaths/ min" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>SYS/DIA mm/hg</Form.Label>
                                    <Form.Control type="text" placeholder="Enter SYS/DIA mm/hg" />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>Weight kg</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Weight kg" />
                                </Form.Group>
                            </Col>
                            <div className='d-flex justify-content-between mt-3'>
                                <div>
                                    <p>Recorded by <span className='text-black'>Dr. Vasanth</span></p>
                                </div>
                                <div>
                                    <Button variant="primary" className='custom-button' >
                                        <IoPrintSharp className="fs-4" />
                                        &nbsp;Print
                                    </Button>
                                </div>
                            </div>


                        </Row>

                    </Form>
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default NewClinicalNotes