import React from 'react';
import Admin from 'layouts/Admin.js';
import LessonsTable from 'modules/Courses/LessonsTable';

export default function Lessons() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <LessonsTable />
                </div>
            </div>
        </>
    );
}

Lessons.layout = Admin;
