import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateMatching from 'modules/Questions/CreateMatching';

export default function Drag() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateMatching />
                </div>
            </div>
        </>
    );
}

Drag.layout = Admin;
