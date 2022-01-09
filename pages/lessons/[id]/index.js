import Admin from 'layouts/Admin';
import DetailLesson from 'modules/Lessons/DetailLesson';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <DetailLesson />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
