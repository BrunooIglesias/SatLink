import '../public/globals.css';
import type { AppProps } from 'next/app';
import RootLayout from "@/containers/layouts/components/layout";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <RootLayout>
            <Component {...pageProps} />
        </RootLayout>
    );
}

export default MyApp;
