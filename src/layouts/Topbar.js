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
import CloseIcon from '../assets/images/Iconclose.png';
//constants
import * as layoutConstants from '../constants/layout';
import MENU_ITEMS from '../constants/menu';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isopen, setIsopen] = useState(false);
    const navbarCssClasses = navCssClasses || '';
    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));
    const inProgressUrls = ['/apps/report/list', '/apps/prescription/index', '/apps/diagnosis/list'];

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
        '/apps/notes-and-templates/note-templates': 'Note Templates',
        '/apps/notes-and-templates/note-categories': 'Note Categories',
        '/apps/settings/department': 'Department',
        '/apps/settings/desigination': 'Desigination',
        '/apps/settings/consultationroom': 'Consultation Room',
        '/apps/settings/office': 'Office',
        '/apps/settings/role': 'Role',
        '/apps/settings/taskcategory': 'Task Category',
        '/apps/settings/purposeofvisit': 'Purpose Of Visit',
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
    const handleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    // Optional: Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    return (
        <>
            <div className={classNames('navbar-custom ', navbarCssClasses)} style={{ backgroundColor: '#ffffff' }}>
                <div className={`${containerCssClasses} nav-content-height d-flex align-items-center`}>
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
                            <div className="d-flex align-items-center col-auto">
                                <button
                                    className="button-menu-mobile open-left ps-0"
                                    onClick={handleLeftMenuCallBack}
                                    style={{ paddingTop: '' }}>
                                    <i className="mdi mdi-menu" />

                                    {/* <img src={CloseIcon} alt='' style={{width:"20px",height:"20px",objectFit:""}}/> */}
                                </button>
                                {/* <h4 className=''>{pageTitle}</h4> */}
                            </div>
                            <div className="d-flex gap-3 align-items-center col-11">
                                {MENU_ITEMS?.map((item, index) => {
                                    const isInProgress = inProgressUrls.includes(item?.url);
                                    const isActive = location.pathname === item?.url;

                                    const menuLabel = (
                                        <p
                                            className="fs-6 mb-0 fw-semibold"
                                            style={{
                                                color: isActive ? 'black' : 'rgba(0, 0, 0, 0.51)',
                                                fontWeight: isActive ? '700' : '500',
                                                cursor: isInProgress ? 'progress' : 'pointer',
                                                opacity: isInProgress ? 0.5 : 1,
                                            }}>
                                            {item?.label}
                                        </p>
                                    );
                                    // If item has children, render dropdown
                                    if (item.children && item.children.length > 0) {
                                        return (
                                            <div
                                                key={index}
                                                className="custom-dropdown"
                                                style={{ position: 'relative' }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent document click from closing immediately
                                                    handleDropdown(index);
                                                }}>
                                                <div style={{ cursor: 'pointer' }}>{menuLabel}</div>
                                                {openDropdown === index && (
                                                    <ul
                                                        className="dropdown-menu"
                                                        style={{
                                                            display: 'block',
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            zIndex: 1000,
                                                        }}>
                                                        {item.children.map((child, childIdx) => (
                                                            <li key={childIdx}>
                                                                <div
                                                                    className="dropdown-item"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenDropdown(null);
                                                                        navigate(child.url);
                                                                    }}
                                                                    style={{ cursor: 'pointer' ,fontSize:'13px' }}>
                                                                    {child.label}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    }

                                    return isInProgress ? (
                                        <OverlayTrigger
                                            key={index}
                                            placement="bottom"
                                            overlay={<Tooltip id={`tooltip-${index}`}>⏳ In Progress</Tooltip>}>
                                            <div>{menuLabel}</div>
                                        </OverlayTrigger>
                                    ) : (
                                        <div key={index} onClick={() => navigate(item?.url)}>
                                            {menuLabel}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                    <ul className="list-unstyled topbar-menu float-end mb-0">
                        <li className="dropdown notification-list"></li>
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
