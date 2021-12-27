import React from 'react';
import Admin from 'layouts/Admin.js';
import CreateQuote from 'modules/Quotes/CreateQuote';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CreateQuote />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
