import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ThirdwebProvider } from "@thirdweb-dev/react"
import network from "lib/thirdweb/network"
import Head from "next/head"
import { Toaster } from "react-hot-toast"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Ebay Marketplace</title>
                <meta name="description" content="Marketplace built on the Matic test network" />
                <meta
                    property="og:title"
                    content="Ebay Marketplace: Mint items, List items, Buy items! Polygon(Mumbai) test network"
                />
                <link rel="icon" href="/two.png" />
            </Head>
            <ThirdwebProvider desiredChainId={network}>
                <Toaster />
                <Component {...pageProps} />
            </ThirdwebProvider>
        </>
    )
}

export default MyApp
