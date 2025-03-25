import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';
import profileDummy from '../assets/images/profileDummy.png';

import { getMenuItems } from '../helpers/menu';
import { MdAdd } from 'react-icons/md';

// components
import AppMenu from './Menu';

// images
import logoSm from '../assets/images/logo_sm.png';
import logoDark from '../assets/images/logo-dark.png';
import logoDarkSm from '../assets/images/logo_sm_dark.png';
import logo from '../assets/images/logo.png';
import helpBoxImage from '../assets/images/help-icon.svg';
import profileImg from '../assets/images/users/avatar-1.jpg';
import { useDispatch, useSelector } from 'react-redux';
import {
    createAppointmentsAction,
    getAllAppointmentsAction,
    getPatientsAction,
    resetUpdateAction,
} from '../redux/actions';
import { encryptMessage } from '../cryptoUtils';
import { FormInput } from '../components';
import Spinner from '../constants/Spinner';
import { Button } from 'react-bootstrap';

type SideBarContentProps = {
    hideUserProfile: boolean,
};

/* sidebar content */
const SideBarContent = ({ hideUserProfile }: SideBarContentProps) => {
    return (
        <>
            {!hideUserProfile && (
                <div className="leftbar-user">
                    <Link to="/">
                        <img src={profileImg} alt="" height="42" className="rounded-circle shadow-sm" />
                        <span className="leftbar-user-name">Dominic Keller</span>
                    </Link>
                </div>
            )}
            <AppMenu menuItems={getMenuItems()} />

            <div className="clearfix" />
        </>
    );
};

type LeftSidebarProps = {
    hideLogo: boolean,
    hideUserProfile: boolean,
    isLight: boolean,
    isCondensed: boolean,
};

const LeftSidebar = ({ isCondensed, isLight, hideLogo, hideUserProfile }: LeftSidebarProps): React$Element<any> => {
    const menuNodeRef: any = useRef(null);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const doctorId = JSON.parse(sessionStorage.getItem('hyper_user'))?.doctorId;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const patientsAppointment = store?.getAllAppointmentsReducer?.data?.appointments || [];
    const updateSuccess = store?.updatePatientsReducer?.data?.status;
    const createSuccess = store?.createAppointmentsReducer?.data?.message;

    // console.log(patientsAppointment, 'patientsAppointment')
    const [activeTab, setActiveTab] = useState('Today'); // Default to "Today"
    // const updateAppointment = store?.createAppointmentsReducer?.data?.status;

    useEffect(() => {
        const data = {
            doctorId: doctorId,
            clinicId: clinicId,
            status: activeTab,
        };
        dispatch(getAllAppointmentsAction(data));
    }, [dispatch, activeTab, updateSuccess, createSuccess]);

    //    useEffect(() => {
    //     const data = {
    //         doctorId: doctorId,
    //         clinicId: clinicId,
    //         status: activeTab
    //     }
    //         if (updateAppointment === 200) {
    //             dispatch(getAllAppointmentsAction({ key: encryptMessage(data) }));
    //             dispatch(resetUpdateAction())
    //         }
    //     }, [updateAppointment]);

    const handleOtherClick = (e: any) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    return (
        <>
            <div className="leftside-menu" ref={menuNodeRef} style={{ backgroundColor: '#313A46' }}>
                {!hideLogo && (
                    <>
                        <Link to="/" className="logo text-center logo-light">
                            <span className="logo-lg">
                                <img src={logo} alt="logo" height="16" />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? logoSm : logo} alt="logo" height="12" />
                            </span>
                        </Link>

                        <Link to="/" className="logo text-center logo-dark">
                            <span className="logo-lg">
                                <img src={logo} alt="logo" height="16" />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? logoSm : logoDarkSm} alt="logo" height="16" />
                            </span>
                        </Link>
                    </>
                )}
                <>
                    {!isCondensed ? (
                        <ul style={{ listStyle: 'none' }} className="px-0 mt-1">
                            <li className="px-1 mb-1">
                                <FormInput
                                    type="text"
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    style={{ backgroundColor: 'white!important' }}
                                />
                            </li>
                            <li className={`px-1 mb-1`}>
                                <Link to="/apps/patients/add-new-patient">
                                    <Button
                                        className="border-0 w-100 d-flex align-items-center justify-content-center text-black"
                                        style={{
                                            height: '30px',
                                            backgroundColor: '#ffffff',
                                            boxShadow: 'none',
                                        }}>
                                        <MdAdd /> &nbsp; New Patient
                                    </Button>
                                </Link>
                            </li>
                            <li className="px-1 my-1 ">
                                <div
                                    className="btn-group d-flex justify-content-center align-items-center custom-btn-group"
                                    style={{ height: '30px' }}>
                                    <button
                                        className={`btn  ${
                                            activeTab === 'Today'
                                                ? 'active btn-light text-black'
                                                : 'btn-transparent text-white'
                                        }`}
                                        onClick={() => setActiveTab('Today')}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}>
                                        Today's
                                    </button>
                                    <button
                                        className={`btn ${
                                            activeTab === 'Upcoming'
                                                ? 'active text-black btn-light'
                                                : 'btn-transparent text-white'
                                        }`}
                                        onClick={() => setActiveTab('Upcoming')}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}>
                                        Upcoming
                                    </button>
                                    <button
                                        className={`btn ${
                                            activeTab === 'History'
                                                ? 'active text-black btn-light'
                                                : 'btn-transparent text-white'
                                        }`}
                                        onClick={() => setActiveTab('History')}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}>
                                        History
                                    </button>
                                </div>
                            </li>

                            {activeTab === 'Today' && (
                                <li className="px-1 mb-1 mt-2 text-white">Today's Appointments</li>
                            )}
                            {activeTab === 'Upcoming' && (
                                <li className="px-1 mb-1 mt-2 text-white">Upcoming Appointments</li>
                            )}
                            {activeTab === 'History' && (
                                <li className="px-1 mb-1 mt-2 text-white">Appointment History</li>
                            )}

                            {store?.getAllAppointmentsReducer?.loading ? (
                                <div className="text-center mt-3 ">
                                    <Spinner color="white" />
                                </div>
                            ) : patientsAppointment?.length === 0 ? (
                                <>
                                    <div className="text-center">
                                        <p className="mt-3 fs-6 text-primary">No scheduled appointments.</p>
                                    </div>
                                </>
                            ) : (
                                patientsAppointment?.map((data, index) => (
                                    <li
                                        key={index}
                                        className={`py-1 cursor-pointer patient-item px-1 d-flex justify-content-between`}
                                        style={{ borderBottom: '1px solid rgb(127 123 123 / 67%)' }}
                                        onClick={() => navigate(`/apps/patients/new-patient?id=${data?.patient?._id}`)}>
                                        <div className="d-flex gap-2 align-items-center">
                                            <img
                                                height="40"
                                                width="40"
                                                src={data?.patient?.patientChartPhoto?.url || profileDummy}
                                                className="rounded-circle border border-black"
                                                alt="profile image"
                                            />
                                            <div>
                                                <p className="mb-0 text-capitalize" style={{ fontSize: '12px' }}>
                                                    {data?.patient?.firstName}
                                                </p>
                                                <p className="mb-0 " style={{ fontSize: '10px' }}>
                                                    {data?.reason}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <p className="mb-0" style={{ fontSize: '10px' }}>
                                                    <span>
                                                        {new Date(data?.date).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                        })}
                                                    </span>
                                                    &nbsp;&nbsp;
                                                    <span>
                                                        {new Date(`1970-01-01T${data?.startTime}`).toLocaleTimeString(
                                                            'en-US',
                                                            { hour: 'numeric', minute: '2-digit', hour12: true }
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mb-0 text-end pt-1" style={{ fontSize: '10px' }}>
                                                    {data?.profile}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    ) : (
                        <ul style={{ listStyle: 'none' }} className="px-0 mt-1">
                            {store?.getAllAppointmentsReducer?.loading ? (
                                <div className="text-center mt-3 ">
                                    <Spinner color="white" />
                                </div>
                            ) : (
                                patientsAppointment?.map((data, index) => (
                                    <li
                                        key={index}
                                        className={`py-1 cursor-pointer patient-item px-1 d-flex justify-content-center align-items-center`}
                                        style={{ borderBottom: '1px solid rgb(127 123 123 / 67%)' }}
                                        onClick={() => navigate(`/apps/patients/new-patient?id=${data?.patient?._id}`)}>
                                        <div className="">
                                            <img
                                                height="40"
                                                width="40"
                                                src={data?.patient?.patientChartPhoto?.url || profileDummy}
                                                className="rounded-circle border border-black"
                                                alt="profile image"
                                            />
                                            <div>
                                                <p className="mb-0 text-capitalize mt-1" style={{ fontSize: '12px' }}>
                                                    {data?.patient?.firstName}
                                                </p>
                                            </div>
                                        </div>
                                        <div></div>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </>
            </div>
        </>
    );
};

LeftSidebar.defaultProps = {
    hideLogo: false,
    hideUserProfile: false,
    isLight: false,
    isCondensed: false,
};

export default LeftSidebar;
