import React from 'react';
import Admin from 'layouts/Admin.js';
import DetailRatingTable from 'modules/Rating/DetailRatingTable';
export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <DetailRatingTable />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
