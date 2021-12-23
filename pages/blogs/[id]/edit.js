import Admin from 'layouts/Admin';
import EditBlog from 'modules/Blogs/EditBlog';

export default function Edit() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <EditBlog />
                </div>
            </div>
        </>
    );
}

Edit.layout = Admin;
