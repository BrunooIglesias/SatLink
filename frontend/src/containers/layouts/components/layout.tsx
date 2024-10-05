import Navbar from '@/components/navbar/navbar';
import { useRouter } from 'next/router';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const shouldShowHeader = router.pathname !== '/';

    return (
        <>
            <div className="antialiased h-screen">
                {shouldShowHeader && (
                    <Navbar></Navbar>
                )}
                <main className="h-full">{children}</main>
            </div>
        </>
    );
}
