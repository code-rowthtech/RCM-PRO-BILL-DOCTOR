import React from 'react';
import { Button } from 'react-bootstrap';

const TabButtons = ({ onClick, active, children }) => {
    return (
        <div >
            <Button
                onClick={onClick}
                className={`w-100 text-nowrap bg-transparent rounded text-black ${active ? 'fw-bold' : ''}`}
                style={{
                    border: 'none', // Removes all borders, including shadow
                    borderBottom: active ? '2px solid black' : 'none', // Adds border only when active
                    boxShadow: 'none', // Ensures no shadow
                }}
            >
                {children}
            </Button>

        </div>
    );
};

export default TabButtons;
