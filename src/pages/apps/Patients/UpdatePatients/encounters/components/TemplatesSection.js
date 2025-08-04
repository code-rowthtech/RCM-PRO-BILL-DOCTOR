// React and hooks
import React, { useEffect, useState } from 'react';

// Bootstrap components
import { Col, Row, Badge } from 'react-bootstrap';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { getTemplateAction } from 'redux/templates/action';

// Icons
import { FiFileText } from 'react-icons/fi';
import { IoSearchSharp } from 'react-icons/io5';

// Components
import Spinner from 'constants/Spinner';
import FormInput from '../../../../../../components/FormInput';
import TemplateModal from 'pages/apps/NotesAndTemplates/Modals/TemplateModal';

/**
 * TemplatesSection Component
 * Manages template selection and display for patient encounters
 * 
 * @param {Object} selectedFromList - Currently selected template items
 * @param {Function} setSelectedFromList - Function to update selected items
 */
const TemplatesSection = ({ selectedFromList = {}, setSelectedFromList = () => { } }) => {
    // ============================================================================
    // REDUX STATE
    // ============================================================================
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const templatesData = store?.getTemplateReducer?.data?.data;
    const isLoading = store?.getTemplateReducer?.loading;

    // ============================================================================
    // LOCAL STATE
    // ============================================================================
    const [searchTemplates, setSearchTemplates] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState(null);
    const [editIcon, setEditIcon] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // ============================================================================
    // HANDLERS
    // ============================================================================
    const closeModal = () => {
        setShowModal(false);
        setTemplateToEdit(null);
    };

    const handleTemplateItemClick = (item, itemList) => {
        if (!setSelectedFromList) return;

        const fieldName = item?.label;
        setSelectedFromList(prev => {
            const currentValue = prev[fieldName] || '';
            const newValue = currentValue
                ? `${currentValue}\n${itemList?.text}`
                : itemList?.text;
            return {
                ...prev,
                [fieldName]: newValue
            };
        });
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value;
        setSearchTemplates(searchValue);
        dispatch(getTemplateAction({
            search: searchValue,
            skip: 1,
            limit: 10,
            status: 'active'
        }));
    };

    const handleEditTemplate = (e, template) => {
        e.stopPropagation();
        setTemplateToEdit(template);
        setShowModal(true);
    };

    // ============================================================================
    // EFFECTS
    // ============================================================================
    useEffect(() => {
        if (!templatesData?.length) {
            dispatch(getTemplateAction({
                search: '',
                skip: 1,
                limit: 10,
                status: 'active'
            }));
        }
    }, [dispatch, templatesData?.length]);

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================
    const renderTemplateHeader = () => (
        <Row className="align-items-center position-relative">
            <Col className="text-center">
                <h5 className="my-0 fw-bold">{selectedTemplate?.title}</h5>
            </Col>
            <Col className="position-absolute end-0 text-end"
                style={{ top: '50%', transform: 'translateY(-50%)' }}>
                <i
                    onClick={() => setSelectedTemplate(null)}
                    title="Back"
                    className="bi text-black fw-bold px-1 cursor-pointer bi-arrow-bar-left"
                    style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                />
            </Col>
        </Row>
    );

    const renderTemplateItem = (item, index) => {
        const fieldName = item?.label;

        return (
            <Col sm={12} key={index} className='p-2'>
                <Row>
                    {/* Section Header */}
                    <Col sm={12} className='d-flex align-items-center justify-content-between'>
                        <h5 className="my-0 fw-semibold fs-6">{item?.label}</h5>
                        <span>
                            {/* <i className="bi me-1 bi-plus-circle cursor-pointer" title="Add new item" />
                            <i className="mdi mdi-square-edit-outline cursor-pointer" title="Edit section" /> */}
                        </span>
                    </Col>

                    {/* Section Items */}
                    <Col sm={12}>
                        <ul className='list-unstyled fs-6 px-2'>
                            {item?.list?.map((itemList, listIndex) => {
                                const alreadySelected = selectedFromList?.[fieldName]?.includes(itemList?.text);

                                return (
                                    <li
                                        key={listIndex}
                                        style={{
                                            backgroundColor: alreadySelected ? 'rgb(232 240 254 / 61%)' : ''
                                        }}
                                        onClick={() => handleTemplateItemClick(item, itemList)}
                                        className={`border-bottom py-1 cursor-pointer list-hover ${alreadySelected ? 'text-muted' : ''
                                            }`}
                                    >
                                        {itemList?.text}
                                        {alreadySelected && (
                                            <Badge bg="success" text="white" className="ms-1">
                                                Added
                                            </Badge>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </Col>
                </Row>
            </Col>
        );
    };

    const renderSearchBox = () => (
        <div className="input_search_box" style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            backgroundColor: '#e8f0fe',
            padding: '0px 5px',
        }}>
            <IoSearchSharp style={{
                fontSize: '1.2rem',
                color: 'black',
                marginRight: '10px',
            }} />
            <FormInput
                type="text"
                placeholder='Search templates'
                value={searchTemplates}
                onChange={handleSearchChange}
                className="input_search_box"
                style={{
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    backgroundColor: '#ccc',
                }}
            />
        </div>
    );

    const renderTemplateCard = (template, index) => (
        <div
            key={index}
            onClick={() => setSelectedTemplate(template)}
            className='border d-flex ps-1 pe-2 align-items-center justify-content-between'
        >
            <p
                title={template?.title}
                className='my-0 p-1 cursor-pointer fw-semibold fs-6 text-capitalize'
            >
                {template?.title?.length > 50
                    ? `${template?.title?.slice(0, 49)}...`
                    : template?.title
                }
            </p>
            {editIcon && (
                <i
                    onClick={(e) => handleEditTemplate(e, template)}
                    className="mdi mdi-square-edit-outline cursor-pointer"
                />
            )}
        </div>
    );

    const renderActionButtons = () => (
        <div className='d-flex justify-content-between p-2 align-items-center'>
            <span
                onClick={() => setShowModal(true)}
                className='fs-6 fw-semibold cursor-pointer'
            >
                <i className="bi bi-plus-circle" />&nbsp;Add template
            </span>

            {editIcon ? (
                <span
                    onClick={() => setEditIcon(false)}
                    className='fs-6 fw-semibold cursor-pointer'
                >
                    <i className="bi bi-check2 cursor-pointer" />&nbsp;Done editing
                </span>
            ) : (
                <span
                    onClick={() => setEditIcon(true)}
                    className='fs-6 fw-semibold cursor-pointer'
                >
                    <i className="mdi mdi-square-edit-outline cursor-pointer" />&nbsp;Edit template
                </span>
            )}
        </div>
    );

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    return (
        <Col sm={12} className='mt-1'>
            <Row className='position-relative'>
                {selectedTemplate ? (
                    // Template Detail View
                    <Col sm={12} className='mt-1'>
                        {renderTemplateHeader()}
                        <Row>
                            {selectedTemplate?.items?.map(renderTemplateItem)}
                        </Row>
                    </Col>
                ) : (
                    // Template List View
                    <Col sm={12} className='mt-1'>
                        {/* Search Section */}
                        {renderSearchBox()}

                        {/* Templates Content */}
                        {isLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Loading templates...</p>
                            </div>
                        ) : (
                            <div className="template-cards-container">
                                {templatesData?.length === 0 ? (
                                    <div className="no-templates-placeholder text-center py-4">
                                        <FiFileText size={48} className="text-muted mb-2" />
                                        <h5>No templates found</h5>
                                    </div>
                                ) : (
                                    <div className='template-grid d-flex flex-column py-1 gap-1 px-0'>
                                        {templatesData?.map(renderTemplateCard)}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        {renderActionButtons()}

                        {/* Template Modal */}
                        <TemplateModal
                            show={showModal}
                            onHide={closeModal}
                            setSelectedTemplate={setTemplateToEdit}
                            template={templateToEdit}
                        />
                    </Col>
                )}
            </Row>
        </Col>
    );
};

export default TemplatesSection;