import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateDrag from 'modules/Questions/CreateDrag';

export default function Drag() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateDrag />
                </div>
            </div>
        </>
    );
}

Drag.layout = Admin;
