import React from 'react';
import Admin from 'layouts/Admin.js';
import PagesTable from 'modules/Pages/PagesTable';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <PagesTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
