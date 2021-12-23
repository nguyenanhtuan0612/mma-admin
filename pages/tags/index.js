import React from 'react';
import Admin from 'layouts/Admin.js';
import TagsTable from '../../modules/Tags/TagsTable';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <TagsTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
