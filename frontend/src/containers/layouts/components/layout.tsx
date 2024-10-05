import Navbar from '@/components/navbar/navbar';
import { useRouter } from 'next/router';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const shouldShowHeader = router.pathname !== '/';

    return (
        <div className="antialiased min-h-screen flex flex-col">
            {shouldShowHeader && (
                <header>
                    <Navbar />
                </header>
            )}
            <main className="flex-1 mt-16">
                {children}
            </main>
        </div>
    );
}
