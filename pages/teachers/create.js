import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateTeacher from 'modules/Teachers/CreateTeacher';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateTeacher />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
