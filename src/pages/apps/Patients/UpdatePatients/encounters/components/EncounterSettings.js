import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, Col, Form, Offcanvas, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback, useMemo } from 'react';
import { createEncounterSettingsAction, getEncounterSettingsAction, updateEncounterSettingsAction } from '../../../../../../redux/actions';
import { loggedInUser } from '../../../../../../helpers/loggedInUser';
import { encryptMessage } from '../../../../../../cryptoUtils';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { GripVertical } from 'lucide-react';

// Schema validation using Yup
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

const PREDEFINED_MENU_ITEMS = [
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

// Utility functions
const convertToOneBased = (items) =>
    items?.map(item => ({
        ...item,
        order: item.order + 1,
        subMenu: item.subMenu?.map(sub => ({
            ...sub,
            order: sub.order + 1
        })) || []
    }));

const convertToZeroBased = (items) =>
    items?.map(item => ({
        ...item,
        order: item.order - 1,
        subMenu: item.subMenu?.map(sub => ({
            ...sub,
            order: sub.order - 1
        })) || []
    }));

const getDefaultValues = (initialData) => ({
    items: initialData?.items
        ? convertToOneBased(initialData.items)
        : PREDEFINED_MENU_ITEMS.map((item, index) => ({
            ...item,
            order: index + 1,
            subMenu: item.subMenu.map((sub, subIndex) => ({
                ...sub,
                order: subIndex + 1
            }))
        }))
});

const EncounterSettings = ({ showSettings, closeSettings, initialData }) => {
    const defaultValues = useMemo(() => getDefaultValues(initialData), [initialData]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setValue,
        getValues
    } = useForm({
        resolver: yupResolver(settingsSchema),
        defaultValues
    });

    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    const createResponse = store?.createEncounterSettingsReducer?.data?.status;
    const updateResponse = store?.updateEncounterSettingsReducer?.data?.status;
    const settingsData = store?.getEncounterSettingsReducer?.data?.data;
    const items = watch('items');

    useEffect(() => {
        if (createResponse === 201 || updateResponse === 200) {
            dispatch(getEncounterSettingsAction({ doctorId: loggedInUser?.doctorId }));
            closeSettings();
        }
    }, [createResponse, updateResponse, dispatch, closeSettings]);

    useEffect(() => {
        if (initialData) {
            reset({ items: convertToOneBased(initialData.items) });
        }
    }, [initialData, reset]);

    // Reset form when settingsData changes
    useEffect(() => {
        if (settingsData?._id) {
            reset({ items: convertToOneBased(settingsData.items) });
        }
    }, [settingsData, reset]);

    const onSubmit = useCallback((data) => {
        const submissionData = {
            items: convertToZeroBased(data.items),
            doctorId: loggedInUser?.doctorId,
        };

        const action = settingsData?._id ? updateEncounterSettingsAction : createEncounterSettingsAction;

        if (settingsData?._id) {
            submissionData._id = settingsData._id;
        }

        dispatch(action({ key: encryptMessage(submissionData) }));
    }, [dispatch, settingsData?._id]);

    const updateItemOrder = useCallback((items) =>
        items.map((item, index) => ({ ...item, order: index + 1 })), []
    );

    const updateSubMenuOrder = useCallback((subMenu) =>
        subMenu.map((sub, index) => ({ ...sub, order: index + 1 })), []
    );

    const onDragEnd = useCallback((result) => {
        if (!result.destination) return;

        const newItems = [...getValues('items')];
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        setValue('items', updateItemOrder(newItems));
    }, [getValues, setValue, updateItemOrder]);

    const onSubMenuDragEnd = useCallback((itemIndex, result) => {
        if (!result.destination) return;

        const newItems = [...getValues('items')];
        const subMenu = [...newItems[itemIndex].subMenu];
        const [reorderedSubItem] = subMenu.splice(result.source.index, 1);
        subMenu.splice(result.destination.index, 0, reorderedSubItem);

        newItems[itemIndex].subMenu = updateSubMenuOrder(subMenu);
        setValue('items', newItems);
    }, [getValues, setValue, updateSubMenuOrder]);

    const toggleItemShow = useCallback((itemIndex, checked) => {
        const newItems = [...getValues('items')];
        newItems[itemIndex].show = checked;
        setValue('items', newItems);
    }, [getValues, setValue]);

    const renderSubMenuItem = useCallback((subItem, subIndex, itemIndex, provided) => (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="mb-0"
        >
            <Card className="bg-light mb-1">
                <Card.Body className='p-1 pe-2'>
                    <Row className="align-items-center">
                        <Col md={1} {...provided.dragHandleProps}>
                            <GripVertical size={16} />
                        </Col>
                        <Col md={5}>
                            <Form.Control
                                {...register(`items.${itemIndex}.subMenu.${subIndex}.name`)}
                                readOnly
                                isInvalid={!!errors.items?.[itemIndex]?.subMenu?.[subIndex]?.name}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Control
                                {...register(`items.${itemIndex}.subMenu.${subIndex}.order`)}
                                readOnly
                                isInvalid={!!errors.items?.[itemIndex]?.subMenu?.[subIndex]?.order}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Check
                                type="switch"
                                defaultChecked={settingsData?._id ? subItem?.hide : true}
                                id={`hide-${itemIndex}-${subIndex}`}
                                label={watch(`items.${itemIndex}.subMenu.${subIndex}.hide`) ? 'Hide' : 'Show'}
                                {...register(`items.${itemIndex}.subMenu.${subIndex}.hide`)}
                            />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    ), [register, errors, settingsData?._id, watch]);

    const renderMenuItem = useCallback((item, itemIndex, provided) => (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="mb-2"
        >
            <Card className='my-0 py-0'>
                <Card.Header className="d-flex p-1 px-2 justify-content-between align-items-center bg-light">
                    <div className="d-flex align-items-center">
                        <span {...provided.dragHandleProps} className="me-2">
                            <GripVertical size={18} />
                        </span>
                        <span className="fw-semibold">
                            <span className='text-primary'>{item.order}.&nbsp;</span>
                            {item.name}
                        </span>
                    </div>
                    <Form.Check
                        type="switch"
                        id={`show-${itemIndex}`}
                        label={item.show ? 'Hide' : 'Show'}
                        checked={item.show}
                        onChange={(e) => toggleItemShow(itemIndex, e.target.checked)}
                        className="ms-3"
                    />
                </Card.Header>
                {item.show && item.subMenu?.length > 0 && (
                    <Card.Body className='py-0'>
                        <div className="mt-0 pt-2">
                            <DragDropContext onDragEnd={(result) => onSubMenuDragEnd(itemIndex, result)}>
                                <Droppable droppableId={`submenu-${itemIndex}`}>
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {item.subMenu.map((subItem, subIndex) => (
                                                <Draggable
                                                    key={subIndex}
                                                    draggableId={`subitem-${itemIndex}-${subIndex}`}
                                                    index={subIndex}
                                                >
                                                    {(provided) => renderSubMenuItem(subItem, subIndex, itemIndex, provided)}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </Card.Body>
                )}
            </Card>
        </div>
    ), [toggleItemShow, onSubMenuDragEnd, renderSubMenuItem]);

    if (!items?.length) return null;

    return (
        <Offcanvas show={showSettings} placement='end' className='w-100' onHide={closeSettings}>
            <Offcanvas.Header closeButton className='border-bottom'>
                <Offcanvas.Title className='fw-bold'>Encounter Menu Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={handleSubmit(onSubmit)} className="h-100 d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto">
                        <Card>
                            <Card.Body className='p-0 px-1'>
                                <h5 className="mt-0 mb-1 fw-semibold">Menu Items Configuration</h5>
                                <p className="text-muted fs-6 mt-0 mb-2">
                                    Drag and drop items to reorder them. The order number will update automatically.
                                    Toggle the switch to include/exclude items from the menu.
                                </p>

                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="menuItems">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {items.map((item, itemIndex) => (
                                                    <Draggable
                                                        key={itemIndex}
                                                        draggableId={`item-${itemIndex}`}
                                                        index={itemIndex}
                                                    >
                                                        {(provided) => renderMenuItem(item, itemIndex, provided)}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="border-top pt-3">
                        <div className="d-flex justify-content-end gap-2">
                            <Button type="submit" className='custom-buttons'>
                                {settingsData?._id ? 'Update' : 'Save'} Settings
                            </Button>
                        </div>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default EncounterSettings;