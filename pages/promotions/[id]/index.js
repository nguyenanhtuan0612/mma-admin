import Admin from 'layouts/Admin';
import EditPromotions from 'modules/Promotions/EditPromotions';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <EditPromotions />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
