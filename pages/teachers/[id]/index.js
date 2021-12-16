import Admin from 'layouts/Admin';
import EditTeacher from 'modules/Teachers/EditTeacher';

export default function Edit() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <EditTeacher />
                </div>
            </div>
        </>
    );
}

Edit.layout = Admin;
