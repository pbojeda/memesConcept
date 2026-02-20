
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md fixed h-full">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin/products" className="block px-4 py-2 hover:bg-gray-50 rounded text-gray-700 font-medium">
                        Products
                    </Link>
                    <Link href="/" className="block px-4 py-2 hover:bg-gray-50 rounded text-gray-500 mt-8">
                        ← Back to Store
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 ml-64">
                {children}
            </main>
        </div>
    );
}
