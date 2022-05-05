import Admin from 'layouts/Admin';
import CreatePromotions from 'modules/Promotions/CreatePromotions';
import React from 'react';

export default function create() {
    return <CreatePromotions />;
}

create.layout = Admin;
