import { useRouter } from 'next/router';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const shouldShowHeader = router.pathname !== '/';

    return (
        <>
            <div className="antialiased h-screen">
                {shouldShowHeader && (
                    <header className="bg-gray-800 text-white text-center py-4 z-10">
                        <h1 className="text-2xl font-bold">Get your Landsat img!</h1>
                    </header>
                )}
                <main className="h-full">{children}</main>
            </div>
        </>
    );
}
