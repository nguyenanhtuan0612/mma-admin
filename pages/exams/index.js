import React from 'react';
import Admin from 'layouts/Admin.js';
import QuestionManage from 'modules/Questions/QuestionManage';

export default function Lessons() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <QuestionManage />
                </div>
            </div>
        </>
    );
}

Lessons.layout = Admin;
