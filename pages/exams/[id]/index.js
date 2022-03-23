import React from 'react';
import Admin from 'layouts/Admin.js';
import ExamsTable from 'modules/Exams/ExamsTable';

export default function Lessons() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <ExamsTable />
                </div>
            </div>
        </>
    );
}

Lessons.layout = Admin;
