import React from 'react';
import Admin from 'layouts/Admin.js';
import CoursesTable from 'modules/Courses/CoursesTable';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CoursesTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
