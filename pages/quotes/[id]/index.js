import Admin from 'layouts/Admin';
import QuoteDetail from 'modules/Quotes/QuoteDetail';

export default function index() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <QuoteDetail />
                </div>
            </div>
        </>
    );
}

index.layout = Admin;
