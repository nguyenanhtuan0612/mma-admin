import React from 'react';
import Admin from 'layouts/Admin.js';
import QuotesTable from 'modules/Quotes/QuotesTable.js';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <QuotesTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
