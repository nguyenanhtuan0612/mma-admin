import Admin from 'layouts/Admin';
import UserDetail from 'modules/Users/UserDetail';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <UserDetail />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
