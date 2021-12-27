import Admin from 'layouts/Admin';
import EditQuote from 'modules/Quotes/EditQuote';

export default function Edit() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <EditQuote />
                </div>
            </div>
        </>
    );
}

Edit.layout = Admin;
