import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';
import profileDummy from '../assets/images/profileDummy.png'

import { getMenuItems } from '../helpers/menu';
import { MdAdd } from "react-icons/md";

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
import { getPatientsAction } from '../redux/actions';
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
    const [search, setSearch] = useState('')
    const store = useSelector((state) => state)
    const navigate = useNavigate();

    /**
     * Handle the click anywhere in doc
     */
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
            <div className="leftside-menu" ref={menuNodeRef} style={{ backgroundColor: "#313A46" }}>

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

                {/* {!isCondensed && (
                    <SimpleBar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
                        <SideBarContent
                            menuClickHandler={() => { }}
                            isLight={isLight}
                            hideUserProfile={hideUserProfile}
                        />
                    </SimpleBar>
                )}
                {isCondensed && <SideBarContent isLight={isLight} hideUserProfile={hideUserProfile} />} */}
                {/* <div class="row">
                    <div class="col-12">
                        <div class="search-bar p-1">
                            <div class="input-group bg-white" style={{ border: "1px solid #D9D9D9", borderRadius: "8px", overflow: "hidden" }}>
                                <span class="input-group-text bg-white border-0 pe-0">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control border-0" placeholder="Search" aria-label="Search" />
                            </div>
                        </div>
                    </div>
                </div> */}
                <ul style={{ listStyle: 'none' }} className='px-0 mt-1'>
                    <li className='px-1 mb-1'>
                        <FormInput type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search..."  className='bg-white'/>
                    </li>
                    <li className={`px-1 mb-1`}>
                        <Link to='/apps/patients/new-patient'>
                            <Button
                                className='border-0 w-100 d-flex align-items-center justify-content-center text-black'
                                style={{
                                    height: '30px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: 'none',
                                }}
                            >
                               <MdAdd /> &nbsp; New Patient
                            </Button>
                        </Link>
                    </li>
                    <li className='px-1 mb-1 mt-2 text-white'>
                        Today's appointments
                    </li>
                    {store?.getPatientsReducer?.loading ?
                        <div className='text-center my-5'>
                            <Spinner color='white' />
                        </div>
                        :
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((data, index) => (
                            <li
                                key={index}
                                className={`py-1 cursor-pointer patient-item px-1 d-flex justify-content-between`}
                                style={{ borderBottom: '1px solid rgb(127 123 123 / 67%)' }}
                                onClick={() => navigate(`/apps/patients/new-patient`)}
                            >
                                <div className="d-flex gap-2 align-items-center">
                                    <img
                                        height='40'
                                        width='40'
                                        src={profileDummy}
                                        // style={{ height: '5vh' }}
                                        className="rounded-circle border border-black"
                                        alt="profile image"
                                    />
                                    <div>
                                        <p className="mb-0 text-capitalize" style={{ fontSize: '12px' }}>
                                            Glayn
                                        </p>
                                        <p className="mb-0 " style={{ fontSize: '10px' }}>Fever & Cold</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className='mb-0' style={{ fontSize: '10px' }}><span>07/11</span><span className='ps-1 '>08:00AM</span></p>
                                    </div>
                                    <div>
                                        <p className='mb-0 text-end pt-1' style={{ fontSize: '10px' }}>First Time</p>
                                    </div>

                                </div>
                            </li>
                        ))
                    }
                </ul>
            
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
