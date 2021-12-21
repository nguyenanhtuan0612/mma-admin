import Admin from 'layouts/Admin';
import CourseDetail from 'modules/Courses/CourseDetail';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <CourseDetail />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
