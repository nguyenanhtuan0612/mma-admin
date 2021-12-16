import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateCourse from 'modules/Courses/CreateCourse';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateCourse />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
