import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateUser from 'modules/Users/CreateUser';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateUser />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
