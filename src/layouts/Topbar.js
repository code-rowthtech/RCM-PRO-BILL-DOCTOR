// @flow
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// actions
import { showRightSidebar, changeSidebarType } from '../redux/actions';

// components
import ProfileDropdown from '../components/ProfileDropdown';

// images
import profilePic from '../assets/images/users/avatar-1.jpg';
import avatar1 from '../assets/images/users/avatar-2.jpg';
import avatar2 from '../assets/images/users/avatar-4.jpg';
import logoSmDark from '../assets/images/logo_sm_dark.png';
import logoSmLight from '../assets/images/logo_sm.png';
import logo from '../assets/images/logo-light.png';
import CloseIcon from "../assets/images/Iconclose.png"
//constants
import * as layoutConstants from '../constants/layout';
import MENU_ITEMS from '../constants/menu';

// get the notifications

// get the profilemenu
const ProfileMenus = [
    // {
    //     label: 'My Account',
    //     icon: 'mdi mdi-account-circle',
    //     redirectTo: '#',
    // },
    // {
    //     label: 'Settings',
    //     icon: 'mdi mdi-account-edit',
    //     redirectTo: '#',
    // },
    // {
    //     label: 'Support',
    //     icon: 'mdi mdi-lifebuoy',
    //     redirectTo: '#',
    // },
    {
        label: 'Lock Screen',
        icon: 'mdi mdi-lock-outline',
        redirectTo: '/account/lock-screen',
    },
    {
        label: 'Logout',
        icon: 'mdi mdi-logout',
        redirectTo: '/account/logout',
    },
];

type TopbarProps = {
    hideLogo?: boolean,
    navCssClasses?: string,
    openLeftMenuCallBack?: () => void,
    topbarDark?: boolean,
};

const Topbar = ({ hideLogo, navCssClasses, openLeftMenuCallBack, topbarDark }: TopbarProps): React$Element<any> => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // console.log(MENU_ITEMS, 'MENU_ITEMSMENU_ITEMS')
    const [isopen, setIsopen] = useState(false);
    const navbarCssClasses = navCssClasses || '';
    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));

    /**
     * Toggle the leftmenu when having mobile screen
     */
    const handleLeftMenuCallBack = () => {
        setIsopen((prevState) => !prevState);
        if (openLeftMenuCallBack) openLeftMenuCallBack();

        switch (layoutType) {
            case layoutConstants.LAYOUT_VERTICAL:
                // condition added
                if (window.innerWidth >= 768) {
                    if (leftSideBarType === 'fixed' || leftSideBarType === 'scrollable')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED));
                    if (leftSideBarType === 'condensed')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED));
                }
                break;

            case layoutConstants.LAYOUT_FULL:
                if (document.body) {
                    document.body.classList.toggle('hide-menu');
                }
                break;
            default:
                break;
        }
    };

    /**
     * Toggles the right sidebar
     */
    // const handleRightSideBar = () => {
    //     dispatch(showRightSidebar());
    // };

    const location = useLocation(); // Get the current location object
    const { pathname, search } = location;
    // Define a mapping of paths to titles
    const pathToTitleMap = {
        '/dashboard': 'Dashboard',
        '/dashboard/project': 'Dashboard', // Example of multiple paths mapping to the same title
        '/apps/appointments/list': 'Appointments',
        '/apps/appointments/newAppointment': 'New Appointment',
        '/apps/appointments/appointmentCalendar': 'Appointment Calendar',
        '/apps/patients/list': 'Patient',
        '/apps/patients/new-patient': 'New Patient',
        '/apps/transaction/transaction-list': 'Transaction',
        '/apps/diagnosis/list': 'Diagnosis',
        '/apps/diagnosis/newDiagnosisTest': 'New Patient Diagnosis Test',
        '/apps/profile/profile-details': 'Profile',
        '/apps/report/list': 'Reports',
        '/apps/setting/setting-page': 'Settings',
        '/apps/schedule/tabs': 'Schedule',
        '/apps/schedule/addHoliday': 'Add Holiday',
        '/apps/schedule/addBreak': 'Add Break',
        '/apps/prescription/index': 'Prescription',
        '/apps/prescription/newPrescription': 'New Prescription',


    };
    const getPageTitle = (pathToTitleMap, pathname, search) => {
        const queryParams = new URLSearchParams(search);

        if (pathname === '/apps/doctors/new-doctor' && queryParams.has('id')) {
            return 'Update Doctors';
        }

        for (const [key, value] of Object.entries(pathToTitleMap)) {
            if (pathname.startsWith(key)) {
                return value;
            }
        }

        return 'Page Not Found';
    };
    const pageTitle = getPageTitle(pathToTitleMap, pathname, search);

// console.log(location.pathname)
    return (
        <>
            <div className={classNames('navbar-custom ', navbarCssClasses)} style={{ backgroundColor: "#ffffff" }}>
                <div className={`${containerCssClasses} d-flex align-items-center`}>
                    {!hideLogo && (
                        <Link to="/" className="topnav-logo">
                            <span className="topnav-logo-lg">
                                <img src={logo} alt="logo" height="16" />
                            </span>
                            <span className="topnav-logo-sm">
                                {/* <img src={topbarDark ? logoSmLight : logoSmDark} alt="logo" height="16" /> */}
                            </span>
                        </Link>
                    )}



                    {/* toggle for vertical layout */}
                    {(layoutType === layoutConstants.LAYOUT_VERTICAL || layoutType === layoutConstants.LAYOUT_FULL) && (
                        <>
                        <div className='d-flex align-items-center col-auto'>
                            <button className="button-menu-mobile open-left ps-0" onClick={handleLeftMenuCallBack} style={{paddingTop:"3.2rem"}}>
                                {/* <i className="mdi mdi-menu" /> */}
                                <img src={CloseIcon} alt='' style={{width:"75%",height:"75%",objectFit:"contain"}}/>
                            </button>
                            {/* <h4 className=''>{pageTitle}</h4> */}
                        </div>
                        <div className='d-flex gap-3 align-items-center col-11' style={{marginLeft:"-32px"}}>
                            {MENU_ITEMS?.map((data,index) => (
                                <p key={index} onClick={() => navigate(data?.url)} className='fs-5 mb-0 fw-bold cursor-pointer' style={{color:location.pathname===data?.url?'black':'rgba(116, 114, 114, 0.51)'}}>{data?.label}</p>
                            ))}
                        </div>
                        </>
                    )}
                    <ul className="list-unstyled topbar-menu float-end mb-0">
                        <li className="dropdown notification-list">
                        </li>
                        <li className="dropdown notification-list">
                            <ProfileDropdown
                                profilePic={profilePic}
                                menuItems={ProfileMenus}
                                username={'Dominic Keller'}
                                userTitle={'Founder'}
                            />
                        </li>
                    </ul>

                    {/* toggle for horizontal layout */}
                    {layoutType === layoutConstants.LAYOUT_HORIZONTAL && (
                        <Link
                            to="#"
                            className={classNames('navbar-toggle', { open: isopen })}
                            onClick={handleLeftMenuCallBack}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    )}

                    {/* toggle for detached layout */}
                    {layoutType === layoutConstants.LAYOUT_DETACHED && (
                        <Link to="#" className="button-menu-mobile disable-btn" onClick={handleLeftMenuCallBack}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Topbar;
