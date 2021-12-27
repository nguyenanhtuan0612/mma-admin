import Admin from 'layouts/Admin';
import EditPage from 'modules/Pages/EditPage';

export default function Edit() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <EditPage />
                </div>
            </div>
        </>
    );
}

Edit.layout = Admin;
