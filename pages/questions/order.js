import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateOrder from 'modules/Questions/CreateOrder';

export default function Drag() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateOrder />
                </div>
            </div>
        </>
    );
}

Drag.layout = Admin;
