import Admin from 'layouts/Admin';
import EditTag from 'modules/Tags/EditTag';

export default function Edit() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <EditTag />
                </div>
            </div>
        </>
    );
}

Edit.layout = Admin;
