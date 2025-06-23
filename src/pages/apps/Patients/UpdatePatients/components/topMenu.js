import { useState } from 'react'
import { Col } from 'react-bootstrap';
import { encryptMessage } from '../../../../../cryptoUtils';
import { patientMenuItems } from '../../../../../utils/patientChartUiData';
const TopMenu = (props) => {
    const { selectedMainTab, setSelectedMainTab } = props;
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const handleSelectTab = (e, item) => {
        e?.stopPropagation();
        if (item.subItems) {
            toggleSubmenu(item.label);
        } else {
            // setActiveKey('0')
            setSelectedMainTab(item.tab);
            sessionStorage.setItem('selectedMainTab', encryptMessage(item.tab));
            // setActiveSubmenu(null);
        }
    }

    const toggleSubmenu = (label) => {
        setActiveSubmenu((prev) => (prev === label ? null : label));
    };
    return (
        <Col xs={12}>
            <ul className='list-group border border-muted d-flex flex-row patientChartscroll position-relative list-unstyled '>
                {patientMenuItems?.map((item, index) => (
                    <li className={`cursor-pointer px-0 p-1 fs-6 text-nowrap list-group-item  
                                                        py-1 flex-fill text-center position-relative fw-bold
                                                        ${item?.subItems ? 'hasSubmenuItems' : ''}
                                                        ${selectedMainTab === item?.tab ||
                            item?.subItems?.some((sub) => sub.tab === selectedMainTab)
                            ? 'active-patient-chart-tab fw-medium'
                            : ''
                        }`}
                        onClick={(e) => handleSelectTab(e, item)}>
                        <div>
                            <span className="px-1 d-flex gap-2 align-items-center justify-content-center">
                                {item.label}
                                {item?.subItems && (
                                    <span>
                                        {activeSubmenu === item.label ? (
                                            <i className="bi bi-chevron-up" />
                                        ) : (
                                            <i className="bi bi-chevron-down" />
                                        )}
                                    </span>
                                )}
                            </span>
                        </div>
                        {activeSubmenu === item.label && item.subItems && (
                            <ul className="list-group position-absolute start-0 top-100 mt-1 bg-white shadow rounded w-100 z-3">
                                {item.subItems.map((subItem, subIndex) => (
                                    <li
                                        key={subIndex}
                                        onClick={() => {
                                            setSelectedMainTab(subItem.tab);
                                            sessionStorage.setItem('selectedMainTab', subItem.tab);
                                        }}
                                        className="list-group-item submenuItem py-1 text-start fs-6">
                                        {subItem.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                ))}
                <li
                    className="list-group-item py-1 text-center fs-6 position-relative cursor-pointer"
                    onClick={() => setShowMoreMenu((prev) => !prev)}>
                    <i className="bi bi-three-dots" />
                    {showMoreMenu && (
                        <ul className="list-group position-absolute end-50 top-100 mt-1  shadow rounded w-auto z-3">
                            {patientMenuItems?.slice(9)?.map((data, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setSelectedMainTab(data.tab);
                                        sessionStorage.setItem('selectedMainTab', data.tab);
                                        setShowMoreMenu(false);
                                    }}
                                    className="list-group-item  py-1 text-start fs-6">
                                    {data.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        </Col>
    )
}

export default TopMenu;