import React from 'react';
import Admin from 'layouts/Admin.js';
import CreatePage from 'modules/Pages/CreatePage';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreatePage />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
