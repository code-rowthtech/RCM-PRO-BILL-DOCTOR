// React and third-party imports
import { useEffect } from 'react';
import { Button, Offcanvas, Form, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { createEncounterSettingsAction, getEncounterSettingsAction, updateEncounterSettingsAction } from 'redux/actions';

// Utility imports
import { encryptMessage } from 'cryptoUtils';
import { loggedInUser } from 'helpers/loggedInUser';

// Constants and Configuration

// Validation schema using Yup
const settingsSchema = yup.object().shape({
    items: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Name is required'),
            order: yup.number().required('Order is required').positive().integer(),
            show: yup.boolean().required(),
            subMenu: yup.array().of(
                yup.object().shape({
                    name: yup.string().required('Submenu name is required'),
                    order: yup.number().required('Order is required').positive().integer(),
                    hide: yup.boolean().required(),
                })
            )
        })
    )
});

// Default menu structure
const predefinedMenuItems = [
    {
        name: 'Summary',
        show: true,
        subMenu: ['Vitals', 'Allergy', 'Problems', 'Medications', 'Social History'].map(name => ({
            name,
            hide: false
        }))
    },
    {
        name: 'Templates',
        show: true,
        subMenu: []
    },
    {
        name: 'Past Encounters',
        show: true,
        subMenu: []
    }
];

const EncounterSettingsForm = ({ showSettings, closeSettings, initialData }) => {
    // Hooks initialization
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    // Form management with validation
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
        watch,
        setValue,
        getValues
    } = useForm({
        resolver: yupResolver(settingsSchema),
        defaultValues: {
            items: getDefaultItems()
        }
    });

    // Redux state selectors
    const createResponse = store?.createEncounterSettingsReducer?.data?.status;
    const updateResponse = store?.updateEncounterSettingsReducer?.data?.status;
    const settingsData = store?.getEncounterSettingsReducer?.data?.data;
    const items = watch('items');

    // Helper functions

    /**
     * Get default menu items with proper ordering
     */
    function getDefaultItems() {
        return initialData?.items?.map(convertToFormFormat) ||
            predefinedMenuItems.map((item, index) => ({
                ...item,
                order: index + 1,
                subMenu: item.subMenu.map((sub, subIndex) => ({
                    ...sub,
                    order: subIndex + 1
                }))
            }));
    }

    /**
     * Convert API data format to form format (0-based to 1-based indexing)
     */
    function convertToFormFormat(item) {
        return {
            ...item,
            order: item.order + 1,
            subMenu: item.subMenu?.map(sub => ({
                ...sub,
                order: sub.order + 1
            })) || []
        };
    }

    /**
     * Convert form data format to API format (1-based to 0-based indexing)
     */
    function convertToApiFormat(items) {
        return items.map(item => ({
            ...item,
            order: item.order - 1,
            subMenu: item.subMenu?.map(sub => ({
                ...sub,
                order: sub.order - 1
            })) || []
        }));
    }

    // Effect hooks

    // Handle successful create/update responses
    useEffect(() => {
        if (createResponse === 201 || updateResponse === 200) {
            dispatch(getEncounterSettingsAction({ doctorId: store?.Auth?.user?.doctorId }));
            closeSettings();
        }
    }, [createResponse, updateResponse, dispatch, closeSettings, store?.Auth?.user?.doctorId]);

    // Reset form when initial data changes
    useEffect(() => {
        if (initialData) {
            reset({
                items: initialData.items.map(convertToFormFormat)
            });
        }
    }, [initialData, reset]);

    // Reset form when settings data is loaded
    useEffect(() => {
        if (settingsData?._id) {
            reset({
                items: settingsData.items.map(convertToFormFormat)
            });
        }
    }, [settingsData, reset]);

    // Event handlers

    /**
     * Form submission handler
     * Converts data format and dispatches appropriate action
     */
    const onSubmit = (data) => {
        const submissionData = {
            items: convertToApiFormat(data.items),
            doctorId: store?.Auth?.user?.doctorId || loggedInUser?._id,
        };

        if (settingsData?._id) {
            submissionData._id = settingsData._id;
            dispatch(updateEncounterSettingsAction({ key: encryptMessage(submissionData) }));
        } else {
            dispatch(createEncounterSettingsAction({ key: encryptMessage(submissionData) }));
        }
    };

    /**
     * Handle main menu drag and drop reordering
     */
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = [...getValues('items')];
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        // Update orders based on new positions
        const updatedItems = newItems.map((item, index) => ({
            ...item,
            order: index + 1
        }));

        setValue('items', updatedItems);
    };

    /**
     * Handle submenu drag and drop reordering
     */
    const onSubMenuDragEnd = (itemIndex, result) => {
        if (!result.destination) return;
        const newItems = [...getValues('items')];
        const subMenu = [...newItems[itemIndex].subMenu];
        const [reorderedSubItem] = subMenu.splice(result.source.index, 1);
        subMenu.splice(result.destination.index, 0, reorderedSubItem);
        // Update submenu orders based on new positions
        newItems[itemIndex].subMenu = subMenu.map((sub, index) => ({
            ...sub,
            order: index + 1
        }));
        setValue('items', newItems);
    };

    return (
        <Offcanvas show={showSettings} placement='end' className='w-100' onHide={closeSettings}>
            {/* Header Section */}
            <Offcanvas.Header closeButton className='border-bottom'>
                <Offcanvas.Title className='fw-bold'>Encounter Menu Settings</Offcanvas.Title>
            </Offcanvas.Header>
            {/* Body Section */}
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit(onSubmit)} className="h-100 d-flex flex-column">
                    {/* Main Content Area */}
                    <div className="flex-grow-1 overflow-auto">
                        {items?.length > 0 && (
                            <Card>
                                <Card.Body className='p-0 px-1 '>
                                    {/* Instructions */}
                                    <h5 className="mt-0 mb-1 fw-semibold">Menu Items Configuration</h5>
                                    <p className="text-muted fs-6 mt-0 mb-2">
                                        Drag and drop items to reorder them. The order number will update automatically.
                                        Toggle the switch to include/exclude items from the menu.
                                    </p>
                                    {/* Drag and Drop Menu Items */}
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="menuItems">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {items?.map((item, itemIndex) => (
                                                        <Draggable
                                                            key={itemIndex}
                                                            draggableId={`item-${itemIndex}`}
                                                            index={itemIndex}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className="mb-2"
                                                                >
                                                                    {/* Menu Item Card */}
                                                                    <Card className="border">
                                                                        <Card.Body className="p-2">
                                                                            <div className="d-flex align-items-center justify-content-between">
                                                                                {/* Drag Handle and Item Info */}
                                                                                <div className="d-flex align-items-center">
                                                                                    <div
                                                                                        {...provided.dragHandleProps}
                                                                                        className="me-2 cursor-grab"
                                                                                    >
                                                                                        <GripVertical size={16} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <strong>{item.name}</strong>
                                                                                        <small className="text-muted ms-2">
                                                                                            Order: {item.order}
                                                                                        </small>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Show/Hide Toggle */}
                                                                                <Form.Check
                                                                                    type="switch"
                                                                                    id={`show-${itemIndex}`}
                                                                                    label="Show"
                                                                                    {...register(`items.${itemIndex}.show`)}
                                                                                />
                                                                            </div>

                                                                            {/* Submenu Section */}
                                                                            {item.subMenu?.length > 0 && (
                                                                                <div className="mt-2 ps-3">
                                                                                    <small className="text-muted">Submenu Items:</small>
                                                                                    <DragDropContext
                                                                                        onDragEnd={(result) => onSubMenuDragEnd(itemIndex, result)}
                                                                                    >
                                                                                        <Droppable droppableId={`submenu-${itemIndex}`}>
                                                                                            {(provided) => (
                                                                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                                                    {item.subMenu.map((subItem, subIndex) => (
                                                                                                        <Draggable
                                                                                                            key={subIndex}
                                                                                                            draggableId={`sub-${itemIndex}-${subIndex}`}
                                                                                                            index={subIndex}
                                                                                                        >
                                                                                                            {(provided) => (
                                                                                                                <div
                                                                                                                    ref={provided.innerRef}
                                                                                                                    {...provided.draggableProps}
                                                                                                                    className="d-flex align-items-center justify-content-between py-1 border-bottom"
                                                                                                                >
                                                                                                                    <div className="d-flex align-items-center">
                                                                                                                        <div
                                                                                                                            {...provided.dragHandleProps}
                                                                                                                            className="me-2"
                                                                                                                        >
                                                                                                                            <GripVertical size={12} />
                                                                                                                        </div>
                                                                                                                        <small>{subItem?.name || ''}</small>
                                                                                                                    </div>
                                                                                                                    <div className="d-flex align-items-center">
                                                                                                                        <Form.Check
                                                                                                                            type="switch"
                                                                                                                            id={`hide-${itemIndex}-${subIndex}`}
                                                                                                                            label="Hide"
                                                                                                                            size="sm"
                                                                                                                            {...register(`items.${itemIndex}.subMenu.${subIndex}.hide`)}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </Draggable>
                                                                                                    ))}
                                                                                                    {provided.placeholder}
                                                                                                </div>
                                                                                            )}
                                                                                        </Droppable>
                                                                                    </DragDropContext>
                                                                                </div>
                                                                            )}
                                                                        </Card.Body>
                                                                    </Card>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </Card.Body>
                            </Card>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="border-top pt-3 mt-3">
                        <div className="d-flex justify-content-end gap-2">
                            <Button className='custom-buttons' onClick={closeSettings}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className='custom-buttons'
                                disabled={store?.createEncounterSettingsReducer?.loading || store?.updateEncounterSettingsReducer?.loading}
                            >
                                {(store?.createEncounterSettingsReducer?.loading || store?.updateEncounterSettingsReducer?.loading)
                                    ? 'Saving...'
                                    : 'Save Settings'
                                }
                            </Button>
                        </div>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default EncounterSettingsForm;