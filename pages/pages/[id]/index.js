import Admin from 'layouts/Admin';
import PageDetail from 'modules/Pages/PageDetail';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <PageDetail />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
