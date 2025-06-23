import Spinner from 'constants/Spinner'
import { encryptMessage } from 'cryptoUtils'
import DeletionModal from 'helpers/DeletionModal'
import { formatDateToISO } from 'helpers/helperFunctions'
import { loggedInUser } from 'helpers/loggedInUser'
import Paginations from 'helpers/Paginations'
import useQuillWordLimit from 'helpers/quillWordLimit'
import ToastHandle from 'helpers/ToastMessage'
import React, { useEffect, useRef, useState } from 'react'
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { createTobaccoAction, deleteTobaccoAction, getTobaccoAction, updateTobaccoAction } from 'redux/tobacco/actions'
import { tobaccoUse } from 'utils/DataSets/SocialHistory/TobaccoData'

const TobaccoHistory = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id')
    const { register, reset, handleSubmit, control, watch, setValue } = useForm();
    const quillRef = useRef();
    const MAX_WORDS = 1000;
    const MAX_WORD_LENGTH = 45;
    const createTobaccoHistoryStatus = store?.createTobaccoReducer?.data?.status;
    const updateTobaccoHistoryStatus = store?.updateTobaccoReducer?.data?.status;
    const deleteTobaccoHistoryStatus = store?.deleteTobaccoReducer?.data?.status;
    const tobaccoHistory = store?.getTobaccoReducer?.data?.data?.tobaccoHistory;
    console.log(store?.getTobaccoReducer?.data, 'store?.getTobaccoReducer?.data')

    const [toEdit, setToEdit] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [skip, setSkip] = useState(1);

    useEffect(() => {
        dispatch(getTobaccoAction({ patientId: patientId }));
    }, [dispatch])

    useEffect(() => {
        if (createTobaccoHistoryStatus === 201 || updateTobaccoHistoryStatus === 200 || deleteTobaccoHistoryStatus === 200) {
            dispatch(getTobaccoAction({ patientId: patientId }))
            handleReset();
        }
    }, [createTobaccoHistoryStatus, updateTobaccoHistoryStatus, deleteTobaccoHistoryStatus])

    useEffect(() => {
        if (toEdit) {
            setValue('tobaccoUse', toEdit?.tobaccoUse);
            setValue(
                'effectiveDateTime',
                toEdit?.effectiveDateTime ? formatDateToISO(toEdit?.effectiveDateTime) : ''
            );
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>'); // fallback to default if empty
        } else {
            reset();
        }
    }, [toEdit]);

    const submitTobaccoHistory = (data) => {
        data.subject = patientId;
        data.note = [
            {
                text: data.note,
                time: new Date().toISOString(),
            },
        ];
        // data.clinicId = loggedInUser?.clinicId;
        console.log(data)
        if (toEdit) {
            data.id = toEdit?._id;
            dispatch(updateTobaccoAction({ key: encryptMessage(data) }))
        } else {
            dispatch(createTobaccoAction({ key: encryptMessage(data) }));
        }
    }

    const handleLimitExceed = ({ type, message }) => {
        ToastHandle(message, 'danger');
    };

    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: MAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });

    const handleReset = () => {
        reset();
        setToEdit(null);
        setToDelete(null);
        setDeleteModal(false);
        // setShowSuggestions(false);
    };
    console.log(toDelete, 'toDelete')
    const handleDeleteHistory = () => {
        dispatch(deleteTobaccoAction({ id: toDelete }))
    }

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
        dispatch(getTobaccoAction({ patientId: patientId, skip: pageNumber }))
    }
    return (
        <Row className=" py-0 m-auto">
            {/* Left: Form Section */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2 scroll-container">
                <Form onSubmit={handleSubmit(submitTobaccoHistory)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Current Tobacco Use</Form.Label>
                                <Form.Select {...register('tobaccoUse')}>
                                    <option value='' key=''>Select an option</option>
                                    {tobaccoUse?.map((data, index) => (
                                        <option value={data}>{data}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group >
                                <Form.Label>Effective Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('effectiveDateTime')}
                                    required
                                    className="form-control-sm"
                                    max={new Date().toISOString().slice(0, 10)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className='mt-1'>
                            <Form.Group controlId="notes">
                                <Form.Label className="fw-medium mb-1 d-flex justify-content-between align-items-center">
                                    <div>
                                        Notes{' '}
                                        <span style={{ cursor: 'pointer' }} title="Notes Suggestions">✨</span>
                                    </div>
                                    <small className="text-muted">
                                        {(() => {
                                            const content = watch('note') || '';
                                            const plainText = quillRef?.current?.getEditor()?.getText()?.trim();
                                            const words = plainText?.split(/\s+/)?.filter(Boolean);
                                            const wordCount = words?.length;
                                            return <>{`${wordCount || 0} / ${MAX_WORDS} words`}</>;
                                        })()}
                                    </small>
                                </Form.Label>
                                <div className='scroll-container' style={{ height: '45vh' }}>
                                    <Controller
                                        name="note"
                                        control={control}
                                        defaultValue="<ul><li></li></ul>"
                                        render={({ field: { onChange, value } }) => (
                                            <ReactQuill
                                                ref={quillRef}
                                                value={value}
                                                onChange={(content, delta, source) => {
                                                    if (source === 'user') onChange(content);
                                                }}
                                                theme="snow"
                                                placeholder="Enter detailed notes here..."
                                                style={{ height: '100%' }}
                                                modules={{
                                                    toolbar: [
                                                        [{ header: [1, 2, false] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                                        ['clean'],
                                                    ],
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col sm={12} className='d-flex justify-content-end my-1'>
                            <Button disabled={store?.createTobaccoReducer?.loading} type='submit' className='custom-buttons'>
                                {store?.createTobaccoReducer?.loading ?
                                    <Spinner className='spinner-border-sm' color='white' />
                                    :
                                    toEdit ? `Update` : `Save`
                                }
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>

            {/* Right: History Section */}
            <Col md={6} className="d-flex flex-column  px-0 scro" >
                <Row>
                    <Col sm={12} className='scroll-container' style={{ height: '56vh' }}>
                        {store?.getTobaccoReducer?.loading ?
                            <Card.Body className="d-flex align-items-center h-100  justify-content-center">
                                <Spinner />
                            </Card.Body>
                            :
                            <Card.Body className="ps-2 h-100 py-1 p-0 ">
                                {store?.getTobaccoReducer?.loading && !tobaccoHistory?.length ? (
                                    <div className="text-center py-4">
                                        <Spinner />
                                    </div>
                                ) : tobaccoHistory?.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        <i className="bi bi-journal-x fs-1"></i>
                                        <p className="mt-2 mb-0">No tobacco use records found</p>
                                    </div>
                                ) : (
                                    <Accordion alwaysOpen flush>
                                        {tobaccoHistory?.map((item, index) => (
                                            <Accordion.Item eventKey={index.toString()} key={index} className="rounded-1">
                                                <Accordion.Header>
                                                    <div
                                                        className="d-flex justify-content-between align-items-center w-100"
                                                        style={{ marginRight: '-19px' }}>
                                                        <div className="d-flex align-items-center gap-2 p-2 pe-0">
                                                            <span className="text-black fs-6 tab-font-family fw-semibold">
                                                                {index + 1}.
                                                            </span>
                                                            <span className="fw-normal fs-6 tab-font-family text-black">
                                                                {item.tobaccoUse || 'No description'}
                                                            </span>
                                                            <small className="text-black" style={{ fontSize: '12px' }}>
                                                                (
                                                                {item?.note?.[0]?.time
                                                                    ? new Date(item.note[0].time).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                    })
                                                                    : 'No date'}
                                                                -
                                                                {item?.note?.[0]?.time
                                                                    ? new Date(item.note[0].time).toLocaleTimeString()
                                                                    : 'No time'}
                                                                )
                                                            </small>
                                                        </div>
                                                        {/* Action Icons */}
                                                        <div
                                                            className="d-flex gap-2 px-2"
                                                            onClick={(e) => {
                                                                // Prevent accordion from toggling
                                                                e.stopPropagation();
                                                            }}>
                                                            {toEdit && toEdit._id === item._id ? (
                                                                <i
                                                                    className="bi bi-x-lg text-danger cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleReset();
                                                                    }}
                                                                    title="Cancel"
                                                                />
                                                            ) : (
                                                                <i
                                                                    className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setToEdit(item);
                                                                    }}
                                                                    title="Edit"
                                                                />
                                                            )}
                                                            <i
                                                                className="bi bi-trash-fill text-danger cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setToDelete(item?._id);
                                                                    setDeleteModal(true);
                                                                }}
                                                                title="Delete"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DeletionModal show={deleteModal} onHide={handleReset} onConfirm={handleDeleteHistory} item='tobacco history' isLoading={store?.deleteTobaccoReducer?.loading} />

                                                </Accordion.Header>

                                                <Accordion.Body className="pt-0 p-0 ">
                                                    {item?.note?.[0]?.text ? (
                                                        <div
                                                            className="ql-editor p-1 rounded scroll-container notes-scroll"
                                                            dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                            style={{ fontSize: '0.875rem', overflowY: 'scroll', height: '150px' }}
                                                        />
                                                    ) : (
                                                        <div className="text-muted fst-italic p-2">No notes available</div>
                                                    )}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}

                                        {/* <DeletionModal
                                show={deleteModal}
                                onHide={closeDeleteModal}
                                onConfirm={deleteHistory}
                                item="tobacco history"
                                isLoading={store?.deleteTobaccooReducer?.loading}
                            /> */}
                                    </Accordion>
                                )}
                            </Card.Body>
                        }
                    </Col>
                    <Col sm={12}>
                        <Paginations
                            totalPages={store?.getTobaccoReducer?.data?.data?.totalPages}
                            currentPage={skip}
                            onPageChange={handlePageChange} />
                    </Col>
                </Row>
            </Col>
        </Row >
    )
}

export default TobaccoHistory