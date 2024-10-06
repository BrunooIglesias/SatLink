import Navbar from '@/components/navbar/navbar';
import { useRouter } from 'next/router';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const shouldShowHeader = router.pathname !== '/';

    return (
        <div className="antialiased min-h-screen flex flex-col">
            {shouldShowHeader && (
                <header className="fixed w-full top-0 z-50">
                    <Navbar />
                </header>
            )}
            <main className="flex-1" style={{ paddingTop: '64px' }}>
                {children}
            </main>
        </div>
    );
}
