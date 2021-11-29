import Admin from 'layouts/Admin';
import EditUser from 'modules/Users/EditUser';

export default function Edit() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <EditUser />
                </div>
            </div>
        </>
    );
}

Edit.layout = Admin;
