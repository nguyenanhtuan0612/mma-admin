import React from 'react';
import Admin from 'layouts/Admin.js';
import UsersTable from 'components/Tables/UsersTable';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <UsersTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
