import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateLesson from 'modules/Lessons/CreateLesson';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateLesson />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
