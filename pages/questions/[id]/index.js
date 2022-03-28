import React from 'react';
import Admin from 'layouts/Admin.js';
import UpdateQuestions from 'modules/Questions/UpdateQuestions';

export default function Drag() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <UpdateQuestions />
                </div>
            </div>
        </>
    );
}

Drag.layout = Admin;
