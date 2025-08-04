import { useEffect, useState } from 'react'
import { Col, Row, Table, Image, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { FiFileText } from 'react-icons/fi'
import Paginations from 'helpers/Paginations'
import { getEncounterAction, getEncounterByIdAction } from 'redux/actions'
import Spinner from 'constants/Spinner'
import { formatDate } from 'helpers/dateFormat'
import { IoPrintSharp } from 'react-icons/io5'
const EncounterList = ({ encounterTabs, setEncounterTabs, setActiveTab, setCreateEncounter, setExpanded }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const [skip, setSkip] = useState(1);
    const id = searchParams.get('id')
    const store = useSelector((state) => state)
    const encounterData = store?.getEncounterReducer?.data?.encounters;

    useEffect(() => {
        dispatch(getEncounterAction({ patientId: id, skip }));
    }, [dispatch, id, skip]);


    const statusColorMap = {
        planned: 'text-secondary',
        arrived: 'text-primary',
        triaged: 'text-info',
        'in-progress': 'text-warning',
        onleave: 'text-muted',
        finished: 'text-success',
        cancelled: 'text-danger',
    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
        // dispatch(getEncounterAction({ patientId: id, skip: pageNumber }))
    };

    // const encounterData = store?.getEncounterByIdReducer?.data?.encounter;

    return (
        <Row className='my-1'>
            <Col sm={12}>
                <Table
                    responsive
                    className="table-centered table-nowrap mb-0  rounded">
                    <thead className="text-white">
                        <tr>
                            {['S.no', 'Encounter Type', 'Status', 'Start Date', 'End Date', 'Action']?.map((data, index) => (
                                <th key={index}>{data}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {store?.getEncounterReducer?.loading ?
                            <tr>
                                <td colSpan={6} className='text-center'>
                                    <div className="d-flex flex-column align-items-center py-5">
                                        <Spinner />
                                    </div>
                                </td>
                            </tr>
                            :
                            encounterData?.length === 0 ?
                                <tr>
                                    <td colSpan={6} className='text-center'>
                                        <div className="d-flex flex-column align-items-center py-5">
                                            <FiFileText size={48} className="text-muted mb-1" />
                                            <h5>No Encounters found</h5>
                                            <p className="text-muted">
                                                Create your first encounter to get started
                                            </p>
                                            <Button className='custom-buttons' onClick={() => {
                                                setCreateEncounter(true);
                                                setExpanded(true);
                                            }}>
                                                Create New Encounter
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                :
                                encounterData?.map((encounter, index) => (
                                    <tr key={encounter?._id}>
                                        <td>{index + 1}</td>
                                        <td>{encounter?.type?.[0]?.coding?.[0]?.display}</td>
                                        <td className='text-capitalize'>{encounter?.status}</td>
                                        <td>{encounter?.period?.start ? formatDate(encounter?.period?.start) : '-'}</td>
                                        <td>{encounter?.period?.end ? formatDate(encounter?.period?.end) : '-'}</td>
                                        <td>
                                            <IoPrintSharp className="fs-4 mb-1 me-1" />
                                            <i
                                                className=" mdi mdi-square-edit-outline fs-4 cursor-pointer"
                                                onClick={() => {
                                                    dispatch(getEncounterByIdAction({ encounterId: encounter?._id }));
                                                    const newTab = {
                                                        id: encounter?._id,
                                                        title: encounter?.period?.start ? new Date(encounter?.period?.start)?.toISOString().split('T')?.[0] : 'Edit Encounter',
                                                        type: 'updateEncounter',
                                                    };
                                                    const existingTab = encounterTabs.find((data) => data?.id === newTab?.id);
                                                    if (existingTab) {
                                                        setActiveTab(existingTab?.id);
                                                    } else {
                                                        setEncounterTabs([...encounterTabs, newTab]);
                                                        setActiveTab(newTab.id);
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </Table>
            </Col>
            <div className="col-12">
                <div className="mt-2 d-flex justify-content-end">
                    <Paginations
                        currentPage={skip}
                        totalPages={store?.getEncounterReducer?.data?.pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </Row>
    )
}

export default EncounterList;
