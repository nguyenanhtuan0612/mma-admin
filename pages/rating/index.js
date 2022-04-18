import React from 'react';
import Admin from 'layouts/Admin.js';
import CoursesRatingTable from 'modules/Rating/CoursesRatingTable';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CoursesRatingTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
