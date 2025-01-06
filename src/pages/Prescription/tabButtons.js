import React from 'react';
import { Button } from 'react-bootstrap';

const TabButtons = ({ onClick, active, children }) => {
    return (
        <div >
            <Button
                onClick={onClick}
                className={` w-100 text-nowrap  ${active
                        ? ' border-0  '
                        : ' border-0 bg-secondary'
                    }`}
            >
                {children}
            </Button>
        </div>
    );
};

export default TabButtons;
