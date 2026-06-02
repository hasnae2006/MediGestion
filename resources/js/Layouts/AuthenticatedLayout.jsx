import AppLayout from '../Pages/Layout';

export default function AuthenticatedLayout({ header, children }) {
    return (
        <AppLayout>
            {header && (
                <div style={{ marginBottom: 20 }}>
                    {header}
                </div>
            )}
            {children}
        </AppLayout>
    );
}
