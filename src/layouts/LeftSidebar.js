// @flow
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import profilepic from "../assets/images/profilepic.png";
import { getMenuItems } from '../helpers/menu';

// components
import AppMenu from './Menu';

// images
import logoSm from '../assets/images/logo_sm.png';
import logoDark from '../assets/images/logo-dark.png';
import logoDarkSm from '../assets/images/logo_sm_dark.png';
import logo from '../assets/images/logo.png';
import helpBoxImage from '../assets/images/help-icon.svg';
import SimpleBar from 'simplebar-react';

import profileImg from '../assets/images/users/avatar-1.jpg';

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
            <div className="leftside-menu" ref={menuNodeRef} style={{ backgroundColor: "rgba(217, 217, 217, 0.25)" }}>
                {!hideLogo && (
                    <>
                        <Link to="/" className="logo text-center logo-light">
                            <span className="logo-lg" style={{ backgroundColor: "#D9D9D9" }}>
                                <img src={isLight ? logoDark : logo} alt="logo" height="30" />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? logoSm : logoDarkSm} alt="logo" height="16" />
                            </span>
                        </Link>

                        <Link to="/" className="logo text-center logo-dark">
                            <span className="logo-lg">
                                <img src={isLight ? logoDark : logo} alt="logo" height="16" />
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
                <div class="row">
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
                </div>
                <div class="row mx-auto">
                    <div class="col-12 text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#444141" }}>
                        <div class="add-new-patient p-2">
                            <h6 class="m-0 fw-bold fs-5">Add New Patient</h6>
                        </div>
                    </div>
                </div>

                <div class="row mx-auto">
                    <div class="col-12 my-1 ">
                        <p className='p-0 m-0' style={{ color: "#444141",fontSize:"10px" }}>Today Appointment</p>
                    </div>

                    <div className='all_appoinment px-0'>
                    <div class="col-12 px-2 py-1 border-top border-bottom add_hover_appoinment">
                        <div class="appointment-card row">
                            <div class="col-6">
                                <div className='row'>
                                    <div className='col-6'>
                                    <img src={profilepic} alt="Gladys" className=''style={{height:"40px",width:"40px"}} />

                                    </div>
                                    <div className='col-6 px-0 d-flex align-items-start justify-content-around flex-column'>
                                    <h6 className='p-0 mb-0 mt-0'style={{color:"#444141",fontWeight:"500"}}>Gladys</h6>
                                         <small className='p-0 m-0 add_small_size'>Back Pain</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-end justify-content-around flex-column">
                                <small class="mb-0 add_small_size diff_color" >07/11 08:00 AM</small>
                                <small className='add_small_size'> First Time</small>
                            </div>
                            
                        </div>
                    </div>
                    <div class="col-12 px-2 py-1 border-top border-bottom add_hover_appoinment">
                        <div class="appointment-card row">
                            <div class="col-6">
                                <div className='row'>
                                    <div className='col-6'>
                                    <img src={profilepic} alt="Gladys" className=''style={{height:"40px",width:"40px"}} />

                                    </div>
                                    <div className='col-6 px-0 d-flex align-items-start justify-content-around flex-column'>
                                    <h6 className='p-0 mb-0 mt-0'style={{color:"#444141",fontWeight:"500"}}>Gladys</h6>
                                         <small className='p-0 m-0 add_small_size'>Back Pain</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-end justify-content-around flex-column">
                                <small class="mb-0 add_small_size diff_color" >07/11 08:00 AM</small>
                                <small className='add_small_size'> First Time</small>
                            </div>
                            
                        </div>
                    </div>
                    <div class="col-12 px-2 py-1 border-top border-bottom add_hover_appoinment">
                        <div class="appointment-card row">
                            <div class="col-6">
                                <div className='row'>
                                    <div className='col-6'>
                                    <img src={profilepic} alt="Gladys" className=''style={{height:"40px",width:"40px"}} />

                                    </div>
                                    <div className='col-6 px-0 d-flex align-items-start justify-content-around flex-column'>
                                    <h6 className='p-0 mb-0 mt-0'style={{color:"#444141",fontWeight:"500"}}>Gladys</h6>
                                         <small className='p-0 m-0 add_small_size'>Back Pain</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-end justify-content-around flex-column">
                                <small class="mb-0 add_small_size diff_color" >07/11 08:00 AM</small>
                                <small className='add_small_size'> First Time</small>
                            </div>
                            
                        </div>
                    </div>
                    <div class="col-12 px-2 py-1 border-top border-bottom add_hover_appoinment">
                        <div class="appointment-card row">
                            <div class="col-6">
                                <div className='row'>
                                    <div className='col-6'>
                                    <img src={profilepic} alt="Gladys" className=''style={{height:"40px",width:"40px"}} />

                                    </div>
                                    <div className='col-6 px-0 d-flex align-items-start justify-content-around flex-column'>
                                    <h6 className='p-0 mb-0 mt-0'style={{color:"#444141",fontWeight:"500"}}>Gladys</h6>
                                         <small className='p-0 m-0 add_small_size'>Back Pain</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-end justify-content-around flex-column">
                                <small class="mb-0 add_small_size diff_color" >07/11 08:00 AM</small>
                                <small className='add_small_size'> First Time</small>
                            </div>
                            
                        </div>
                    </div>
                    <div class="col-12 px-2 py-1 border-top border-bottom add_hover_appoinment">
                        <div class="appointment-card row">
                            <div class="col-6">
                                <div className='row'>
                                    <div className='col-6'>
                                    <img src={profilepic} alt="Gladys" className=''style={{height:"40px",width:"40px"}} />

                                    </div>
                                    <div className='col-6 px-0 d-flex align-items-start justify-content-around flex-column'>
                                    <h6 className='p-0 mb-0 mt-0'style={{color:"#444141",fontWeight:"500"}}>Gladys</h6>
                                         <small className='p-0 m-0 add_small_size'>Back Pain</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-end justify-content-around flex-column">
                                <small class="mb-0 add_small_size diff_color" >07/11 08:00 AM</small>
                                <small className='add_small_size'> First Time</small>
                            </div>
                            
                        </div>
                    </div>
                    <div class="col-12 px-2 py-1 border-top border-bottom add_hover_appoinment">
                        <div class="appointment-card row">
                            <div class="col-6">
                                <div className='row'>
                                    <div className='col-6'>
                                    <img src={profilepic} alt="Gladys" className=''style={{height:"40px",width:"40px"}} />

                                    </div>
                                    <div className='col-6 px-0 d-flex align-items-start justify-content-around flex-column'>
                                    <h6 className='p-0 mb-0 mt-0'style={{color:"#444141",fontWeight:"500"}}>Gladys</h6>
                                         <small className='p-0 m-0 add_small_size'>Back Pain</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-end justify-content-around flex-column">
                                <small class="mb-0 add_small_size diff_color" >07/11 08:00 AM</small>
                                <small className='add_small_size'> First Time</small>
                            </div>
                            
                        </div>
                    </div>
                    </div>
                                      
                </div>
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
