import React from 'react';
import Admin from 'layouts/Admin.js';
import BlogsTable from 'modules/Blogs/BlogsTable.js';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <BlogsTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
