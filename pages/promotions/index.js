import Admin from 'layouts/Admin';
import PromotionsTable from 'modules/Promotions/PromotionsTable';
import React from 'react';

export default function index() {
    return <PromotionsTable />;
}

index.layout = Admin;
