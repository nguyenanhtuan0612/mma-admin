import Admin from 'layouts/Admin';
import BlogDetail from 'modules/Blogs/BlogDetail';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <BlogDetail />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
