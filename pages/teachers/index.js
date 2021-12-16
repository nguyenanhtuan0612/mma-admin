import React from 'react';
import Admin from 'layouts/Admin.js';
import TeachersTable from '../../modules/Teachers/TeachersTable';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <TeachersTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
