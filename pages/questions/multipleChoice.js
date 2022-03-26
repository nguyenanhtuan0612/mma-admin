import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateMultipleChoice from 'modules/Questions/CreateMultipleChoice';

export default function Drag() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateMultipleChoice />
                </div>
            </div>
        </>
    );
}

Drag.layout = Admin;
