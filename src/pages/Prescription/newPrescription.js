import React, { useState, useEffect, useRef } from 'react';
import { Button, Col, Dropdown, DropdownButton, Form, Modal, Row } from 'react-bootstrap';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { IoIosSearch } from 'react-icons/io';
import TabButtons from './tabButtons';
import { IoPrintSharp } from 'react-icons/io5';

const mockTemplate = [
    { id: '1', name: 'Template 1' },
    { id: '2', name: 'Template 2' },
    { id: '3', name: 'Template 3' },
];

const mockDrugs = [
    { id: '1', name: 'Dengue 1 Drugs' },
    { id: '2', name: 'Sick 1 Drugs' },
    { id: '3', name: 'Viral Fever 2 Drugs' },
];

const NewPrescription = () => {
    const [value, setValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [activeTab, setActiveTab] = useState('template');
    const dropdownRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const template = mockTemplate.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredHobbies = mockDrugs.filter(item =>
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
        activeTab === 'template'
            ? selectedTemplate.length
            : selectedDrugs.length;

    const options = [
        { value: 'template1', label: 'Template 1' },
        { value: 'template2', label: 'Template 2' },
        { value: 'template3', label: 'Template 3' },
    ];

    const handleSelect = (eventKey) => {
        setSelectedItem(eventKey);
        console.log(`Selected: ${eventKey}`);
    };

    return (
        <div>
            <Row>
                <Col>
                    <Row>
                        <Col sm={4}>
                            <div>
                                <p style={{ fontWeight: 700 }}>Prescription Template</p>
                            </div>
                        </Col>
                        <Col sm={8}>
                            <div className='d-flex gap-2 justify-content-end'>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        // id={`dropdown-basic-${index}`}
                                        className="px-3"
                                        style={{ border: '1px solid rgb(204, 204, 204)', background: 'none', color: 'black' }}
                                    >
                                        Medical History
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end" style={{ transform: 'translateX(-100%)' }}>
                                        <Dropdown.Item href="#/save-template">
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="me-2" // Adds spacing between checkbox and text
                                                />
                                                <span>Hypertension</span>
                                            </div>
                                        </Dropdown.Item>
                                        <hr className='m-0' />
                                        <Dropdown.Item href="#/save-template">
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="me-2" // Adds spacing between checkbox and text
                                                />
                                                <span>Diabetes</span>
                                            </div>
                                        </Dropdown.Item>
                                        <hr className='m-0' />
                                        <Dropdown.Item href="#/save-template">
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="me-2" // Adds spacing between checkbox and text
                                                />
                                                <span>Epilepsy</span>
                                            </div>
                                        </Dropdown.Item>
                                        <hr className='m-0' />
                                        <Dropdown.Item href="#/save-template">
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="me-2" // Adds spacing between checkbox and text
                                                />
                                                <span>Heart Disease</span>
                                            </div>
                                        </Dropdown.Item>
                                        <hr className='m-0' />
                                        <Dropdown.Item href="#/save-template">
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="me-2" // Adds spacing between checkbox and text
                                                />
                                                <span>Allergies</span>
                                            </div>
                                        </Dropdown.Item>
                                        <hr className='m-0' />

                                    </Dropdown.Menu>
                                </Dropdown>
                                <Button
                                    className="custom-buttons"
                                    onClick={() => setShow(true)}
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
                                    Save Prescription
                                </Button>
                            </div>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Row className='mt-2' style={{ borderBottom: '1px solid #B6B6B6' }}>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Template Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Template Name'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-1" controlId="templateSelect">
                        <Form.Label className="mb-0">Doctor</Form.Label>
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
                    <Form.Group className="mb-2" controlId="templateSelect">
                        <Form.Label className="mb-0">Date</Form.Label>
                        <Form.Control
                            type='date'
                        />
                    </Form.Group>
                </Col>
                <Col sm={3} className='position-relative'>
                    <Form.Group controlId="searchDropdown " ref={dropdownRef} className='position-relative'>
                        <Form.Label className="mb-0">
                            {activeTab === 'template' ? 'Template' : 'Drugs'} Search
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
                            <div className=" bg-white shadow-lg position-absolute w-100 rounded" style={{ zIndex: 11111 }} >
                                <div className="d-flex justify-content-center buttons-head  pt-1 pb-0">
                                    <TabButtons
                                        active={activeTab === 'template'}
                                        onClick={() => setActiveTab('template')}
                                    >
                                        Template
                                    </TabButtons>
                                    <TabButtons
                                        active={activeTab === 'drugs'}
                                        onClick={() => setActiveTab('drugs')}
                                    >
                                        Drug
                                    </TabButtons>
                                </div>
                                <div className="pb-2">
                                    {(activeTab === 'template' ? template : filteredHobbies).map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex gap-3 px-4 py-2 cursor-pointer"
                                                style={{ borderBottom: '1px solid rgb(204, 204, 204)' }}
                                                onClick={() =>
                                                    handleSelectionToggle(
                                                        item,
                                                        activeTab === 'template' ? selectedTemplate : selectedDrugs,
                                                        activeTab === 'template'
                                                            ? setSelectedTemplate
                                                            : setSelectedDrugs
                                                    )
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    className='cursor-pointer'
                                                    checked={
                                                        (activeTab === 'template'
                                                            ? selectedTemplate
                                                            : selectedDrugs
                                                        ).some(i => i.id === item.id)
                                                    }
                                                    readOnly
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                        )
                                    )}
                                    <div className="px-2 mt-2">
                                        {activeTab === 'template' && (
                                            <Button
                                                className="w-100 custom-buttons rounded-pill"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setIsDropdownOpen(false); // Close the dropdown
                                                }}
                                            >
                                                Add Template
                                            </Button>
                                        )}
                                        {activeTab === 'drugs' && (
                                            <Button
                                                className="w-100 custom-buttons rounded-pill"
                                            // onClick={() => {
                                            //     setShow(true);
                                            //     setIsDropdownOpen(false); 
                                            // }}
                                            >
                                                Add Drug
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Form.Group>
                </Col>

            </Row>
            <Row>
                <Col className='mt-2'>
                    <div>
                        <div className='d-flex justify-content-end'>
                            <p className='text-danger fw-bold'>Remove</p>
                        </div>
                    </div>
                    <Row>
                        <Col sm={3}>
                            <Form.Group className="mb-2" controlId="templateSelect">
                                <Form.Label className="mb-0">Drug Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Drug Name'
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <Form.Group className="mb-2" controlId="templateSelect">
                                <Form.Label className="mb-0"></Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='50'
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <Form.Group className="mb-2" controlId="templateSelect">
                                <Form.Label className="mb-0"></Form.Label>
                                <Form.Select>
                                    <option value="mg">mg</option>
                                    <option value="ml">ml</option>
                                    <option value="g">g</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={5}>
                            <div className="d-flex align-items-center mt-3 pt-1">
                                <p className="me-2 mb-0 fw-bold">Instruction:</p>

                                <Form.Check
                                    type="radio"
                                    name="foodInstruction"
                                    id="beforeFood"
                                    label="Before Food"
                                    className="me-3"
                                />

                                <Form.Check
                                    type="radio"
                                    name="foodInstruction"
                                    id="afterFood"
                                    label="After Food"
                                    className="me-3"
                                />
                            </div>
                        </Col>
                        <Col sm={2}>
                            <Form.Group className="mb-2" controlId="templateSelect">
                                <Form.Label className="mb-0">Duration</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='0'
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <Form.Group className="mb-2" controlId="templateSelect">
                                <Form.Label className="mb-0"></Form.Label>
                                <Form.Select>
                                    <option value="">Day(s)</option>
                                    <option value="1">1 Day</option>
                                    <option value="3">3 Days</option>
                                    <option value="7">7 Days</option>
                                    <option value="14">14 Days</option>
                                    <option value="30">30 Days</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={1}>
                            <Form.Group className="mb-2" controlId="morningCheckboxGroup">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="checkbox"
                                        id="morningCheckbox"
                                        className="me-2 ms-2"
                                    />
                                    <Form.Label htmlFor="morningCheckbox" className="mb-0">
                                        Morning
                                    </Form.Label>
                                </div>
                                <Form.Control
                                    type="number"
                                    placeholder="1"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={1}>
                            <Form.Group className="mb-2" controlId="morningCheckboxGroup">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="checkbox"
                                        id="morningCheckbox"
                                        className="me-2 ms-2"
                                    />
                                    <Form.Label htmlFor="morningCheckbox" className="mb-0">
                                        Afternoon
                                    </Form.Label>
                                </div>
                                <Form.Control
                                    type="number"
                                    placeholder="1"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={1}>
                            <Form.Group className="mb-2" controlId="morningCheckboxGroup">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="checkbox"
                                        id="morningCheckbox"
                                        className="me-2 ms-2"
                                    />
                                    <Form.Label htmlFor="morningCheckbox" className="mb-0">
                                        Night
                                    </Form.Label>
                                </div>
                                <Form.Control
                                    type="number"
                                    placeholder="1"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={5}>
                            <Form.Group className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Instructions"
                                    rows={2}
                                />
                            </Form.Group>
                        </Col>


                    </Row>

                    <Form.Group className="mb-2">
                        <Form.Control
                            as="textarea"
                            placeholder="Add Notes here"
                            rows={3}
                        />
                    </Form.Group>

                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title> Add Prescription Template</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row style={{ borderBottom: '1px solid #B6B6B6' }}>
                            <Col sm={11}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-0'>Template Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Template Name" />
                                </Form.Group>
                            </Col>
                            <Col sm={1} className='mt-2 d-flex justify-content-end'>
                                <div style={{ marginTop: '3px' }}>
                                    <Button className='mt-1'>Add</Button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='mt-2'>
                                <div>
                                    <div className='d-flex justify-content-end'>
                                        <p className='text-danger fw-bold m-0'>Remove</p>
                                    </div>
                                </div>
                                <Row>
                                    <Col sm={3}>
                                        <Form.Group className="mb-2" controlId="templateSelect">
                                            <Form.Label className="mb-0">Drug Name</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Drug Name'
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Group className="mb-2" controlId="templateSelect">
                                            <Form.Label className="mb-0"></Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='50'
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Group className="mb-2" controlId="templateSelect">
                                            <Form.Label className="mb-0"></Form.Label>
                                            <Form.Select>
                                                <option value="mg">mg</option>
                                                <option value="ml">ml</option>
                                                <option value="g">g</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={5}>
                                        <div className="d-flex align-items-center mt-3 pt-1">
                                            <p className="me-2 mb-0 fw-bold text-black">Instruction:</p>

                                            <Form.Check
                                                type="radio"
                                                name="foodInstruction"
                                                id="beforeFood"
                                                label="Before Food"
                                                className="me-3"
                                            />

                                            <Form.Check
                                                type="radio"
                                                name="foodInstruction"
                                                id="afterFood"
                                                label="After Food"
                                                className="me-3"
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Group className="mb-2" controlId="templateSelect">
                                            <Form.Label className="mb-0">Duration</Form.Label>
                                            <Form.Control
                                                type='number'
                                                placeholder='0'
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Group className="mb-2" controlId="templateSelect">
                                            <Form.Label className="mb-0"></Form.Label>
                                            <Form.Select>
                                                <option value="">Day(s)</option>
                                                <option value="1">1 Day</option>
                                                <option value="3">3 Days</option>
                                                <option value="7">7 Days</option>
                                                <option value="14">14 Days</option>
                                                <option value="30">30 Days</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Group className="mb-2" controlId="morningCheckboxGroup">
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="morningCheckbox"
                                                    className="me-1"
                                                />
                                                <Form.Label htmlFor="morningCheckbox" className="mb-0">
                                                    Morning
                                                </Form.Label>
                                            </div>
                                            <Form.Control
                                                type="number"
                                                placeholder="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Group className="mb-2" controlId="morningCheckboxGroup">
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="morningCheckbox"
                                                    className="me-1"
                                                />
                                                <Form.Label htmlFor="morningCheckbox" className="mb-0">
                                                    Afternoon
                                                </Form.Label>
                                            </div>
                                            <Form.Control
                                                type="number"
                                                placeholder="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Group className="mb-2" controlId="morningCheckboxGroup">
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="morningCheckbox"
                                                    className="me-1"
                                                />
                                                <Form.Label htmlFor="morningCheckbox" className="mb-0">
                                                    Night
                                                </Form.Label>
                                            </div>
                                            <Form.Control
                                                type="number"
                                                placeholder="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={5}>
                                        <Form.Group className="mb-2">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Instructions"
                                                rows={2}
                                            />
                                        </Form.Group>
                                    </Col>


                                </Row>

                                <Form.Group className="mb-2">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Add Notes here"
                                        rows={3}
                                    />
                                </Form.Group>

                            </Col>
                        </Row>
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

            <Modal show={show} onHide={() => setShow(false)} centered size='lg'>
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
                                    <DropdownButton
                                        title={
                                            <>
                                                <IoPrintSharp className="fs-4" />
                                                &nbsp;Print
                                            </>
                                        }
                                        className="text-nowrap custom-buttons"
                                        onSelect={handleSelect}
                                    >
                                        <Dropdown.Item eventKey="1">1</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">2</Dropdown.Item>
                                    </DropdownButton>
                                    {selectedItem && (
                                        <div className="mt-3">
                                            <strong>Selected Item: </strong> {selectedItem}
                                        </div>
                                    )}
                                </div>
                            </div>


                        </Row>

                    </Form>
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default NewPrescription